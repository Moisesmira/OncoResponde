const jsonResponse = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
});

const cleanText = (value, maxLength = 3600) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, maxLength) : '';

export default async (req) => {
  if (req.method !== 'POST') return jsonResponse({ error: 'Método no permitido' }, 405);

  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return jsonResponse({ error: 'OPENAI_API_KEY no está configurada en Netlify.' }, 500);

  try {
    const body = await req.json();
    const text = cleanText(body?.text);
    const language = body?.language === 'ca' ? 'ca' : body?.language === 'en' ? 'en' : 'es';

    if (!text) return jsonResponse({ error: 'No hay texto para leer.' }, 400);

    const languageInstruction = language === 'ca'
      ? 'Parla en català central, amb pronunciació clara i natural.'
      : language === 'en'
        ? 'Speak in clear, natural international English.'
        : 'Habla exclusivamente en español de España (castellano peninsular estándar), con pronunciación clara y natural. Usa la entonación y el ritmo propios de España, con distinción entre s y z/c cuando corresponda. Evita el seseo, el voseo y cualquier acento o entonación latinoamericana.';

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        voice: 'coral',
        input: text,
        response_format: 'mp3',
        instructions: `${languageInstruction} Para español, utiliza una voz femenina adulta de España, cálida, serena y cercana, como una profesional sanitaria española que explica algo con tranquilidad. Mantén un ritmo pausado, natural y conversacional, con empatía contenida y profesional. Pronuncia con claridad nombres de pruebas, tratamientos, cifras y siglas. Evita sonar publicitaria, infantil, dramática, robótica o excesivamente entusiasta. Haz pausas breves entre ideas para facilitar la comprensión de una persona preocupada.`,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('OpenAI TTS error:', response.status, details);
      return jsonResponse({ error: 'No se ha podido generar la voz natural.' }, 502);
    }

    const audio = await response.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
        'Content-Disposition': 'inline; filename="oncoresponde-voz.mp3"',
      },
    });
  } catch (error) {
    console.error('Voice function error:', error);
    return jsonResponse({ error: 'No se ha podido preparar el audio.' }, 500);
  }
};
