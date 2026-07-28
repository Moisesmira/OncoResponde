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


type AnswerLocationState = {
  question?: string;
  contextId?: string;
  context?: string;
  profileContext?: string;
  cancerType?: string;
  attachment?: { name: string; mimeType: string; dataUrl: string; size: number } | null;
};


export default function Answer() {
  const { state } = useLocation();
  const request = (state ?? {}) as AnswerLocationState;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnswerData | null>(null);
  const [error, setError] = useState('');
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [audioNotice, setAudioNotice] = useState('');
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
    // Elimina preferencias heredadas de versiones con selector dinámico.
    localStorage.removeItem('oncoresponde:voice-id');
    localStorage.removeItem('oncoresponde:voice-gender');

    return () => {
      audioRef.current?.pause();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

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
    const preferredPattern = /mónica|monica|helena|marisol|carmen|conchita|lucía|lucia|paulina|female|mujer|premium|enhanced|natural/i;
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
      const response = await fetch('/.netlify/functions/voz?v=3.4.0-audio-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store',
        body: JSON.stringify({ text, language: 'es' }),
      });

      if (!response.ok) {
        let message = 'ElevenLabs no ha podido generar la voz seleccionada.';
        try {
          const payload = await response.json() as { error?: string; providerStatus?: number };
          if (payload.error) message = payload.error;
          if (payload.providerStatus) message += ` Código de ElevenLabs: ${payload.providerStatus}.`;
        } catch {
          // Se conserva el mensaje general cuando la respuesta no es JSON.
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      if (!blob.size || !blob.type.startsWith('audio/')) {
        throw new Error('El servidor no ha devuelto un archivo de audio válido.');
      }
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setAudioState('idle');
      audio.onerror = () => {
        fallbackToDeviceVoice(text);
      };

      try {
        await audio.play();
        setAudioNotice('Voz predeterminada de OncoResponde, generada con ElevenLabs.');
        setAudioState('playing');
      } catch {
        fallbackToDeviceVoice(text);
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'No se ha podido generar el audio.';
      setAudioNotice(`${message} Se utilizará temporalmente la voz española disponible en este dispositivo.`);
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
          <section className="card answer-voice-card" aria-label="Voz de OncoResponde">
            <strong>🔊 Voz de OncoResponde</strong>
            <p>La aplicación utiliza una única voz seleccionada para ofrecer una experiencia coherente y cercana.</p>
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
