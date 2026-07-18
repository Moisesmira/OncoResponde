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
  sintomas: [
    { name: 'NCI: Side Effects of Cancer Treatment', url: 'https://www.cancer.gov/about-cancer/treatment/side-effects' },
    { name: 'NCI: Infection and Neutropenia', url: 'https://www.cancer.gov/about-cancer/treatment/side-effects/infection' },
  ],
  familia: [{ name: 'AECC: apoyo a pacientes y familiares', url: 'https://www.contraelcancer.es/es/te-ayudamos' }],
  camino: [{ name: 'NCI: Coping with Cancer', url: 'https://www.cancer.gov/about-cancer/coping' }],
  informes: [
    { name: 'MedlinePlus: Cómo entender la información médica', url: 'https://medlineplus.gov/spanish/understandingmedicalresearch.html' },
    { name: 'NCI: Understanding Cancer Prognosis', url: 'https://www.cancer.gov/about-cancer/diagnosis-staging/prognosis' },
  ],
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
  sintomas: `Tema: síntomas declarados en un diario personal. No diagnostiques ni atribuyas causalidad. Prioriza autocuidado prudente, hidratación, descanso y comunicación con el equipo. Identifica señales de alarma, especialmente fiebre durante tratamiento, dificultad respiratoria, dolor intenso, confusión, desmayo, sangrado, vómitos persistentes o incapacidad para beber. No recomiendes medicación ni cambios de tratamiento.`,
  informes: `Tema: explicación educativa de un informe clínico aportado por la persona. Resume únicamente lo que consta en el texto, traduce términos médicos a lenguaje claro y diferencia hechos escritos de explicaciones generales. No completes datos ausentes, no diagnostiques, no establezcas pronóstico, no concluyas respuesta al tratamiento y no sugieras iniciar, suspender o cambiar tratamientos. Propón preguntas concretas para comentar con el equipo sanitario. Si el fragmento es incompleto o ambiguo, dilo expresamente.`,
  familia: `Tema: familiares y cuidadores. Valida la carga emocional, ofrece comunicación práctica, reparto de tareas y autocuidado. No atribuyas responsabilidades ni sustituyas apoyo profesional.`,
  camino: `Tema: diario personal y acompañamiento emocional. Responde con escucha y validación, sin interpretar psicológicamente ni diagnosticar. Sugiere un paso breve y realista.`,
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

const jsonResponse = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
});

const safeJsonParse = (text) => {
  if (!text || !text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const extractOutputText = (raw) => {
  if (typeof raw?.output_text === 'string' && raw.output_text.trim()) return raw.output_text.trim();
  if (!Array.isArray(raw?.output)) return '';

  return raw.output
    .flatMap((item) => Array.isArray(item?.content) ? item.content : [])
    .map((content) => {
      if (typeof content?.text === 'string') return content.text;
      if (typeof content?.text?.value === 'string') return content.text.value;
      return '';
    })
    .filter(Boolean)
    .join('')
    .trim();
};

const parseModelJson = (text) => {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const direct = safeJsonParse(cleaned);
  if (direct) return direct;

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const extracted = safeJsonParse(cleaned.slice(firstBrace, lastBrace + 1));
    if (extracted) return extracted;
  }

  throw new Error('OpenAI no devolvió una respuesta con el formato esperado. Inténtalo de nuevo.');
};

const responseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    answer: { type: 'string' },
    actions: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: { type: 'string' },
    },
    whenToConsult: { type: 'string' },
    followUp: { type: 'string' },
    personalizationNote: { type: 'string' },
  },
  required: ['summary', 'answer', 'actions', 'whenToConsult', 'followUp', 'personalizationNote'],
};

export default async (req) => {
  if (req.method !== 'POST') return jsonResponse({ error: 'Método no permitido' }, 405);

  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return jsonResponse({ error: 'OPENAI_API_KEY no está configurada en Netlify.' }, 500);

  try {
    const requestText = await req.text();
    const body = safeJsonParse(requestText);
    if (!body) return jsonResponse({ error: 'La solicitud recibida no es válida.' }, 400);

    const question = cleanText(body.question, 1200);
    const contextId = cleanText(body.contextId, 60);
    const clientContext = cleanText(body.context, contextId === 'informes' ? 8000 : 900);
    const profileContext = cleanText(body.profileContext, 700);
    const cancerType = cleanText(body.cancerType, 40);
    if (!question) return jsonResponse({ error: 'La pregunta está vacía.' }, 400);

    const clinicalContext = contextPrompts[contextId] ?? contextPrompts.general;
    const tumorContext = tumorPrompts[cancerType] ?? 'No hay un tipo tumoral guardado o no debe asumirse ninguno.';
    const optionalProfile = profileContext
      ? `Perfil opcional declarado por la persona y no verificado clínicamente: ${profileContext}. Úsalo solo para adaptar la orientación. No infieras diagnósticos, pronóstico ni decisiones terapéuticas.`
      : 'No hay perfil clínico opcional disponible.';

    const prompt = `${basePrompt}\n${clinicalContext}\n${tumorContext}\n${optionalProfile}\nContexto adicional de la interfaz: ${clientContext || 'ninguno'}.\n
Responde respetando el formato solicitado. La explicación debe tener un máximo aproximado de 180 palabras. Incluye exactamente tres recomendaciones prácticas y prudentes.

Pregunta de la persona: ${question}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    let response;

    try {
      response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini',
          input: prompt,
          max_output_tokens: 1100,
          text: {
            format: {
              type: 'json_schema',
              name: 'oncoresponde_answer',
              strict: true,
              schema: responseSchema,
            },
          },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const openAiText = await response.text();
    const raw = safeJsonParse(openAiText);

    if (!response.ok) {
      const openAiMessage = cleanText(raw?.error?.message, 600);
      if (response.status === 401) throw new Error('La clave de OpenAI no es válida o no tiene acceso. Revisa OPENAI_API_KEY en Netlify.');
      if (response.status === 429) throw new Error('OpenAI ha rechazado temporalmente la consulta por límite de uso o saldo. Revisa la facturación y vuelve a intentarlo.');
      throw new Error(openAiMessage || `OpenAI devolvió un error (${response.status}).`);
    }

    if (!raw) throw new Error('OpenAI devolvió una respuesta vacía o no válida. Inténtalo de nuevo.');

    const text = extractOutputText(raw);
    if (!text) throw new Error('OpenAI no devolvió contenido. Inténtalo de nuevo.');

    const parsed = parseModelJson(text);
    const contextualSources = sourceByContext[contextId] ?? [];

    const payload = {
      summary: cleanText(parsed.summary, 350),
      answer: cleanText(parsed.answer, 2200),
      actions: Array.isArray(parsed.actions)
        ? parsed.actions.map((item) => cleanText(item, 320)).filter(Boolean).slice(0, 3)
        : [],
      whenToConsult: cleanText(parsed.whenToConsult, 900),
      followUp: cleanText(parsed.followUp, 300),
      personalizationNote: cleanText(parsed.personalizationNote, 220)
        || (profileContext
          ? 'Respuesta adaptada al perfil opcional guardado en este dispositivo.'
          : 'Respuesta general; no se ha utilizado un perfil clínico guardado.'),
      sources: [...contextualSources, ...baseSources].slice(0, 5),
    };

    return jsonResponse(payload);
  } catch (error) {
    const message = error?.name === 'AbortError'
      ? 'La consulta ha tardado demasiado. Inténtalo de nuevo.'
      : cleanText(error?.message, 700) || 'Se ha producido un error inesperado.';
    return jsonResponse({ error: message }, 500);
  }
};
