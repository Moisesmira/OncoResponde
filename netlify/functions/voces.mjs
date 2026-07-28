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

const isSpanishSpain = (voice) => {
  const labels = voice?.labels ?? {};
  const verified = Array.isArray(voice?.verified_languages) ? voice.verified_languages : [];

  // ElevenLabs puede indicar que una voz es capaz de hablar es-ES aunque su acento
  // original sea estadounidense, británico, australiano o latinoamericano. Por eso
  // NO usamos verified_languages.locale como prueba del acento de la voz.
  const language = normalise(labels.language || voice?.language);
  const accent = normalise(labels.accent || voice?.accent);
  const searchable = normalise([
    voice?.name,
    voice?.description,
    labels.description,
    labels.locale,
    labels.region,
    labels.country,
    accent,
    language,
  ].filter(Boolean).join(' '));

  const explicitlySpanish = /(^|\b)(español|spanish|castellano|castilian)(\b|$)/.test(`${language} ${searchable}`);
  const explicitlySpain = /(^|\b)(spain|españa|es[-_]es|castilian|castellano|peninsular|madrid)(\b|$)/.test(searchable);
  const excludedAccent = /latin|latino|mexic|argentin|colombi|chil(e|ean)|peru|perú|venezu|caribbean|south american|american|australian|british|united states|u\.?s\.?|england|uk/.test(searchable);

  // Solo aceptamos voces cuya ficha describa explícitamente el acento como España
  // o castellano. La mera capacidad multilingüe es-ES no es suficiente.
  return explicitlySpanish && explicitlySpain && !excludedAccent;
};

const rankingScore = (voice) => {
  let score = 0;
  if (voice?.category === 'professional') score += 20;
  if (voice?.is_bookmarked) score += 8;
  if (Array.isArray(voice?.verified_languages) && voice.verified_languages.some((item) => /^es[-_]es$/i.test(item?.locale || ''))) score += 50;
  const accent = normalise(voice?.labels?.accent);
  if (/castilian|castellano|peninsular/.test(accent)) score += 20;
  if (/spain|españa|madrid/.test(accent)) score += 15;
  if (voice?.preview_url) score += 3;
  return score;
};

const getPreview = (voice) => {
  const verified = Array.isArray(voice?.verified_languages) ? voice.verified_languages : [];
  const preferred = verified.find((item) => /^es[-_]?es$/i.test(item?.locale || ''))
    || verified.find((item) => /spain|castilian|españa|castellano|peninsular/i.test(`${item?.accent || ''} ${item?.locale || ''}`));
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
      .filter(isSpanishSpain)
      .map((voice) => ({
        id: voice.voice_id,
        name: voice.name || 'Voz sin nombre',
        gender: inferGender(voice),
        accent: voice?.labels?.accent || voice?.accent || 'Español de España',
        description: voice.description || voice?.labels?.description || null,
        previewUrl: getPreview(voice),
        score: rankingScore(voice),
        recommended: false,
      }))
      .filter((voice) => voice.id)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'es'));

    // Preferimos una voz femenina como recomendación clínica; si no existe, la mejor disponible.
    const recommended = voices.find((voice) => voice.gender === 'female') || voices[0];
    if (recommended) recommended.recommended = true;

    const female = voices.filter((voice) => voice.gender === 'female').slice(0, 6);
    const male = voices.filter((voice) => voice.gender === 'male').slice(0, 6);
    const unknown = voices.filter((voice) => voice.gender === 'unknown').slice(0, 6);

    return jsonResponse({ female, male, unknown, locale: 'es-ES', recommendedVoiceId: recommended?.id || null });
  } catch (error) {
    console.error('Voice list function error:', error);
    return jsonResponse({ error: 'No se ha podido conectar con ElevenLabs.' }, 500);
  }
};
