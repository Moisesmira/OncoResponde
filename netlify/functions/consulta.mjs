const sources = [
  { name: 'Sociedad Española de Oncología Médica (SEOM)', url: 'https://seom.org/' },
  { name: 'National Cancer Institute (NCI)', url: 'https://www.cancer.gov/' },
  { name: 'NCCN Guidelines for Patients', url: 'https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients' },
];

const basePrompt = `Eres OncoResponde, un asistente de educación sanitaria y acompañamiento para pacientes oncológicos y familiares.
Tu función es orientar, no diagnosticar. Nunca sustituyas al equipo sanitario, no solicites datos identificativos y no recomiendes iniciar, suspender o modificar medicación o tratamientos.
Responde en español claro, empático, no paternalista y con frases breves. Valida la preocupación cuando proceda y evita listas largas o promesas terapéuticas.
Incluye medidas prácticas y explica cuándo contactar con el equipo sanitario o con urgencias.`;

const contextPrompts = {
  alimentacion: `Tema: alimentación durante el proceso oncológico. Considera apetito, náuseas, vómitos, diarrea, estreñimiento, mucositis, alteraciones del gusto, hidratación y seguridad alimentaria. Evita dietas milagro y suplementos sin supervisión. Señala riesgo de deshidratación, incapacidad para ingerir líquidos, vómitos persistentes o pérdida de peso rápida.`,
  ejercicio: `Tema: ejercicio durante el proceso oncológico. Propón actividad gradual y adaptada a energía, tratamiento, dolor y capacidad funcional. Indica detenerse y consultar ante dolor torácico, síncope, dificultad respiratoria nueva, fiebre, sangrado o dolor intenso. No fijes objetivos universales si faltan datos clínicos.`,
  dormir: `Tema: sueño y descanso. Prioriza higiene del sueño y estrategias conductuales realistas. Considera dolor, ansiedad, sofocos, corticoides u otros efectos del tratamiento, pero no indiques cambios farmacológicos. Recomienda consultar si el insomnio persiste, altera claramente el funcionamiento o se asocia a síntomas relevantes.`,
  mindfulness: `Tema: mindfulness y relajación. Propón prácticas breves, accesibles y opcionales. No presentes mindfulness como tratamiento del cáncer ni como obligación. Si aumenta la angustia, recomienda detener la práctica y buscar otra estrategia o apoyo profesional.`,
  'bienestar-emocional': `Tema: bienestar emocional. Empieza validando la emoción sin dramatizar. Ofrece uno o dos pasos concretos y apoyo social o profesional. Si la pregunta sugiere autolesión, suicidio, desesperanza extrema o peligro inmediato, prioriza una recomendación clara de ayuda urgente (112/061 en España), no dejes a la persona sola y evita una respuesta genérica.`,
  comunicacion: `Tema: comunicación con familia, hijos y equipo sanitario. Ayuda a preparar conversaciones claras, respetuosas y adaptadas a la edad. Ofrece frases modelo breves y preguntas útiles, sin imponer cuánto debe contar la persona.`,
  respiracion: `Tema: respiración y regulación de la tensión. Propón ejercicios suaves, sin hiperventilar ni mantener la respiración de forma prolongada. Si hay dificultad respiratoria nueva o intensa, dolor torácico, coloración azulada, confusión o desmayo, indica atención urgente.`,
  general: `Tema: consulta oncológica general. Limita la respuesta a educación sanitaria prudente y recomienda valoración profesional cuando falten datos clínicos relevantes.`,
};

const cleanText = (value, maxLength) => typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const parseModelJson = (text) => {
  const cleaned = text.replace(/^```json\s*|\s*```$/g, '').trim();
  return JSON.parse(cleaned);
};

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY no está configurada en Netlify' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await req.json();
    const question = cleanText(body.question, 1200);
    const contextId = cleanText(body.contextId, 60);
    const clientContext = cleanText(body.context, 900);
    const profileContext = cleanText(body.profileContext, 700);

    if (!question) {
      return new Response(JSON.stringify({ error: 'La pregunta está vacía' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const clinicalContext = contextPrompts[contextId] ?? contextPrompts.general;
    const optionalProfile = profileContext
      ? `Perfil opcional declarado por la persona y no verificado clínicamente: ${profileContext}. Úsalo solo para adaptar el lenguaje y la orientación; no infieras diagnósticos ni decisiones terapéuticas.`
      : 'No hay perfil clínico opcional disponible.';

    const prompt = `${basePrompt}\n${clinicalContext}\n${optionalProfile}\nContexto adicional de la interfaz: ${clientContext || 'ninguno'}.\n
Devuelve exclusivamente JSON válido con estas claves:
- summary: una frase con la idea principal.
- answer: respuesta de máximo 180 palabras.
- actions: exactamente 3 recomendaciones prácticas y prudentes.
- whenToConsult: señales para consultar al equipo o pedir ayuda urgente.
- followUp: una única pregunta breve y opcional para comprender mejor la situación, sin pedir datos identificativos.

Pregunta de la persona: ${question}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 24000);

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        input: prompt,
        max_output_tokens: 650,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const raw = await response.json();
    if (!response.ok) throw new Error(raw?.error?.message || 'Error de OpenAI');

    const text = raw.output_text || raw.output?.flatMap((item) => item.content || []).map((item) => item.text || '').join('') || '';
    const parsed = parseModelJson(text);

    const payload = {
      summary: cleanText(parsed.summary, 350),
      answer: cleanText(parsed.answer, 2200),
      actions: Array.isArray(parsed.actions) ? parsed.actions.map((item) => cleanText(item, 320)).filter(Boolean).slice(0, 3) : [],
      whenToConsult: cleanText(parsed.whenToConsult, 900),
      followUp: cleanText(parsed.followUp, 300),
      sources,
    };

    return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'La consulta ha tardado demasiado.' : error?.message || 'Error inesperado';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
