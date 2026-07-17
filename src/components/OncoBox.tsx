import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type OncoBoxProps = {
  context?: string;
  initialQuestion?: string;
  title?: string;
  buttonLabel?: string;
};

export default function OncoBox({
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
        context,
      },
    });
  };

  return (
    <section className="oncobox wellness-oncobox" aria-labelledby="oncobox-title">
      <span className="section-kicker">Consulta personalizada</span>
      <h2 id="oncobox-title">💬 {title}</h2>
      <p className="muted">La pregunta se enviará con el contexto de esta sección. No incluyas datos que permitan identificarte.</p>
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Escribe aquí lo que te preocupa o necesitas saber…"
        aria-label="Pregunta para OncoResponde"
      />
      <div className="row">
        <button className="secondary" type="button" onClick={dictate}>🎤 Dictar</button>
        <button type="button" disabled={!question.trim()} onClick={submit}>{buttonLabel}</button>
      </div>
    </section>
  );
}
