const ONCORESPONDE_VOICE_ID = 'dNjJKg63Fr5AXwIdkATa';
const ONCORESPONDE_VOICE_NAME = 'Cristina - Spanish Peninsular';

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
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, 405);
  }

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

    if (!text) {
      return jsonResponse({ error: 'No hay texto para leer.' }, 400);
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ONCORESPONDE_VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.58,
            similarity_boost: 0.82,
            style: 0.12,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const rawDetails = await response.text();
      let providerMessage = '';
      try {
        const parsed = JSON.parse(rawDetails);
        providerMessage =
          parsed?.detail?.message ||
          parsed?.detail?.status ||
          parsed?.message ||
          '';
      } catch {
        providerMessage = rawDetails.slice(0, 500);
      }

      console.error('ElevenLabs TTS error:', response.status, rawDetails);

      return jsonResponse({
        error: providerMessage
          ? `ElevenLabs ha rechazado la voz Cristina: ${providerMessage}`
          : 'ElevenLabs ha rechazado la generación con la voz Cristina.',
        code: 'ELEVENLABS_REQUEST_FAILED',
        providerStatus: response.status,
        requestedVoiceId: ONCORESPONDE_VOICE_ID,
      }, 502);
    }

    const audio = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || '';

    if (!audio.byteLength || !contentType.toLowerCase().includes('audio')) {
      return jsonResponse({
        error: 'ElevenLabs no ha devuelto un audio válido para la voz Cristina.',
        code: 'ELEVENLABS_INVALID_AUDIO',
        requestedVoiceId: ONCORESPONDE_VOICE_ID,
      }, 502);
    }

    return new Response(audio, {
      status: 200,
      headers: {
        'Content-Type': contentType || 'audio/mpeg',
        'Content-Length': String(audio.byteLength),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Disposition': 'inline; filename="oncoresponde-cristina.mp3"',
        'X-OncoResponde-Voice-Provider': 'ElevenLabs',
        'X-OncoResponde-Voice-Id': ONCORESPONDE_VOICE_ID,
        'X-OncoResponde-Voice-Name': ONCORESPONDE_VOICE_NAME,
        'X-OncoResponde-Version': '3.4.1',
      },
    });
  } catch (error) {
    console.error('Voice function error:', error);
    return jsonResponse({
      error: 'No se ha podido conectar con ElevenLabs.',
      code: 'VOICE_FUNCTION_ERROR',
      requestedVoiceId: ONCORESPONDE_VOICE_ID,
    }, 500);
  }
};
