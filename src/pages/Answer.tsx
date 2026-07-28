import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavHeader from '../components/NavHeader';

type AnswerData = {
  summary: string;
  answer: string;
  actions?: string[];
  whenToConsult: string;
  followUp?: string;
  sources?: Array<{ name: string; url: string }>;
  personalizationNote?: string;
};

type VoiceOption = {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'unknown';
  accent?: string | null;
  description?: string | null;
  previewUrl?: string | null;
  recommended?: boolean;
};

type AnswerLocationState = {
  question?: string;
  contextId?: string;
  context?: string;
  profileContext?: string;
  cancerType?: string;
  attachment?: { name: string; mimeType: string; dataUrl: string; size: number } | null;
};


function VoiceGroup({ title, voices, selectedVoiceId, previewingId, onSelect, onPreview }: {
  title: string;
  voices: VoiceOption[];
  selectedVoiceId: string;
  previewingId: string;
  onSelect: (voice: VoiceOption) => void;
  onPreview: (voice: VoiceOption) => void;
}) {
  return (
    <fieldset className="voice-group">
      <legend>{title}</legend>
      {voices.length === 0 ? (
        <p className="voice-group__empty">No hay voces disponibles en este grupo.</p>
      ) : voices.map((voice) => (
        <div className={`voice-option ${selectedVoiceId === voice.id ? 'selected' : ''}`} key={voice.id}>
          <label>
            <input
              type="radio"
              name="oncoresponde-voice"
              checked={selectedVoiceId === voice.id}
              onChange={() => onSelect(voice)}
            />
            <span>
              <strong>{voice.name}{voice.recommended && <span className="voice-recommended">Recomendada para OncoResponde</span>}</strong>
              <small>{voice.accent || 'Español de España'}{voice.description ? ` · ${voice.description}` : ''}</small>
            </span>
          </label>
          <button type="button" className="voice-preview" onClick={() => onPreview(voice)}>
            {previewingId === voice.id ? '⏹ Detener muestra' : '▶ Escuchar muestra'}
          </button>
        </div>
      ))}
    </fieldset>
  );
}

