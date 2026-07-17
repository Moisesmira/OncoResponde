import { useEffect, useState } from 'react';
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
};

export default function Answer() {
  const { state } = useLocation();
  const request = (state ?? {}) as AnswerLocationState;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnswerData | null>(null);
  const [error, setError] = useState('');

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
      }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'No se pudo completar la consulta');
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
  }, [request.question, request.contextId, request.context, request.profileContext, request.cancerType]);

  const listen = () => {
    if (!data) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${data.summary}. ${data.answer}`);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main>
      <NavHeader title="Respuesta" />
      {loading && (
        <section className="card">
          <h2>Consultando OncoResponde…</h2>
          <p>Adaptando la respuesta al tema de la consulta y revisando criterios de seguridad.</p>
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
          <div className="row">
            <button type="button" onClick={listen}>🔊 Escuchar</button>
            <button type="button" className="secondary" onClick={() => navigate(-1)}>Cerrar y no guardar</button>
          </div>
        </section>
      )}
    </main>
  );
}
