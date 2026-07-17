import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';
import ContextChat from '../components/ContextChat';
import type { WellnessContextId } from '../context/wellnessPrompts';
import { wellnessTopics } from '../data/wellnessData';

const topicOrder = [
  'alimentacion',
  'ejercicio',
  'dormir',
  'mindfulness',
  'bienestar-emocional',
  'comunicacion',
] as const;

export default function WellnessTopic() {
  const { topicId = '' } = useParams();
  const topic = wellnessTopics[topicId];
  const [selectedQuestion, setSelectedQuestion] = useState('');

  useEffect(() => {
    setSelectedQuestion('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [topicId]);

  const adjacentTopics = useMemo(() => {
    const index = topicOrder.indexOf(topicId as (typeof topicOrder)[number]);
    if (index < 0) return { previous: undefined, next: undefined };
    return {
      previous: index > 0 ? wellnessTopics[topicOrder[index - 1]] : undefined,
      next: index < topicOrder.length - 1 ? wellnessTopics[topicOrder[index + 1]] : undefined,
    };
  }, [topicId]);

  if (!topic) return <Navigate to="/cuidate" replace />;

  const chooseQuestion = (question: string) => {
    setSelectedQuestion(question);
    window.setTimeout(() => {
      const target = document.getElementById('topic-oncobox');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target?.querySelector('textarea')?.focus({ preventScroll: true });
    }, 250);
  };

  return (
    <>
      <main className="topic-page" id="main-content">
        <NavHeader title={topic.title} backTo="/cuidate" backLabel="Cuídate" />

        <nav className="topic-breadcrumb" aria-label="Ruta de navegación">
          <Link to="/">Hoy</Link>
          <span aria-hidden="true">›</span>
          <Link to="/cuidate">Cuídate</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{topic.title}</span>
        </nav>

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

        <div id="topic-oncobox" className="topic-oncobox-anchor" tabIndex={-1}>
          <ContextChat
            contextId={topic.id as WellnessContextId}
            initialQuestion={selectedQuestion}
            title={topic.askLabel}
            buttonLabel="Preguntar a OncoResponde"
          />
        </div>

        <section className="topic-privacy" role="note">
          <strong>Información orientativa</strong>
          <p>OncoResponde puede cometer errores y no sustituye la valoración de tu equipo sanitario. Consulta con tus profesionales si los síntomas son intensos, nuevos o empeoran.</p>
        </section>

        <nav className="topic-pager" aria-label="Otros apartados de Cuídate">
          {adjacentTopics.previous ? (
            <Link to={`/cuidate/${adjacentTopics.previous.id}`} className="topic-pager__item topic-pager__item--previous">
              <small>Anterior</small>
              <strong>← {adjacentTopics.previous.title}</strong>
            </Link>
          ) : <span />}
          {adjacentTopics.next ? (
            <Link to={`/cuidate/${adjacentTopics.next.id}`} className="topic-pager__item topic-pager__item--next">
              <small>Siguiente</small>
              <strong>{adjacentTopics.next.title} →</strong>
            </Link>
          ) : <span />}
        </nav>

        <Link className="back-to-wellness" to="/cuidate">← Ver todas las áreas de Cuídate</Link>
      </main>
      <BottomNav />
    </>
  );
}
