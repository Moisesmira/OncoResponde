import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import NavHeader from '../components/NavHeader';
import {
  intensityLabels,
  readSymptomHistory,
  saveSymptomsForToday,
  symptomMeta,
  type SymptomEntry,
  type SymptomId,
  type SymptomIntensity,
  type SymptomValue,
} from '../utils/symptomTracking';
import { localDateKey } from '../utils/moodTracking';
import { getCancerProfileContext, getCancerTypeId } from '../utils/cancerProfileContext';

const symptomOrder: SymptomId[] = [
  'dolor', 'cansancio', 'nauseas', 'vomitos', 'apetito', 'insomnio',
  'ansiedad', 'estrenimiento', 'diarrea', 'fiebre', 'otro',
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
    .format(new Date(`${date}T12:00:00`));
}

export default function SymptomDiary() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<SymptomEntry[]>(() => readSymptomHistory());
  const today = history.find((entry) => entry.date === localDateKey());
  const [selected, setSelected] = useState<SymptomValue[]>(today?.symptoms ?? []);
  const [temperature, setTemperature] = useState(today?.temperature?.toString() ?? '');
  const [note, setNote] = useState(today?.note ?? '');
  const [message, setMessage] = useState('');

  const alerts = useMemo(() => {
    const result: string[] = [];
    const temp = Number.parseFloat(temperature.replace(',', '.'));
    const hasFever = selected.some((item) => item.id === 'fiebre');
    if (hasFever || (!Number.isNaN(temp) && temp >= 38)) {
      result.push('Si tienes 38 °C o más, escalofríos o mal estado general durante un tratamiento oncológico, contacta de inmediato con el teléfono indicado por tu equipo sanitario.');
    }
    if (selected.some((item) => item.id === 'dolor' && item.intensity === 3)) {
      result.push('El dolor intenso, nuevo o que no mejora debe ser valorado por tu equipo sanitario.');
    }
    if (selected.some((item) => ['vomitos', 'diarrea'].includes(item.id) && item.intensity === 3)) {
      result.push('Los vómitos o la diarrea intensos pueden provocar deshidratación. Contacta con tu equipo, especialmente si no puedes beber.');
    }
    return result;
  }, [selected, temperature]);

  const trends = useMemo(() => {
    const recent = history.slice(0, 30);
    return symptomOrder
      .map((id) => {
        const entries = recent.filter((entry) => entry.symptoms.some((symptom) => symptom.id === id));
        const totalIntensity = entries.reduce((sum, entry) => sum + (entry.symptoms.find((symptom) => symptom.id === id)?.intensity ?? 0), 0);
        return { id, count: entries.length, totalIntensity };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count || b.totalIntensity - a.totalIntensity);
  }, [history]);

  const recommendations = useMemo(() => {
    const ids = new Set(selected.map((item) => item.id));
    const result: Array<{ title: string; text: string; to: string }> = [];
    if (ids.has('cansancio')) result.push({ title: 'Dosificar la energía', text: 'Alterna actividad suave y descansos breves.', to: '/cuidate/ejercicio' });
    if (ids.has('insomnio')) result.push({ title: 'Dormir mejor', text: 'Revisa una rutina sencilla para favorecer el descanso.', to: '/cuidate/dormir' });
    if (ids.has('ansiedad')) result.push({ title: 'Escucha y relájate', text: 'Prueba una guía breve o un sonido suave para bajar el ritmo.', to: '/relajate' });
    if (['apetito', 'nauseas', 'estrenimiento', 'diarrea'].some((id) => ids.has(id as SymptomId))) {
      result.push({ title: 'Alimentación', text: 'Consulta recomendaciones generales y sigue las indicaciones de tu equipo.', to: '/cuidate/alimentacion' });
    }
    return result.slice(0, 3);
  }, [selected]);

  function toggle(id: SymptomId) {
    setSelected((current) => current.some((item) => item.id === id)
      ? current.filter((item) => item.id !== id)
      : [...current, { id, intensity: 1 }]);
    setMessage('');
  }

  function setIntensity(id: SymptomId, intensity: SymptomIntensity) {
    setSelected((current) => current.map((item) => item.id === id ? { ...item, intensity } : item));
  }

  function save() {
    const parsed = temperature.trim() ? Number.parseFloat(temperature.replace(',', '.')) : undefined;
    const safeTemperature = parsed !== undefined && Number.isFinite(parsed) ? parsed : undefined;
    const next = saveSymptomsForToday(selected, safeTemperature, note);
    setHistory(next);
    setMessage('Registro guardado en este dispositivo.');
  }

  function askAI() {
    if (!selected.length) return;
    const symptomText = selected
      .map((item) => `${symptomMeta[item.id].label}: ${intensityLabels[item.intensity].toLowerCase()}`)
      .join(', ');
    const tempText = temperature.trim() ? ` Temperatura registrada: ${temperature.trim()} °C.` : '';
    const noteText = note.trim() ? ` Nota de la persona: ${note.trim().slice(0, 280)}.` : '';
    navigate('/respuesta', {
      state: {
        question: `He registrado hoy estos síntomas: ${symptomText}.${tempText}${noteText} ¿Qué medidas generales de autocuidado pueden ayudarme y qué señales deberían hacerme contactar con mi equipo sanitario?`,
        contextId: 'sintomas',
        context: 'Consulta generada desde el diario de síntomas. Los datos son declarados por la persona, no están verificados y no deben interpretarse como diagnóstico.',
        profileContext: getCancerProfileContext(),
        cancerType: getCancerTypeId(),
      },
    });
  }

  return (
    <>
      <main className="symptom-diary-page">
        <NavHeader title="Diario de síntomas" backTo="/seguimiento" backLabel="Seguimiento" />

        <section className="symptom-intro card">
          <span className="section-kicker">Registro de hoy</span>
          <h1>¿Qué has notado hoy?</h1>
          <p>Selecciona únicamente lo que quieras recordar. Puedes indicar la intensidad, guardar el registro y consultar después su evolución.</p>
          <p className="privacy-inline">🔒 Se guarda solo en este dispositivo. La IA únicamente recibe estos datos cuando pulsas “Orientación con IA”.</p>
        </section>

        <section className="tracking-symptoms card" aria-labelledby="symptom-register-title">
          <div className="section-heading">
            <div><span className="section-kicker">Síntomas</span><h2 id="symptom-register-title">Selecciona uno o varios</h2></div>
            <p>{selected.length ? `${selected.length} seleccionado${selected.length === 1 ? '' : 's'}` : 'Opcional'}</p>
          </div>
          <div className="symptom-grid symptom-grid--prominent">
            {symptomOrder.map((id) => {
              const current = selected.find((item) => item.id === id);
              return (
                <div className={`symptom-item${current ? ' is-selected' : ''}`} key={id}>
                  <button type="button" className="symptom-toggle" onClick={() => toggle(id)} aria-pressed={Boolean(current)}>
                    <span aria-hidden="true">{symptomMeta[id].icon}</span><strong>{symptomMeta[id].label}</strong>
                  </button>
                  {current && (
                    <div className="intensity-control" aria-label={`Intensidad de ${symptomMeta[id].label}`}>
                      {([1, 2, 3] as SymptomIntensity[]).map((level) => (
                        <button type="button" key={level} className={current.intensity === level ? 'is-active' : ''} onClick={() => setIntensity(id, level)} aria-pressed={current.intensity === level}>
                          {intensityLabels[level]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selected.some((item) => item.id === 'fiebre') && (
            <label className="temperature-field"><span>Temperatura medida (°C), si la conoces</span><input inputMode="decimal" value={temperature} onChange={(event) => setTemperature(event.target.value)} placeholder="Ej. 38,0" /></label>
          )}
          {selected.some((item) => item.id === 'otro') && (
            <label className="symptom-note"><span>¿Qué te gustaría recordar?</span><textarea maxLength={280} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Escribe una nota breve, sin datos identificativos." /></label>
          )}

          {alerts.length > 0 && <div className="clinical-alert" role="alert"><strong>Atención</strong>{alerts.map((alert) => <p key={alert}>{alert}</p>)}<small>Ante dificultad respiratoria intensa, desmayo, dolor torácico u otra emergencia, llama al 112.</small></div>}

          <div className="symptom-actions">
            <button className="primary-button" type="button" onClick={save}>Guardar registro</button>
            <button className="secondary-button" type="button" onClick={askAI} disabled={!selected.length}>Orientación con IA</button>
          </div>
          {message && <p className="tracking-saved" role="status">✓ {message}</p>}
        </section>

        {recommendations.length > 0 && (
          <section className="tracking-recommendations card">
            <span className="section-kicker">Recomendaciones automáticas</span>
            <h2>Recursos relacionados</h2>
            <div className="recommendation-grid">{recommendations.map((item) => <Link to={item.to} key={item.title}><strong>{item.title}</strong><span>{item.text}</span><small>Ver recurso →</small></Link>)}</div>
            <p className="tracking-interpretation">Son orientaciones generales y no sustituyen las indicaciones de tu equipo sanitario.</p>
          </section>
        )}

        <section className="card" id="historial-sintomas">
          <div className="section-heading"><div><span className="section-kicker">Historial</span><h2>Últimos registros</h2></div><p>{history.length} día{history.length === 1 ? '' : 's'}</p></div>
          {history.length ? (
            <div className="symptom-history-list">
              {history.slice(0, 14).map((entry) => (
                <article key={entry.date}>
                  <div><strong>{formatDate(entry.date)}</strong>{entry.temperature !== undefined && <span>{entry.temperature} °C</span>}</div>
                  <p>{entry.symptoms.length ? entry.symptoms.map((symptom) => `${symptomMeta[symptom.id].label} (${intensityLabels[symptom.intensity].toLowerCase()})`).join(' · ') : 'Sin síntomas seleccionados'}</p>
                  {entry.note && <small>{entry.note}</small>}
                </article>
              ))}
            </div>
          ) : <div className="empty-plan"><span aria-hidden="true">◷</span><p>Aún no hay registros de síntomas.</p></div>}
        </section>

        <section className="card" id="tendencias-sintomas">
          <div className="section-heading"><div><span className="section-kicker">Tendencias</span><h2>Últimos 30 registros</h2></div></div>
          {trends.length ? (
            <div className="symptom-bars">{trends.slice(0, 8).map((item) => <div key={item.id}><div><strong>{symptomMeta[item.id].label}</strong><span>{item.count} día{item.count === 1 ? '' : 's'}</span></div><progress max={Math.max(...trends.map((trend) => trend.count), 1)} value={item.count}>{item.count}</progress></div>)}</div>
          ) : <p className="tracking-interpretation">Las tendencias aparecerán cuando hayas guardado varios registros.</p>}
          <p className="tracking-interpretation">La frecuencia no indica gravedad. Este resumen sirve para recordar y comunicar mejor.</p>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
