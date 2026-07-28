const jsonResponse = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': status === 200 ? 'private, max-age=300' : 'no-store',
  },
});

const normalise = (value) => String(value ?? '').trim().toLowerCase();

const inferGender = (voice) => {
  const labels = voice?.labels ?? {};
  const value = normalise(labels.gender || voice?.gender);
  if (/female|femenina|woman|mujer/.test(value)) return 'female';
  if (/male|masculina|man|hombre/.test(value)) return 'male';
  return 'unknown';
};

const spanishSpainScore = (voice) => {
  const labels = voice?.labels ?? {};
  const haystack = [
    voice?.name,
    voice?.description,
    labels.language,
    labels.locale,
    labels.accent,
    ...(Array.isArray(voice?.verified_languages)
      ? voice.verified_languages.flatMap((item) => [item?.language, item?.locale, item?.accent])
      : []),
  ].map(normalise).join(' ');

  let score = 0;
  if (/es[-_ ]?es|spanish[^a-z]+spain|castilian|castellano|españa|spain/.test(haystack)) score += 100;
  if (/spanish|español|española/.test(haystack)) score += 30;
  if (/latin|mexic|argentin|colombi|chile|peru|venezu|caribbean|south american/.test(haystack)) score -= 120;
  if (voice?.category === 'professional') score += 10;
  if (voice?.is_bookmarked) score += 4;
  return score;
};

const getPreview = (voice) => {
  const verified = Array.isArray(voice?.verified_languages) ? voice.verified_languages : [];
  const preferred = verified.find((item) => /es[-_]?es/i.test(item?.locale || ''))
    || verified.find((item) => /spain|castilian|españa/i.test(`${item?.accent || ''} ${item?.locale || ''}`))
    || verified.find((item) => /^es$/i.test(item?.language || ''));
  return preferred?.preview_url || voice?.preview_url || null;
};

export default async (req) => {
  if (req.method !== 'GET') return jsonResponse({ error: 'Método no permitido' }, 405);

  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse({
      error: 'ELEVENLABS_API_KEY no está configurada en Netlify.',
      code: 'ELEVENLABS_NOT_CONFIGURED',
    }, 503);
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v2/voices?page_size=100&include_total_count=false', {
      headers: { 'xi-api-key': apiKey, Accept: 'application/json' },
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('ElevenLabs voices error:', response.status, details);
      return jsonResponse({
        error: response.status === 401 || response.status === 403
          ? 'La clave de ElevenLabs no tiene permiso para consultar las voces. Activa los permisos Voices: Read y Text to Speech.'
          : 'No se han podido consultar las voces de ElevenLabs.',
        code: response.status === 401 || response.status === 403 ? 'ELEVENLABS_PERMISSION_REQUIRED' : 'ELEVENLABS_VOICES_FAILED',
      }, response.status === 401 || response.status === 403 ? 403 : 502);
    }

    const payload = await response.json();
    const voices = (Array.isArray(payload?.voices) ? payload.voices : [])
      .map((voice) => ({
        id: voice.voice_id,
        name: voice.name || 'Voz sin nombre',
        gender: inferGender(voice),
        accent: voice?.labels?.accent || null,
        description: voice.description || voice?.labels?.description || null,
        previewUrl: getPreview(voice),
        score: spanishSpainScore(voice),
      }))
      .filter((voice) => voice.id && voice.score >= 30)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'es'));

    const female = voices.filter((voice) => voice.gender === 'female').slice(0, 6);
    const male = voices.filter((voice) => voice.gender === 'male').slice(0, 6);
    const unknown = voices.filter((voice) => voice.gender === 'unknown').slice(0, 6);

    return jsonResponse({ female, male, unknown });
  } catch (error) {
    console.error('Voice list function error:', error);
    return jsonResponse({ error: 'No se ha podido conectar con ElevenLabs.' }, 500);
  }
};