export default function Answer() {
  const { state } = useLocation();
  const request = (state ?? {}) as AnswerLocationState;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnswerData | null>(null);
  const [error, setError] = useState('');
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [audioNotice, setAudioNotice] = useState('');
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>(() =>
    localStorage.getItem('oncoresponde:voice-gender') === 'male' ? 'male' : 'female'
  );
  const [voices, setVoices] = useState<{ female: VoiceOption[]; male: VoiceOption[]; unknown: VoiceOption[] }>({ female: [], male: [], unknown: [] });
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [voicesError, setVoicesError] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState(() => localStorage.getItem('oncoresponde:voice-id') || '');
  const [previewingId, setPreviewingId] = useState('');
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!request.question?.trim()) {
      setError('No se ha recibido ninguna pregunta.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);

    fetch('/.netlify/functions/consulta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: request.question,
        contextId: request.contextId,
        context: request.context,
        profileContext: request.profileContext,
        cancerType: request.cancerType,
        attachment: request.attachment,
      }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const responseText = await response.text();
        let payload: (AnswerData & { error?: string }) | null = null;

        if (responseText.trim()) {
          try {
            payload = JSON.parse(responseText) as AnswerData & { error?: string };
          } catch {
            throw new Error('El servidor devolvió una respuesta no válida. Vuelve a desplegar la aplicación en Netlify e inténtalo de nuevo.');
          }
        }

        if (!payload) {
          throw new Error('El servidor no devolvió respuesta. Comprueba el despliegue de la función en Netlify.');
        }

        if (!response.ok) {
          throw new Error(payload.error || `No se pudo completar la consulta (error ${response.status}).`);
        }

        setData(payload as AnswerData);
      })
      .catch((caught: Error) => {
        setError(caught.name === 'AbortError' ? 'La consulta ha tardado demasiado. Inténtalo de nuevo.' : caught.message);
      })
      .finally(() => {
        window.clearTimeout(timeout);
        setLoading(false);
      });

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [request.question, request.contextId, request.context, request.profileContext, request.cancerType, request.attachment]);


  useEffect(() => {
    const controller = new AbortController();
    setVoicesLoading(true);
    fetch('/.netlify/functions/voces', { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || 'No se han podido cargar las voces.');
        const nextVoices = {
          female: Array.isArray(payload.female) ? payload.female : [],
          male: Array.isArray(payload.male) ? payload.male : [],
          unknown: Array.isArray(payload.unknown) ? payload.unknown : [],
        };
        setVoices(nextVoices);
        setVoicesError('');
        const all = [...nextVoices.female, ...nextVoices.male, ...nextVoices.unknown];
        const stored = localStorage.getItem('oncoresponde:voice-id');
        const storedVoice = all.find((voice) => voice.id === stored);
        const recommendedVoice = all.find((voice) => voice.recommended);
        const preferred = storedVoice
          || recommendedVoice
          || (voiceGender === 'male' ? nextVoices.male[0] : nextVoices.female[0])
          || nextVoices.female[0]
          || nextVoices.male[0]
          || nextVoices.unknown[0];
        if (preferred) {
          setSelectedVoiceId(preferred.id);
          localStorage.setItem('oncoresponde:voice-id', preferred.id);
          if (preferred.gender !== 'unknown') {
            setVoiceGender(preferred.gender);
            localStorage.setItem('oncoresponde:voice-gender', preferred.gender);
          }
        }
      })
      .catch((caught: Error) => {
        if (caught.name !== 'AbortError') setVoicesError(caught.message);
      })
      .finally(() => setVoicesLoading(false));
    return () => controller.abort();
  }, []);
  useEffect(() => () => {
    previewAudioRef.current?.pause();
    audioRef.current?.pause();
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    window.speechSynthesis?.cancel();
  }, []);

  const selectVoice = (voice: VoiceOption) => {
    stopListening();
    previewAudioRef.current?.pause();
    setPreviewingId('');
    setSelectedVoiceId(voice.id);
    localStorage.setItem('oncoresponde:voice-id', voice.id);
    if (voice.gender !== 'unknown') {
      setVoiceGender(voice.gender);
      localStorage.setItem('oncoresponde:voice-gender', voice.gender);
    }
  };

  const previewVoice = async (voice: VoiceOption) => {
    previewAudioRef.current?.pause();
    if (previewingId === voice.id) {
      setPreviewingId('');
      return;
    }
    setPreviewingId(voice.id);
    try {
      if (voice.previewUrl) {
        const audio = new Audio(voice.previewUrl);
        previewAudioRef.current = audio;
        audio.onended = () => setPreviewingId('');
        audio.onerror = () => setPreviewingId('');
        await audio.play();
        return;
      }
      const response = await fetch('/.netlify/functions/voz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Hola. Soy la voz de OncoResponde. Estoy aquí para acompañarte y ayudarte a comprender la información con calma.',
          language: 'es',
          voiceGender: voice.gender === 'male' ? 'male' : 'female',
          voiceId: voice.id,
        }),
      });
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      previewAudioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); setPreviewingId(''); };
      audio.onerror = () => { URL.revokeObjectURL(url); setPreviewingId(''); };
      await audio.play();
    } catch {
      setPreviewingId('');
      setAudioNotice('No se ha podido reproducir la muestra de esta voz. Comprueba los permisos de Text to Speech en ElevenLabs.');
    }
  };

  const fallbackToDeviceVoice = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setAudioNotice('Este dispositivo no permite reproducir la respuesta en voz alta.');
      setAudioState('idle');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.88;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const spanishSpain = voices.filter((voice) => /^es-ES$/i.test(voice.lang));
    const femalePattern = /mónica|monica|helena|marisol|carmen|conchita|lucía|lucia|paulina|female|mujer|premium|enhanced|natural/i;
    const malePattern = /jorge|enrique|pablo|diego|male|hombre|premium|enhanced|natural/i;
    const preferredPattern = voiceGender === 'male' ? malePattern : femalePattern;
    const preferred = spanishSpain.find((voice) => preferredPattern.test(voice.name))
      || spanishSpain.find((voice) => voice.localService)
      || spanishSpain[0];
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setAudioState('idle');
    utterance.onerror = () => setAudioState('idle');
    setAudioNotice(preferred ? 'Se está usando temporalmente una voz de español de España disponible en tu dispositivo.' : 'No se ha encontrado una voz de español de España en este dispositivo.');
    setAudioState('playing');
    window.speechSynthesis.speak(utterance);
  };

  const listen = async () => {
    if (!data) return;

    if (audioState === 'playing') {
      audioRef.current?.pause();
      setAudioState('paused');
      return;
    }

    if (audioState === 'paused' && audioRef.current) {
      await audioRef.current.play();
      setAudioState('playing');
      return;
    }

    const text = `${data.summary}. ${data.answer}`;
    setAudioState('loading');
    setAudioNotice('Preparando una voz castellana de España con ElevenLabs…');

    try {
      if (!selectedVoiceId) throw new Error('No voice selected');
      const response = await fetch('/.netlify/functions/voz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: 'es', voiceGender, voiceId: selectedVoiceId }),
      });
      if (!response.ok) throw new Error('TTS unavailable');

      const blob = await response.blob();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setAudioState('idle');
      audio.onerror = () => {
        setAudioState('idle');
        fallbackToDeviceVoice(text);
      };
      await audio.play();
      setAudioNotice(`Voz ${voiceGender === 'male' ? 'masculina' : 'femenina'} de castellano de España, generada con ElevenLabs.`);
      setAudioState('playing');
    } catch {
      fallbackToDeviceVoice(text);
    }
  };

  const stopListening = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    window.speechSynthesis?.cancel();
    setAudioState('idle');
    setAudioNotice('');
  };

  return (
    <main>
      <NavHeader title="Respuesta" />
      {loading && (
        <section className="card">
          <h2>Consultando OncoResponde…</h2>
          <p>{request.attachment ? 'Leyendo el documento y preparando una explicación clara. Puede tardar unos segundos.' : 'Adaptando la respuesta al tema de la consulta y revisando criterios de seguridad.'}</p>
        </section>
      )}
      {error && (
        <section className="card error">
          <h2>No se ha completado la consulta</h2>
          <p>{error}</p>
          <button type="button" onClick={() => navigate(-1)}>Volver</button>
        </section>
      )}
      {data && (
        <section className="answer">
          {data.personalizationNote && <p className="answer-personalization">{data.personalizationNote}</p>}
          <h2>Lo más importante</h2>
          <p>{data.summary}</p>
          <h2>Respuesta</h2>
          <p>{data.answer}</p>
          {!!data.actions?.length && (
            <>
              <h2>Qué puedes hacer</h2>
              <ul>{data.actions.map((action) => <li key={action}>{action}</li>)}</ul>
            </>
          )}
          <h2>Cuándo consultar</h2>
          <p>{data.whenToConsult}</p>
          {data.followUp && (
            <div className="card">
              <strong>Para orientarte mejor</strong>
              <p>{data.followUp}</p>
            </div>
          )}
          {!!data.sources?.length && (
            <>
              <h2>Fuentes de referencia</h2>
              <ul>
                {data.sources.map((source) => (
                  <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a></li>
                ))}
              </ul>
            </>
          )}
          <section className="voice-selector" aria-labelledby="voice-selector-title">
            <div className="voice-selector__header">
              <div>
                <h2 id="voice-selector-title">Elige la voz de OncoResponde</h2>
                <p>Solo se muestran voces verificadas como español de España (es-ES).</p>
              </div>
              {voicesLoading && <span className="voice-selector__status">Cargando voces…</span>}
            </div>

            {voicesError && (
              <div className="voice-selector__error" role="alert">
                <strong>No se han podido cargar las voces.</strong>
                <span>{voicesError}</span>
                <small>En ElevenLabs, edita la API Key y activa los permisos <b>Voices: Read</b> y <b>Text to Speech</b>. Después vuelve a desplegar Netlify.</small>
              </div>
            )}

            {!voicesLoading && !voicesError && (
              <div className="voice-selector__groups">
                <VoiceGroup title="👩 Femenina" voices={voices.female} selectedVoiceId={selectedVoiceId} previewingId={previewingId} onSelect={selectVoice} onPreview={previewVoice} />
                <VoiceGroup title="👨 Masculina" voices={voices.male} selectedVoiceId={selectedVoiceId} previewingId={previewingId} onSelect={selectVoice} onPreview={previewVoice} />
                {voices.unknown.length > 0 && (
                  <VoiceGroup title="Otras voces españolas" voices={voices.unknown} selectedVoiceId={selectedVoiceId} previewingId={previewingId} onSelect={selectVoice} onPreview={previewVoice} />
                )}
                {voices.female.length === 0 && voices.male.length === 0 && voices.unknown.length === 0 && (
                  <p className="voice-selector__empty">No hay voces es-ES disponibles en tu cuenta. Añade una voz de español de España (Castilian Spanish) desde la Voice Library de ElevenLabs y vuelve a cargar la aplicación.</p>
                )}
              </div>
            )}
          </section>
          <div className="row">
            <button type="button" onClick={listen} disabled={audioState === 'loading'}>
              {audioState === 'loading' ? '⏳ Preparando voz…' : audioState === 'playing' ? '⏸ Pausar' : audioState === 'paused' ? '▶️ Continuar' : '🔊 Escuchar'}
            </button>
            {audioState !== 'idle' && (
              <button type="button" className="secondary" onClick={stopListening}>⏹ Detener</button>
            )}
            <button type="button" className="secondary" onClick={() => navigate(-1)}>Cerrar y no guardar</button>
          </div>
          {audioNotice && <p className="answer-voice-note" role="status">{audioNotice}</p>}
        </section>
      )}
    </main>
  );
}
