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
  intensityLabels,
  readSymptomHistory,
  saveSymptomsForToday,
  symptomMeta,
  type SymptomEntry,
  type SymptomId,
  type SymptomIntensity,
  type SymptomValue,
} from '../utils/symptomTracking';
import { useAppStore } from '../store/useAppStore';

const moodOrder: TrackedMood[] = ['bien', 'regular', 'preocupado', 'apoyo'];
const symptomOrder: SymptomId[] = [
  'dolor', 'cansancio', 'nauseas', 'vomitos', 'apetito', 'insomnio',
  'ansiedad', 'estrenimiento', 'diarrea', 'fiebre', 'otro',
];

function formatDay(date: string) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(
    new Date(`${date}T12:00:00`),
  );
}

export default function Tracking() {
  const { mood, setMood } = useAppStore();
  const [history, setHistory] = useState<MoodEntry[]>(() => readMoodHistory());
  const [symptomHistory, setSymptomHistory] = useState<SymptomEntry[]>(() => readSymptomHistory());
  const todaySymptoms = symptomHistory.find((entry) => entry.date === localDateKey());
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomValue[]>(todaySymptoms?.symptoms ?? []);
  const [temperature, setTemperature] = useState(todaySymptoms?.temperature?.toString() ?? '');
  const [note, setNote] = useState(todaySymptoms?.note ?? '');
  const [savedMessage, setSavedMessage] = useState('');
  const [symptomMessage, setSymptomMessage] = useState('');
  const todayEntry = history.find((entry) => entry.date === localDateKey());

  const summary = useMemo(() => {
    const recent = history.slice(0, 14);
    const counts = moodOrder.reduce<Record<TrackedMood, number>>(
      (acc, id) => ({ ...acc, [id]: recent.filter((entry) => entry.mood === id).length }),
      { bien: 0, regular: 0, preocupado: 0, apoyo: 0 },
    );
    return { recent, counts, streak: getCurrentStreak(history) };
  }, [history]);

  const symptomSummary = useMemo(() => {
    const recent7 = symptomHistory.slice(0, 7);
    const recent30 = symptomHistory.slice(0, 30);
    const totals = symptomOrder.map((id) => ({
      id,
      count: recent30.filter((entry) => entry.symptoms.some((symptom) => symptom.id === id)).length,
      intensity: recent30.reduce((sum, entry) => {
        const symptom = entry.symptoms.find((item) => item.id === id);
        return sum + (symptom?.intensity ?? 0);
      }, 0),
    })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count || b.intensity - a.intensity);

    const repeated = totals.filter((item) => item.count >= 3).slice(0, 3);
    const intense = recent7.flatMap((entry) => entry.symptoms).filter((symptom) => symptom.intensity === 3);
    return { totals, repeated, intense };
  }, [symptomHistory]);

  const alerts = useMemo(() => {
    const messages: string[] = [];
    const fever = selectedSymptoms.some((item) => item.id === 'fiebre');
    const temp = Number.parseFloat(temperature.replace(',', '.'));
    const intensePain = selectedSymptoms.some((item) => item.id === 'dolor' && item.intensity === 3);
    const intenseVomiting = selectedSymptoms.some((item) => item.id === 'vomitos' && item.intensity === 3);
    const intenseDiarrhea = selectedSymptoms.some((item) => item.id === 'diarrea' && item.intensity === 3);

    if (fever || (!Number.isNaN(temp) && temp >= 38)) {
      messages.push('Si tienes 38 °C o más, escalofríos o te encuentras mal durante un tratamiento oncológico, contacta de inmediato con el teléfono indicado por tu equipo sanitario.');
    }
    if (intensePain) messages.push('El dolor intenso, nuevo o que no mejora merece una valoración por tu equipo sanitario.');
    if (intenseVomiting || intenseDiarrhea) messages.push('Vómitos o diarrea intensos pueden favorecer la deshidratación. Contacta con tu equipo, especialmente si no puedes beber o empeoras.');
    return messages;
  }, [selectedSymptoms, temperature]);

  const recommendations = useMemo(() => {
    const ids = new Set(selectedSymptoms.map((item) => item.id));
    const items: Array<{ title: string; text: string; to: string }> = [];
    if (ids.has('cansancio')) items.push({ title: 'Dosificar la energía', text: 'Alterna actividad suave y descanso, sin exigirte mantener tu ritmo habitual.', to: '/cuidate/ejercicio' });
    if (ids.has('insomnio')) items.push({ title: 'Dormir mejor', text: 'Revisa una rutina sencilla para favorecer el descanso.', to: '/cuidate/dormir' });
    if (ids.has('ansiedad')) items.push({ title: 'Encontrar calma', text: 'Haz una pausa breve con respiración o mindfulness.', to: '/respiracion' });
    if (ids.has('apetito') || ids.has('nauseas') || ids.has('estrenimiento') || ids.has('diarrea')) items.push({ title: 'Alimentación', text: 'Consulta recomendaciones generales y adapta siempre lo que hagas a las indicaciones de tu equipo.', to: '/cuidate/alimentacion' });
    if ((todayEntry?.mood ?? mood) === 'apoyo') items.push({ title: 'Pedir apoyo', text: 'Hablar con alguien puede ser el primer paso.', to: '/hablame' });
    return items.slice(0, 3);
  }, [selectedSymptoms, todayEntry, mood]);

  function registerMood(nextMood: TrackedMood) {
    setMood(nextMood);
    setHistory(saveMoodForToday(nextMood));
    setSavedMessage('Tu estado de hoy se ha guardado únicamente en este dispositivo.');
  }

  function toggleSymptom(id: SymptomId) {
    setSelectedSymptoms((current) => {
      const exists = current.some((item) => item.id === id);
      return exists ? current.filter((item) => item.id !== id) : [...current, { id, intensity: 1 }];
    });
    setSymptomMessage('');
  }

  function setIntensity(id: SymptomId, intensity: SymptomIntensity) {
    setSelectedSymptoms((current) => current.map((item) => item.id === id ? { ...item, intensity } : item));
  }

  function saveSymptoms() {
    const parsedTemperature = temperature.trim() ? Number.parseFloat(temperature.replace(',', '.')) : undefined;
    const safeTemperature = parsedTemperature !== undefined && Number.isFinite(parsedTemperature) ? parsedTemperature : undefined;
    setSymptomHistory(saveSymptomsForToday(selectedSymptoms, safeTemperature, note));
    setSymptomMessage('Tu registro de síntomas se ha guardado únicamente en este dispositivo.');
  }

  function removeHistory() {
    const confirmed = window.confirm('¿Quieres borrar todo tu seguimiento guardado en este dispositivo?');
    if (!confirmed) return;
    clearMoodHistory();
    clearSymptomHistory();
    setHistory([]);
    setSymptomHistory([]);
    setSelectedSymptoms([]);
    setTemperature('');
    setNote('');
    setMood(null);
    setSavedMessage('Se ha borrado el seguimiento de este dispositivo.');
    setSymptomMessage('');
  }

  return (
    <>
      <main className="tracking-page">
        <header className="tracking-hero">
          <Link className="back-to-wellness" to="/">← Volver a Hoy</Link>
          <span className="section-kicker">Mi seguimiento</span>
          <h1>Tu diario de bienestar</h1>
          <p>Registra cómo te encuentras y los síntomas que quieras recordar. Es una ayuda para observar cambios y preparar conversaciones con tu equipo sanitario.</p>
        </header>

        <section className="symptom-entry-card card" aria-labelledby="symptom-entry-title">
          <div className="symptom-entry-card__icon" aria-hidden="true">✚</div>
          <div>
            <span className="section-kicker">Diario de síntomas</span>
            <h2 id="symptom-entry-title">Registra lo que has notado hoy</h2>
            <p>Dolor, cansancio, náuseas, fiebre, sueño, ansiedad y otros síntomas, con su intensidad.</p>
          </div>
          <Link className="primary-button" to="/seguimiento/sintomas">Abrir registro de síntomas</Link>
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

        <section className="tracking-shortcuts card">
          <div className="section-heading section-heading--compact"><div><span className="section-kicker">Síntomas</span><h2>Historial y tendencias</h2></div></div>
          <div className="tracking-shortcut-links">
            <Link to="/seguimiento/sintomas#historial-sintomas">Ver historial de síntomas</Link>
            <Link to="/seguimiento/sintomas#tendencias-sintomas">Ver tendencias</Link>
          </div>
        </section>

        {recommendations.length > 0 && <section className="tracking-recommendations card" aria-labelledby="recommendations-title"><div className="section-heading section-heading--compact"><div><span className="section-kicker">Según lo que has marcado</span><h2 id="recommendations-title">Recursos que pueden ayudarte</h2></div></div><div className="recommendation-grid">{recommendations.map((item) => <Link to={item.to} key={item.title}><strong>{item.title}</strong><span>{item.text}</span><small>Ver recurso →</small></Link>)}</div><p className="tracking-interpretation">Son orientaciones generales. Sigue siempre las indicaciones específicas de tu equipo sanitario.</p></section>}

        <section className="tracking-overview card" aria-labelledby="tracking-overview-title">
          <div className="section-heading section-heading--compact"><div><span className="section-kicker">Últimos 14 registros</span><h2 id="tracking-overview-title">Tu evolución reciente</h2></div><p>{summary.streak ? `${summary.streak} día${summary.streak === 1 ? '' : 's'} seguido${summary.streak === 1 ? '' : 's'}` : 'Empieza hoy'}</p></div>
          {summary.recent.length ? <><div className="tracking-timeline" aria-label="Historial reciente de estado de ánimo">{summary.recent.map((entry) => <div className="tracking-day" key={entry.date} title={`${formatDay(entry.date)}: ${moodMeta[entry.mood].label}`}><span className={`tracking-day__dot tracking-day__dot--${entry.mood}`} aria-label={moodMeta[entry.mood].label} role="img">{moodMeta[entry.mood].icon}</span><small>{formatDay(entry.date)}</small></div>)}</div><div className="tracking-counts">{moodOrder.map((id) => <div key={id}><span aria-hidden="true">{moodMeta[id].icon}</span><strong>{summary.counts[id]}</strong><small>{moodMeta[id].label}</small></div>)}</div><p className="tracking-interpretation">Este gráfico solo te ayuda a observar cambios. No interpreta tu salud ni genera diagnósticos.</p></> : <div className="empty-plan"><span aria-hidden="true">◷</span><p>Aún no hay registros. El primero aparecerá cuando marques cómo te encuentras hoy.</p></div>}
        </section>

        {symptomSummary.totals.length > 0 && <section className="symptom-trends card" aria-labelledby="symptom-trends-title"><div className="section-heading section-heading--compact"><div><span className="section-kicker">Últimos 30 registros</span><h2 id="symptom-trends-title">Síntomas registrados con más frecuencia</h2></div></div><div className="symptom-bars">{symptomSummary.totals.slice(0, 6).map((item) => <div key={item.id}><div><strong>{symptomMeta[item.id].label}</strong><span>{item.count} día{item.count === 1 ? '' : 's'}</span></div><progress max={Math.max(...symptomSummary.totals.map((entry) => entry.count), 1)} value={item.count}>{item.count}</progress></div>)}</div>{symptomSummary.repeated.length > 0 && <p className="pattern-note">Has registrado {symptomSummary.repeated.map((item) => symptomMeta[item.id].label.toLowerCase()).join(', ')} en varios días. Puede ser útil comentarlo con tu equipo sanitario.</p>}<p className="tracking-interpretation">La frecuencia no indica gravedad. Este resumen está pensado para ayudarte a recordar y comunicar mejor.</p></section>}

        <section className="tracking-privacy"><div><strong>Privacidad</strong><p>El seguimiento se guarda localmente en este navegador. No se envía a la IA ni a un servidor.</p></div>{(history.length > 0 || symptomHistory.length > 0) && <button type="button" onClick={removeHistory}>Borrar seguimiento</button>}</section>
      </main>
      <BottomNav />
    </>
  );
}
