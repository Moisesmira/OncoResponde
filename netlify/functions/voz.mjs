const ONCORESPONDE_VOICE_ID = 'dNjJKg63Fr5AXwIdkATa'; // Voz predeterminada e inmutable de OncoResponde

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

  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse({
      error: 'ELEVENLABS_API_KEY no está configurada en Netlify.',
      code: 'ELEVENLABS_NOT_CONFIGURED',
    }, 503);
  }

  try {
    const body = await req.json();
    const text = cleanText(body?.text);
    const language = body?.language === 'ca' ? 'ca' : body?.language === 'en' ? 'en' : 'es';

    if (!text) return jsonResponse({ error: 'No hay texto para leer.' }, 400);

    // Versión 3.4.0: la voz se fija en el servidor. Se ignoran voiceId, género
    // y cualquier preferencia antigua enviada por el navegador.
    const voiceId = ONCORESPONDE_VOICE_ID;
    const modelId = process.env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_multilingual_v2';
    const outputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT?.trim() || 'mp3_44100_128';

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(outputFormat)}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          language_code: language,
          voice_settings: {
            stability: 0.58,
            similarity_boost: 0.82,
            style: 0.12,
            use_speaker_boost: true,
            speed: 0.92,
          },
        }),
      },
    );

    if (!response.ok) {
      const details = await response.text();
      console.error('ElevenLabs TTS error:', response.status, details);
      return jsonResponse({
        error: 'No se ha podido generar la voz de OncoResponde con ElevenLabs.',
        code: 'ELEVENLABS_REQUEST_FAILED',
        providerStatus: response.status,
      }, 502);
    }

    const audio = await response.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'audio/mpeg',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Disposition': 'inline; filename="oncoresponde-elevenlabs.mp3"',
        'X-OncoResponde-Voice-Provider': 'ElevenLabs',
        'X-OncoResponde-Voice-Id': voiceId,
        'X-OncoResponde-Version': '3.4.0',
      },
    });
  } catch (error) {
    console.error('Voice function error:', error);
    return jsonResponse({ error: 'No se ha podido preparar el audio.' }, 500);
  }
};
