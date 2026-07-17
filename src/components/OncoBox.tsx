import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCancerProfileContext, getCancerTypeId } from '../utils/cancerProfileContext';

type OncoBoxProps = {
  contextId?: string;
  context?: string;
  initialQuestion?: string;
  title?: string;
  buttonLabel?: string;
};

export default function OncoBox({
  contextId = 'general',
  context = 'Consulta general de OncoResponde.',
  initialQuestion = '',
  title = 'Pregunta a OncoResponde',
  buttonLabel = 'Enviar pregunta',
}: OncoBoxProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const navigate = useNavigate();

  useEffect(() => {
    setQuestion(initialQuestion);
  }, [initialQuestion]);

  const dictate = () => {
    const SpeechRecognition = (window as typeof window & {
      SpeechRecognition?: new () => any;
      webkitSpeechRecognition?: new () => any;
    }).SpeechRecognition ?? (window as typeof window & {
      webkitSpeechRecognition?: new () => any;
    }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      window.alert('El dictado no está disponible en este navegador. Puedes escribir tu pregunta.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.onresult = (event: any) => setQuestion(event.results[0][0].transcript);
    recognition.start();
  };

  const submit = () => {
    if (!question.trim()) return;
    navigate('/respuesta', {
      state: {
        question: question.trim(),
        contextId,
        context,
        profileContext: getCancerProfileContext(),
        cancerType: getCancerTypeId(),
      },
    });
  };

  return (
    <section className="oncobox wellness-oncobox" aria-labelledby="oncobox-title">
      <span className="section-kicker">Consulta contextual</span>
      <h2 id="oncobox-title">💬 {title}</h2>
      <p className="muted">
        OncoResponde tendrá en cuenta esta sección y, si lo guardaste, tu perfil opcional. No incluyas datos que permitan identificarte.
      </p>
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Escribe aquí lo que te preocupa o necesitas saber…"
        aria-label="Pregunta para OncoResponde"
        maxLength={1200}
      />
      <div className="oncobox-meta" aria-live="polite">
        <span>{question.length}/1200 caracteres</span>
        {question.trim() && <button type="button" className="oncobox-clear" onClick={() => setQuestion('')}>Borrar texto</button>}
      </div>
      <div className="row">
        <button className="secondary" type="button" onClick={dictate}>🎤 Dictar</button>
        <button type="button" disabled={!question.trim()} onClick={submit}>{buttonLabel}</button>
      </div>
    </section>
  );
}
