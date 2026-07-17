import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import {
  clearMoodHistory,
  getCurrentStreak,
  localDateKey,
  moodMeta,
  readMoodHistory,
  saveMoodForToday,
  type MoodEntry,
  type TrackedMood,
} from '../utils/moodTracking';
import { useAppStore } from '../store/useAppStore';

const moodOrder: TrackedMood[] = ['bien', 'regular', 'preocupado', 'apoyo'];

function formatDay(date: string) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(
    new Date(`${date}T12:00:00`),
  );
}

export default function Tracking() {
  const { mood, setMood } = useAppStore();
  const [history, setHistory] = useState<MoodEntry[]>(() => readMoodHistory());
  const [savedMessage, setSavedMessage] = useState('');
  const todayEntry = history.find((entry) => entry.date === localDateKey());

  const summary = useMemo(() => {
    const recent = history.slice(0, 14);
    const counts = moodOrder.reduce<Record<TrackedMood, number>>(
      (acc, id) => ({ ...acc, [id]: recent.filter((entry) => entry.mood === id).length }),
      { bien: 0, regular: 0, preocupado: 0, apoyo: 0 },
    );
    return { recent, counts, streak: getCurrentStreak(history) };
  }, [history]);

  function registerMood(nextMood: TrackedMood) {
    setMood(nextMood);
    setHistory(saveMoodForToday(nextMood));
    setSavedMessage('Tu estado de hoy se ha guardado únicamente en este dispositivo.');
  }

  function removeHistory() {
    const confirmed = window.confirm('¿Quieres borrar todo tu seguimiento guardado en este dispositivo?');
    if (!confirmed) return;
    clearMoodHistory();
    setHistory([]);
    setMood(null);
    setSavedMessage('Se ha borrado el seguimiento de este dispositivo.');
  }

  return (
    <>
      <main className="tracking-page">
        <header className="tracking-hero">
          <Link className="back-to-wellness" to="/">← Volver a Hoy</Link>
          <span className="section-kicker">Mi seguimiento</span>
          <h1>Un registro de 20 segundos</h1>
          <p>Marca cómo te encuentras una vez al día. No es una prueba médica ni sustituye la valoración de tu equipo sanitario.</p>
        </header>

        <section className="tracking-checkin card" aria-labelledby="tracking-question">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Hoy</span>
              <h2 id="tracking-question">¿Cómo te encuentras?</h2>
            </div>
            {todayEntry && <p>Ya lo has registrado. Puedes cambiarlo.</p>}
          </div>

          <div className="tracking-moods">
            {moodOrder.map((id) => {
              const meta = moodMeta[id];
              const selected = (todayEntry?.mood ?? mood) === id;
              return (
                <button
                  type="button"
                  key={id}
                  className={`tracking-mood${selected ? ' is-selected' : ''}${id === 'apoyo' ? ' tracking-mood--support' : ''}`}
                  onClick={() => registerMood(id)}
                  aria-pressed={selected}
                >
                  <span aria-hidden="true">{meta.icon}</span>
                  <strong>{meta.label}</strong>
                </button>
              );
            })}
          </div>

          {savedMessage && <p className="tracking-saved" role="status">✓ {savedMessage}</p>}

          {(todayEntry?.mood ?? mood) === 'apoyo' && (
            <div className="support-strip tracking-support">
              <strong>No tienes que afrontarlo solo</strong>
              <Link to="/hablame">Hablar o escribir a OncoResponde</Link>
              <a href="tel:900100036">AECC · 900 100 036</a>
              <a href="tel:717003717">Teléfono de la Esperanza · 717 003 717</a>
              <a href="tel:112">Emergencias · 112</a>
            </div>
          )}
        </section>

        <section className="tracking-overview card" aria-labelledby="tracking-overview-title">
          <div className="section-heading section-heading--compact">
            <div>
              <span className="section-kicker">Últimos 14 registros</span>
              <h2 id="tracking-overview-title">Tu evolución reciente</h2>
            </div>
            <p>{summary.streak ? `${summary.streak} día${summary.streak === 1 ? '' : 's'} seguido${summary.streak === 1 ? '' : 's'}` : 'Empieza hoy'}</p>
          </div>

          {summary.recent.length ? (
            <>
              <div className="tracking-timeline" aria-label="Historial reciente de estado de ánimo">
                {summary.recent.map((entry) => (
                  <div className="tracking-day" key={entry.date} title={`${formatDay(entry.date)}: ${moodMeta[entry.mood].label}`}>
                    <span className={`tracking-day__dot tracking-day__dot--${entry.mood}`} aria-hidden="true">
                      {moodMeta[entry.mood].icon}
                    </span>
                    <small>{formatDay(entry.date)}</small>
                  </div>
                ))}
              </div>

              <div className="tracking-counts">
                {moodOrder.map((id) => (
                  <div key={id}>
                    <span aria-hidden="true">{moodMeta[id].icon}</span>
                    <strong>{summary.counts[id]}</strong>
                    <small>{moodMeta[id].label}</small>
                  </div>
                ))}
              </div>

              <p className="tracking-interpretation">
                Este gráfico solo te ayuda a observar cambios. No interpreta tu salud ni genera diagnósticos.
              </p>
            </>
          ) : (
            <div className="empty-plan">
              <span aria-hidden="true">◷</span>
              <p>Aún no hay registros. El primero aparecerá cuando marques cómo te encuentras hoy.</p>
            </div>
          )}
        </section>

        <section className="tracking-privacy">
          <div>
            <strong>Privacidad</strong>
            <p>El seguimiento se guarda localmente en este navegador. No se envía a la IA ni a un servidor.</p>
          </div>
          {history.length > 0 && <button type="button" onClick={removeHistory}>Borrar seguimiento</button>}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
