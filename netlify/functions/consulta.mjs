const baseSources = [
  { name: 'Sociedad Española de Oncología Médica (SEOM)', url: 'https://seom.org/' },
  { name: 'National Cancer Institute (NCI)', url: 'https://www.cancer.gov/' },
  { name: 'NCCN Guidelines for Patients', url: 'https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients' },
  { name: 'MedlinePlus en español', url: 'https://medlineplus.gov/spanish/cancer.html' },
];

const sourceByContext = {
  alimentacion: [{ name: 'NCI: Nutrition in Cancer Care', url: 'https://www.cancer.gov/about-cancer/treatment/side-effects/appetite-loss/nutrition-pdq' }],
  ejercicio: [{ name: 'American College of Sports Medicine: Moving Through Cancer', url: 'https://www.exerciseismedicine.org/eim-in-action/moving-through-cancer/' }],
  'bienestar-emocional': [{ name: 'AECC: apoyo y acompañamiento', url: 'https://www.contraelcancer.es/es/te-ayudamos' }],
  comunicacion: [{ name: 'NCI: Communication in Cancer Care', url: 'https://www.cancer.gov/about-cancer/coping/adjusting-to-cancer/communication-pdq' }],
};

const basePrompt = `Eres OncoResponde, un asistente de educación sanitaria y acompañamiento para pacientes oncológicos y familiares.
Tu función es orientar, no diagnosticar. Nunca sustituyas al equipo sanitario, no solicites datos identificativos y no recomiendes iniciar, suspender o modificar medicación o tratamientos.
Responde en español claro, empático, no paternalista y con frases breves. Valida la preocupación cuando proceda y evita listas largas o promesas terapéuticas.
Incluye medidas prácticas y explica cuándo contactar con el equipo sanitario o con urgencias.`;

const contextPrompts = {
  alimentacion: `Tema: alimentación durante el proceso oncológico. Considera apetito, náuseas, vómitos, diarrea, estreñimiento, mucositis, alteraciones del gusto, hidratación y seguridad alimentaria. Evita dietas milagro y suplementos sin supervisión.`,
  ejercicio: `Tema: ejercicio durante el proceso oncológico. Propón actividad gradual y adaptada a energía, tratamiento, dolor y capacidad funcional. Indica detenerse y consultar ante dolor torácico, síncope, dificultad respiratoria nueva, fiebre, sangrado o dolor intenso.`,
  dormir: `Tema: sueño y descanso. Prioriza higiene del sueño y estrategias conductuales realistas. No indiques cambios farmacológicos.`,
  mindfulness: `Tema: mindfulness y relajación. Propón prácticas breves, accesibles y opcionales. No presentes mindfulness como tratamiento del cáncer.`,
  'bienestar-emocional': `Tema: bienestar emocional. Empieza validando la emoción. Si sugiere autolesión, suicidio, desesperanza extrema o peligro inmediato, indica ayuda urgente 112/061 en España y no dejar sola a la persona.`,
  comunicacion: `Tema: comunicación con familia, hijos y equipo sanitario. Ofrece frases modelo breves y preguntas útiles, sin imponer cuánto debe contar la persona.`,
  respiracion: `Tema: respiración y regulación de la tensión. Propón ejercicios suaves. Si hay dificultad respiratoria nueva o intensa, dolor torácico, coloración azulada, confusión o desmayo, indica atención urgente.`,
  general: `Tema: consulta oncológica general. Limita la respuesta a educación sanitaria prudente.`,
};

