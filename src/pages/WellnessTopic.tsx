import { Link, Navigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';
import OncoBox from '../components/OncoBox';
import { wellnessTopics } from '../data/wellnessData';

export default function WellnessTopic() {
  const { topicId = '' } = useParams();
  const topic = wellnessTopics[topicId];
  const [selectedQuestion, setSelectedQuestion] = useState('');

  if (!topic) return <Navigate to="/cuidate" replace />;

  const chooseQuestion = (question: string) => {
    setSelectedQuestion(question);
    window.setTimeout(() => {
      document.getElementById('topic-oncobox')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <>
      <main className="topic-page">
        <NavHeader title={topic.title} />

        <section className="topic-hero">
          <span className="topic-hero__icon" aria-hidden="true">{topic.icon}</span>
          <span className="section-kicker">Cuídate</span>
          <h1>{topic.title}</h1>
          <p className="topic-hero__message">{topic.message}</p>
        </section>

        <section className="topic-section">
          <h2>Lo esencial</h2>
          <p>{topic.explanation}</p>
          <ul className="topic-tips">
            {topic.tips.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
        </section>

        <section className="topic-section topic-questions">
          <span className="section-kicker">Preguntas rápidas</span>
          <h2>¿Qué necesitas hoy?</h2>
          <p>Elige una opción. La pregunta aparecerá preparada para que puedas completarla antes de enviarla.</p>
          <div className="quick-question-list">
            {topic.questions.map((question) => (
              <button
                type="button"
                key={question}
                onClick={() => chooseQuestion(question)}
                className={selectedQuestion === question ? 'is-selected' : ''}
                aria-pressed={selectedQuestion === question}
              >
                <span>{question}</span>
                <b aria-hidden="true">→</b>
              </button>
            ))}
          </div>
        </section>

        <div id="topic-oncobox" className="topic-oncobox-anchor">
          <OncoBox
            context={topic.context}
            initialQuestion={selectedQuestion}
            title={topic.askLabel}
            buttonLabel="Preguntar a OncoResponde"
          />
        </div>

        <section className="topic-privacy" role="note">
          <strong>Información orientativa</strong>
          <p>OncoResponde puede cometer errores y no sustituye la valoración de tu equipo sanitario. Consulta con tus profesionales si los síntomas son intensos, nuevos o empeoran.</p>
        </section>

        <Link className="back-to-wellness" to="/cuidate">← Volver a Cuídate</Link>
      </main>
      <BottomNav />
    </>
  );
}
