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
import {
  clearSymptomHistory,
  readSymptomHistory,
  symptomMeta,
  type SymptomEntry,
  type SymptomId,
} from '../utils/symptomTracking';
import { useAppStore } from '../store/useAppStore';

const moodOrder: TrackedMood[] = ['bien', 'regular', 'preocupado', 'apoyo'];
const symptomOrder: SymptomId[] = [
  'dolor', 'cansancio', 'nauseas', 'vomitos', 'apetito', 'insomnio',
  'ansiedad', 'estrenimiento', 'diarrea', 'disnea', 'tos', 'hormigueos', 'fiebre', 'otro',
];

function formatDay(date: string) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
    .format(new Date(`${date}T12:00:00`));
}

export default function Tracking() {
  const { mood, setMood } = useAppStore();
  const [history, setHistory] = useState<MoodEntry[]>(() => readMoodHistory());
  const [symptomHistory, setSymptomHistory] = useState<SymptomEntry[]>(() => readSymptomHistory());
  const [savedMessage, setSavedMessage] = useState('');
  const todayEntry = history.find((entry) => entry.date === localDateKey());

  const moodSummary = useMemo(() => {
    const recent = history.slice(0, 14);
    const counts = moodOrder.reduce<Record<TrackedMood, number>>(
      (acc, id) => ({ ...acc, [id]: recent.filter((entry) => entry.mood === id).length }),
      { bien: 0, regular: 0, preocupado: 0, apoyo: 0 },
    );
    return { recent, counts, streak: getCurrentStreak(history) };
  }, [history]);

  const symptomSummary = useMemo(() => {
    const recent30 = symptomHistory.slice(0, 30);
    return symptomOrder.map((id) => ({
      id,
      count: recent30.filter((entry) => entry.symptoms.some((symptom) => symptom.id === id)).length,
      intensity: recent30.reduce((sum, entry) => sum + (entry.symptoms.find((item) => item.id === id)?.intensity ?? 0), 0),
    })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count || b.intensity - a.intensity);
  }, [symptomHistory]);

  const weekly = useMemo(() => {
    const last7Symptoms = symptomHistory.slice(0, 7);
    const last7Moods = history.slice(0, 7);
    const painValues = last7Symptoms.flatMap((entry) => typeof entry.painScore === 'number' ? [entry.painScore] : []);
    const fatigueDays = last7Symptoms.filter((entry) => entry.symptoms.some((symptom) => symptom.id === 'cansancio')).length;
    const sleepDays = last7Symptoms.filter((entry) => entry.symptoms.some((symptom) => symptom.id === 'insomnio')).length;
    const dominantMood = moodOrder
      .map((id) => ({ id, count: last7Moods.filter((entry) => entry.mood === id).length }))
      .sort((a, b) => b.count - a.count)[0];
    return {
      records: new Set([...last7Symptoms.map((entry) => entry.date), ...last7Moods.map((entry) => entry.date)]).size,
      avgPain: painValues.length ? painValues.reduce((a, b) => a + b, 0) / painValues.length : null,
      fatigueDays,
      sleepDays,
      dominantMood: dominantMood?.count ? dominantMood.id : null,
    };
  }, [history, symptomHistory]);

  function registerMood(nextMood: TrackedMood) {
    setMood(nextMood);
    setHistory(saveMoodForToday(nextMood));
    setSavedMessage('Tu estado de hoy se ha guardado únicamente en este dispositivo.');
  }

  function removeHistory() {
    if (!window.confirm('¿Quieres borrar todo tu seguimiento guardado en este dispositivo?')) return;
    clearMoodHistory();
    clearSymptomHistory();
    setHistory([]);
    setSymptomHistory([]);
    setMood(null);
    setSavedMessage('Se ha borrado el seguimiento de este dispositivo.');
  }

  return (
    <>
      <main className="tracking-page">
        <header className="tracking-hero">
          <Link className="back-to-wellness" to="/">← Volver a Hoy</Link>
          <span className="section-kicker">Mi seguimiento</span>
          <h1>Tu diario de bienestar</h1>
          <p>Registra cómo te encuentras, valora el dolor y anota otros síntomas. El resumen puede ayudarte a recordar cambios y preparar la consulta.</p>
        </header>

        <section className="tracking-dashboard" aria-label="Opciones de seguimiento">
          <article className="tracking-feature card tracking-feature--primary">
            <span aria-hidden="true">😊</span><div><small>Estado general</small><h2>¿Cómo te encuentras hoy?</h2><p>Registra tu estado emocional de forma rápida.</p></div>
          </article>
          <Link className="tracking-feature card" to="/seguimiento/sintomas">
            <span aria-hidden="true">🌡️</span><div><small>Registro clínico personal</small><h2>Mis síntomas</h2><p>Dolor de 0 a 10, fatiga, náuseas, sueño, fiebre y otros síntomas.</p><strong>Abrir registro →</strong></div>
          </Link>
          <Link className="tracking-feature card" to="/seguimiento/sintomas#tendencias-sintomas">
            <span aria-hidden="true">📈</span><div><small>Cambios con el tiempo</small><h2>Evolución</h2><p>Consulta frecuencia, intensidad y síntomas predominantes.</p><strong>Ver tendencias →</strong></div>
          </Link>
          <Link className="tracking-feature card" to="/seguimiento/sintomas#historial-sintomas">
            <span aria-hidden="true">📋</span><div><small>Registro cronológico</small><h2>Mi diario</h2><p>Revisa los últimos días y las notas que hayas guardado.</p><strong>Ver diario →</strong></div>
          </Link>
        </section>

        <section className="tracking-checkin card" aria-labelledby="tracking-question">
          <div className="section-heading"><div><span className="section-kicker">Hoy</span><h2 id="tracking-question">¿Cómo te encuentras?</h2></div>{todayEntry && <p>Ya lo has registrado. Puedes cambiarlo.</p>}</div>
          <div className="tracking-moods">
            {moodOrder.map((id) => {
              const meta = moodMeta[id];
              const selected = (todayEntry?.mood ?? mood) === id;
              return <button type="button" key={id} className={`tracking-mood${selected ? ' is-selected' : ''}${id === 'apoyo' ? ' tracking-mood--support' : ''}`} onClick={() => registerMood(id)} aria-pressed={selected}><span aria-hidden="true">{meta.icon}</span><strong>{meta.label}</strong></button>;
            })}
          </div>
          {savedMessage && <p className="tracking-saved" role="status">✓ {savedMessage}</p>}
          {(todayEntry?.mood ?? mood) === 'apoyo' && <div className="support-strip tracking-support"><strong>No tienes que afrontarlo solo</strong><Link to="/hablame">Hablar o escribir a OncoResponde</Link><a href="tel:900100036">AECC · 900 100 036</a><a href="tel:717003717">Teléfono de la Esperanza · 717 003 717</a><a href="tel:112">Emergencias · 112</a></div>}
        </section>

        <section className="weekly-summary card" aria-labelledby="weekly-title">
          <div className="section-heading"><div><span className="section-kicker">Últimos 7 registros</span><h2 id="weekly-title">Resumen semanal</h2></div><p>{weekly.records} día{weekly.records === 1 ? '' : 's'} registrado{weekly.records === 1 ? '' : 's'}</p></div>
          <div className="weekly-summary__grid">
            <div><span>😊</span><small>Estado predominante</small><strong>{weekly.dominantMood ? moodMeta[weekly.dominantMood].label : 'Sin datos'}</strong></div>
            <div><span>●</span><small>Dolor medio</small><strong>{weekly.avgPain === null ? 'Sin datos' : `${weekly.avgPain.toFixed(1)}/10`}</strong></div>
            <div><span>⚡</span><small>Fatiga registrada</small><strong>{weekly.fatigueDays} día{weekly.fatigueDays === 1 ? '' : 's'}</strong></div>
            <div><span>☾</span><small>Sueño alterado</small><strong>{weekly.sleepDays} día{weekly.sleepDays === 1 ? '' : 's'}</strong></div>
          </div>
          <p className="tracking-interpretation">Este resumen no interpreta tu estado de salud. Puedes utilizarlo como apoyo para explicar a tu equipo cómo te has encontrado.</p>
        </section>

        <section className="tracking-overview card" aria-labelledby="tracking-overview-title">
          <div className="section-heading section-heading--compact"><div><span className="section-kicker">Últimos 14 registros</span><h2 id="tracking-overview-title">Tu evolución emocional</h2></div><p>{moodSummary.streak ? `${moodSummary.streak} día${moodSummary.streak === 1 ? '' : 's'} seguido${moodSummary.streak === 1 ? '' : 's'}` : 'Empieza hoy'}</p></div>
          {moodSummary.recent.length ? <><div className="tracking-timeline">{moodSummary.recent.map((entry) => <div className="tracking-day" key={entry.date}><span className={`tracking-day__dot tracking-day__dot--${entry.mood}`} aria-label={moodMeta[entry.mood].label} role="img">{moodMeta[entry.mood].icon}</span><small>{formatDay(entry.date)}</small></div>)}</div><div className="tracking-counts">{moodOrder.map((id) => <div key={id}><span aria-hidden="true">{moodMeta[id].icon}</span><strong>{moodSummary.counts[id]}</strong><small>{moodMeta[id].label}</small></div>)}</div></> : <div className="empty-plan"><span aria-hidden="true">◷</span><p>Aún no hay registros emocionales.</p></div>}
        </section>

        {symptomSummary.length > 0 && <section className="symptom-trends card"><div className="section-heading section-heading--compact"><div><span className="section-kicker">Últimos 30 registros</span><h2>Síntomas registrados con más frecuencia</h2></div></div><div className="symptom-bars">{symptomSummary.slice(0, 6).map((item) => <div key={item.id}><div><strong>{symptomMeta[item.id].label}</strong><span>{item.count} día{item.count === 1 ? '' : 's'}</span></div><progress max={Math.max(...symptomSummary.map((entry) => entry.count), 1)} value={item.count}>{item.count}</progress></div>)}</div><p className="tracking-interpretation">La frecuencia no indica gravedad. Este resumen sirve para recordar y comunicar mejor.</p></section>}

        <section className="tracking-privacy"><div><strong>Privacidad</strong><p>El seguimiento se guarda localmente en este navegador. No se envía a la IA ni a un servidor.</p></div>{(history.length > 0 || symptomHistory.length > 0) && <button type="button" onClick={removeHistory}>Borrar seguimiento</button>}</section>
      </main>
      <BottomNav />
    </>
  );
}
