import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';
import OncoBox from '../components/OncoBox';
import { getCancerProfileData } from '../utils/cancerProfileContext';
import { prepareItems } from './Prepare';
import { deleteTreatmentEvent, readTreatmentEvents, saveTreatmentEvent, treatmentEventMeta, type TreatmentEventType } from '../utils/treatmentTracking';

const types = Object.keys(treatmentEventMeta) as TreatmentEventType[];
const todayKey = () => new Date().toLocaleDateString('en-CA');
const formatDate = (date: string) => new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`));

const advice: Partial<Record<TreatmentEventType, string[]>> = {
  radioterapia: ['Lleva ropa cómoda y sigue las indicaciones sobre la piel del área tratada.', 'Comenta cualquier síntoma nuevo con el equipo de radioterapia.'],
  quimioterapia: ['Lleva tu medicación habitual y una lista de dudas.', 'Pregunta a tu equipo qué signos requieren contacto urgente.'],
  inmunoterapia: ['No normalices síntomas nuevos sin comentarlos.', 'Lleva anotados cambios de piel, respiración, intestino o energía.'],
  analitica: ['Comprueba si necesitas ayuno.', 'No suspendas medicación salvo indicación expresa.'],
  tac: ['Revisa si la prueba requiere ayuno o contraste.', 'Informa de alergias al contraste o enfermedad renal.'],
  pet: ['Sigue exactamente las instrucciones de ayuno y ejercicio.', 'Si tienes diabetes, confirma la pauta específica.'],
  resonancia: ['Comunica cualquier implante o dispositivo metálico.', 'Pregunta por opciones si tienes claustrofobia.'],
  consulta: ['Anota tus tres preguntas más importantes.', 'Lleva la lista de medicación y síntomas recientes.'],
  cirugia: ['Sigue las instrucciones preoperatorias de tu hospital.', 'Confirma ayuno, medicación y hora de llegada.'],
};

export default function Treatment() {
  const [events, setEvents] = useState(readTreatmentEvents);
  const [type, setType] = useState<TreatmentEventType>('consulta');
  const [date, setDate] = useState(todayKey());
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const profile = getCancerProfileData();
  const today = todayKey();
  const upcoming = useMemo(() => events.filter((event) => event.date >= today).slice(0, 12), [events, today]);
  const next = upcoming[0];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!date) return;
    setEvents(saveTreatmentEvent({ type, date, time: time || undefined, title: title.trim() || undefined, note: note.trim() || undefined }));
    setTitle(''); setNote(''); setTime('');
  };

  const context = useMemo(() => {
    const list = upcoming.slice(0, 5).map((event) => `${treatmentEventMeta[event.type].label} el ${event.date}${event.time ? ` a las ${event.time}` : ''}`).join('; ');
    return `Módulo Mi tratamiento. Próximos eventos registrados localmente: ${list || 'ninguno'}. Ofrece orientación práctica, no modifica citas ni sustituye las instrucciones del hospital.`;
  }, [upcoming]);

  return <>
    <main className="treatment-page">
      <NavHeader title="Mi tratamiento" backTo="/" />

      <section className="treatment-hero">
        <span className="section-kicker">Organiza tu camino</span>
        <h1>Mi tratamiento</h1>
        <p>Guarda de forma opcional tus próximas citas y consulta recomendaciones sencillas. La información permanece en este dispositivo.</p>
      </section>

      {profile?.treatments?.length ? <section className="card treatment-active">
        <span className="section-kicker">Tratamientos indicados en tu perfil</span>
        <div className="treatment-chips">{profile.treatments.map((item) => <span key={item}>{item}</span>)}</div>
      </section> : <Link className="treatment-profile-link" to="/perfil">Añade tus tratamientos al perfil opcional <b>→</b></Link>}

      {next && <section className="card treatment-next">
        <div className="treatment-next__icon" aria-hidden="true">{treatmentEventMeta[next.type].icon}</div>
        <div>
          <span className="section-kicker">Tu próxima cita</span>
          <h2>{next.title || treatmentEventMeta[next.type].label}</h2>
          <p>{formatDate(next.date)}{next.time ? ` · ${next.time}` : ''}</p>
        </div>
        {treatmentEventMeta[next.type].prepareId && <Link to={`/preparate?guia=${treatmentEventMeta[next.type].prepareId}`}>Cómo prepararme</Link>}
      </section>}

      <section className="card treatment-form-card">
        <h2>Añadir una cita o sesión</h2>
        <form className="treatment-form" onSubmit={submit}>
          <label>Tipo<select value={type} onChange={(e) => setType(e.target.value as TreatmentEventType)}>{types.map((id) => <option key={id} value={id}>{treatmentEventMeta[id].label}</option>)}</select></label>
          <label>Fecha<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
          <label>Hora opcional<input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
          <label>Título opcional<input value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} placeholder="Ej.: Sesión 4 de radioterapia" /></label>
          <label className="treatment-form__wide">Nota opcional<textarea value={note} maxLength={240} onChange={(e) => setNote(e.target.value)} placeholder="Indicaciones prácticas, lugar o dudas…" /></label>
          <button type="submit">Guardar en este dispositivo</button>
        </form>
      </section>

      <section className="card treatment-list-card">
        <div className="section-heading section-heading--compact"><div><span className="section-kicker">Agenda personal</span><h2>Próximas citas</h2></div><p>{upcoming.length} registradas</p></div>
        {upcoming.length ? <div className="treatment-list">{upcoming.map((event) => {
          const meta = treatmentEventMeta[event.type];
          return <article className="treatment-event" key={event.id}>
            <span className="treatment-event__icon" aria-hidden="true">{meta.icon}</span>
            <div><strong>{event.title || meta.label}</strong><p>{formatDate(event.date)}{event.time ? ` · ${event.time}` : ''}</p>{event.note && <small>{event.note}</small>}</div>
            <button type="button" className="treatment-delete" onClick={() => setEvents(deleteTreatmentEvent(event.id))} aria-label={`Eliminar ${event.title || meta.label}`}>Eliminar</button>
          </article>;
        })}</div> : <div className="empty-plan"><span aria-hidden="true">▣</span><p>Aún no has registrado próximas citas.</p></div>}
      </section>

      {next && advice[next.type]?.length && <section className="card treatment-advice"><span className="section-kicker">Para tu próxima cita</span><h2>Recomendaciones prácticas</h2><ul>{advice[next.type]?.map((item) => <li key={item}>{item}</li>)}</ul><p>Las instrucciones concretas de tu centro sanitario tienen prioridad.</p></section>}

      <section className="card treatment-prepare" aria-labelledby="treatment-prepare-title">
        <div className="section-heading section-heading--compact">
          <div>
            <span className="section-kicker">Guías vinculadas a tu agenda</span>
            <h2 id="treatment-prepare-title">Prepárate para una prueba o tratamiento</h2>
          </div>
          <p>Consulta la guía cuando la necesites.</p>
        </div>
        <div className="treatment-guide-grid">
          {prepareItems.map((item) => (
            <Link className="treatment-guide-card" to={`/preparate?guia=${item.id}`} key={item.id}>
              <span aria-hidden="true">{item.icon}</span>
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
        <p className="treatment-guide-note">Prepárate ya no es un apartado independiente: forma parte de Mi tratamiento y se abre directamente desde tu próxima cita o desde estas guías.</p>
      </section>

      <OncoBox contextId="tratamiento-agenda" context={context} title="Pregunta sobre tu próxima cita" initialQuestion={next ? `¿Cómo puedo prepararme para mi próxima ${treatmentEventMeta[next.type].label.toLowerCase()}?` : ''} />

      <p className="treatment-privacy">🔒 Tus citas se guardan localmente. Solo se incluyen en una consulta a la IA cuando pulsas “Enviar pregunta”.</p>
    </main>
    <BottomNav />
  </>;
}