const tumorPrompts = {
  mama: `Perfil tumoral: cáncer de mama. Ten en cuenta, solo si es relevante, cirugía mamaria, radioterapia, hormonoterapia, fatiga, menopausia inducida, imagen corporal y riesgo de linfedema. No asumas que todos estos problemas están presentes.`,
  prostata: `Perfil tumoral: cáncer de próstata. Ten en cuenta, solo si es relevante, hormonoterapia, salud ósea y muscular, incontinencia, suelo pélvico, sexualidad y efectos urinarios o intestinales.`,
  pulmon: `Perfil tumoral: cáncer de pulmón. Prioriza prudencia ante disnea, tos, dolor torácico, pérdida de peso y fatiga. Diferencia estrategias de autocuidado de señales que requieren valoración urgente.`,
  colorrectal: `Perfil tumoral: cáncer colorrectal. Considera, si procede, cambios intestinales, diarrea, estreñimiento, ostomía, hidratación, cirugía y neuropatía por tratamiento.`,
  ginecologico: `Perfil tumoral: cáncer ginecológico. Considera, si procede, cirugía pélvica, menopausia, suelo pélvico, sexualidad, linfedema y cambios de imagen corporal.`,
  'cabeza-cuello': `Perfil tumoral: cáncer de cabeza y cuello. Considera, si procede, deglución, mucositis, xerostomía, voz, nutrición, dolor y riesgo de aspiración.`,
  otro: `Perfil tumoral: otro tipo de cáncer. No extrapoles recomendaciones específicas de un tumor sin datos suficientes.`,
};

const cleanText = (value, maxLength) => typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
const parseModelJson = (text) => JSON.parse(text.replace(/^```json\s*|\s*```$/g, '').trim());

export default async (req) => {
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: 'OPENAI_API_KEY no está configurada en Netlify' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  try {
    const body = await req.json();
    const question = cleanText(body.question, 1200);
    const contextId = cleanText(body.contextId, 60);
    const clientContext = cleanText(body.context, 900);
    const profileContext = cleanText(body.profileContext, 700);
    const cancerType = cleanText(body.cancerType, 40);
    if (!question) return new Response(JSON.stringify({ error: 'La pregunta está vacía' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const clinicalContext = contextPrompts[contextId] ?? contextPrompts.general;
    const tumorContext = tumorPrompts[cancerType] ?? 'No hay un tipo tumoral guardado o no debe asumirse ninguno.';
    const optionalProfile = profileContext
      ? `Perfil opcional declarado por la persona y no verificado clínicamente: ${profileContext}. Úsalo solo para adaptar la orientación. No infieras diagnósticos, pronóstico ni decisiones terapéuticas.`
      : 'No hay perfil clínico opcional disponible.';

    const prompt = `${basePrompt}\n${clinicalContext}\n${tumorContext}\n${optionalProfile}\nContexto adicional de la interfaz: ${clientContext || 'ninguno'}.\n
Devuelve exclusivamente JSON válido con estas claves:
- summary: una frase con la idea principal.
- answer: explicación clara de máximo 180 palabras, personalizada solo cuando los datos aportados sean relevantes.
- actions: exactamente 3 recomendaciones prácticas y prudentes.
- whenToConsult: señales para consultar al equipo o pedir ayuda urgente.
- followUp: una única pregunta breve y opcional, sin pedir datos identificativos.
- personalizationNote: una frase breve indicando si se ha usado el perfil opcional; no repetir datos sensibles.

Pregunta de la persona: ${question}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 24000);
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-5-mini', input: prompt, max_output_tokens: 750 }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const raw = await response.json();
    if (!response.ok) throw new Error(raw?.error?.message || 'Error de OpenAI');
    const text = raw.output_text || raw.output?.flatMap((item) => item.content || []).map((item) => item.text || '').join('') || '';
    const parsed = parseModelJson(text);
    const contextualSources = sourceByContext[contextId] ?? [];

    const payload = {
      summary: cleanText(parsed.summary, 350),
      answer: cleanText(parsed.answer, 2200),
      actions: Array.isArray(parsed.actions) ? parsed.actions.map((item) => cleanText(item, 320)).filter(Boolean).slice(0, 3) : [],
      whenToConsult: cleanText(parsed.whenToConsult, 900),
      followUp: cleanText(parsed.followUp, 300),
      personalizationNote: cleanText(parsed.personalizationNote, 220) || (profileContext ? 'Respuesta adaptada al perfil opcional guardado en este dispositivo.' : 'Respuesta general; no se ha utilizado un perfil clínico guardado.'),
      sources: [...contextualSources, ...baseSources].slice(0, 5),
    };
    return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'La consulta ha tardado demasiado.' : error?.message || 'Error inesperado';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
