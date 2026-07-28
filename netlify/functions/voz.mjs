const ONCORESPONDE_VOICE_ID = 'dNjJKg63Fr5AXwIdkATa';

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

    const modelId = process.env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_multilingual_v2';
    const outputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT?.trim() || 'mp3_44100_128';

    const requestBody = {
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.58,
        similarity_boost: 0.82,
        style: 0.12,
        use_speaker_boost: true,
        speed: 0.92,
      },
    };

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ONCORESPONDE_VOICE_ID}?output_format=${encodeURIComponent(outputFormat)}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify(requestBody),
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
        providerMessage = rawDetails.slice(0, 300);
      }

      console.error('ElevenLabs TTS error:', response.status, rawDetails);

      return jsonResponse({
        error: providerMessage
          ? `ElevenLabs no ha podido generar la voz: ${providerMessage}`
          : 'ElevenLabs no ha podido generar la voz seleccionada.',
        code: 'ELEVENLABS_REQUEST_FAILED',
        providerStatus: response.status,
      }, 502);
    }

    const audio = await response.arrayBuffer();
    if (!audio.byteLength) {
      return jsonResponse({
        error: 'ElevenLabs ha devuelto un audio vacío.',
        code: 'ELEVENLABS_EMPTY_AUDIO',
      }, 502);
    }

    return new Response(audio, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'audio/mpeg',
        'Content-Length': String(audio.byteLength),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Disposition': 'inline; filename="oncoresponde-elevenlabs.mp3"',
        'X-OncoResponde-Voice-Provider': 'ElevenLabs',
        'X-OncoResponde-Voice-Id': ONCORESPONDE_VOICE_ID,
        'X-OncoResponde-Version': '3.4.0',
      },
    });
  } catch (error) {
    console.error('Voice function error:', error);
    return jsonResponse({
      error: 'No se ha podido preparar el audio.',
      code: 'VOICE_FUNCTION_ERROR',
    }, 500);
  }
};
