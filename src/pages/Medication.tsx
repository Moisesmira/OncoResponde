import { FormEvent, useMemo, useState } from 'react';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';
import OncoBox from '../components/OncoBox';
import {
  deleteMedication,
  medicationFrequencyLabels,
  medicationsForToday,
  readMedications,
  saveMedication,
  toggleMedication,
  weekdayLabels,
  type MedicationFrequency,
} from '../utils/medicationTracking';

const todayKey = () => new Date().toLocaleDateString('en-CA');

const commonSupport = [
  { name: 'Antieméticos', text: 'Se utilizan para prevenir o aliviar náuseas y vómitos. Sigue exactamente la pauta indicada.' },
  { name: 'Corticoides', text: 'Pueden formar parte de la medicación de apoyo. No los suspendas ni cambies sin consultarlo.' },
  { name: 'Analgésicos', text: 'Ayudan a controlar el dolor. Registra si el alivio es insuficiente o aparecen efectos no esperados.' },
  { name: 'Laxantes', text: 'Pueden indicarse para prevenir o tratar el estreñimiento. Ajusta su uso solo según la pauta recibida.' },
];

export default function Medication() {
  const [medications, setMedications] = useState(readMedications);
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState<MedicationFrequency>('diaria');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [startDate, setStartDate] = useState(todayKey());
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const today = useMemo(() => medicationsForToday(medications), [medications]);
  const active = useMemo(() => medications.filter((item) => item.active), [medications]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !startDate) return;
    setMedications(saveMedication({
      name: name.trim(), purpose: purpose.trim() || undefined, dose: dose.trim() || undefined,
      frequency, times: frequency === 'cuando-necesario' ? [] : times.filter(Boolean),
      weekdays: frequency === 'dias-concretos' ? weekdays : undefined,
      startDate, endDate: endDate || undefined, notes: notes.trim() || undefined,
    }));
    setName(''); setPurpose(''); setDose(''); setNotes('');
  };

  const context = useMemo(() => {
    const list = active.slice(0, 12).map((item) => `${item.name}${item.dose ? `, ${item.dose}` : ''}${item.purpose ? `, para ${item.purpose}` : ''}`).join('; ');
    return `Módulo Mi medicación. Medicación introducida por la persona usuaria: ${list || 'ninguna'}. Explica de forma general y segura. No indiques cambios, suspensiones, duplicaciones ni ajustes de dosis. Ante olvidos, interacciones, reacciones o dudas sobre la pauta, remite al equipo sanitario o farmacéutico.`;
  }, [active]);

  const addTime = () => setTimes((current) => current.length < 6 ? [...current, '12:00'] : current);
  const updateTime = (index: number, value: string) => setTimes((current) => current.map((item, i) => i === index ? value : item));
  const removeTime = (index: number) => setTimes((current) => current.filter((_, i) => i !== index));
  const toggleWeekday = (day: number) => setWeekdays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);

  return <>
    <main className="medication-page">
      <NavHeader title="Mi medicación" backTo="/" />

      <section className="medication-hero">
        <span className="section-kicker">Tu lista personal</span>
        <h1>Mi medicación</h1>
        <p>Guarda de forma opcional los medicamentos que te han indicado y consulta tu pauta anotada. Esta lista no sustituye la receta, el plan de medicación ni las instrucciones de tu equipo.</p>
      </section>

      <section className="medication-safety" role="note">
        <strong>Importante</strong>
        <p>No cambies, suspendas ni dupliques una dosis desde esta aplicación. Ante una dosis olvidada, una posible interacción o una reacción, consulta a tu equipo sanitario o farmacéutico.</p>
      </section>

      <section className="card medication-today">
        <div className="section-heading section-heading--compact"><div><span className="section-kicker">Hoy</span><h2>Medicación anotada para hoy</h2></div><p>{today.length} medicamento{today.length === 1 ? '' : 's'}</p></div>
        {today.length ? <div className="medication-today-list">{today.map((item) => <article key={item.id}>
          <span aria-hidden="true">💊</span><div><strong>{item.name}</strong><p>{item.dose || 'Dosis no anotada'}{item.times.length ? ` · ${item.times.join(' · ')}` : ''}</p>{item.purpose && <small>{item.purpose}</small>}</div>
        </article>)}</div> : <div className="empty-plan"><span aria-hidden="true">✓</span><p>No hay medicación programada para hoy en tu lista.</p></div>}
      </section>

      <section className="card medication-form-card">
        <h2>Añadir un medicamento</h2>
        <form className="medication-form" onSubmit={submit}>
          <label>Nombre del medicamento<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tal como aparece en tu pauta" required maxLength={100} /></label>
          <label>Dosis o presentación<input value={dose} onChange={(e) => setDose(e.target.value)} placeholder="Ej.: 1 comprimido, 4 mg" maxLength={80} /></label>
          <label className="medication-form__wide">¿Para qué te lo han indicado? <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Ej.: náuseas, dolor, estreñimiento…" maxLength={120} /></label>
          <label>Frecuencia<select value={frequency} onChange={(e) => setFrequency(e.target.value as MedicationFrequency)}>{Object.entries(medicationFrequencyLabels).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
          <label>Fecha de inicio<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></label>
          <label>Fecha de fin opcional<input type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>

          {frequency !== 'cuando-necesario' && <fieldset className="medication-times medication-form__wide"><legend>Horario anotado</legend>{times.map((time, index) => <div key={`${index}-${time}`}><input type="time" value={time} onChange={(e) => updateTime(index, e.target.value)} /><button type="button" className="secondary" onClick={() => removeTime(index)} disabled={times.length === 1}>Quitar</button></div>)}<button type="button" className="secondary" onClick={addTime}>+ Añadir otra hora</button></fieldset>}

          {frequency === 'dias-concretos' && <fieldset className="medication-weekdays medication-form__wide"><legend>Días de la semana</legend><div>{weekdayLabels.map((label, day) => <button type="button" key={label} onClick={() => toggleWeekday(day)} className={weekdays.includes(day) ? 'is-selected' : ''} aria-pressed={weekdays.includes(day)}>{label}</button>)}</div></fieldset>}

          <label className="medication-form__wide">Observaciones opcionales<textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Indicaciones que te haya dado tu equipo…" maxLength={300} /></label>
          <button type="submit" className="medication-form__wide">Guardar en este dispositivo</button>
        </form>
      </section>

      <section className="card medication-list-card">
        <div className="section-heading section-heading--compact"><div><span className="section-kicker">Lista personal</span><h2>Mis medicamentos</h2></div><p>{active.length} activos</p></div>
        {medications.length ? <div className="medication-list">{medications.map((item) => <article className={!item.active ? 'is-inactive' : ''} key={item.id}>
          <span className="medication-list__icon" aria-hidden="true">💊</span>
          <div><strong>{item.name}</strong><p>{item.dose || 'Dosis no anotada'} · {medicationFrequencyLabels[item.frequency]}</p>{item.times.length > 0 && <small>Horario: {item.times.join(' · ')}</small>}{item.notes && <small>{item.notes}</small>}</div>
          <div className="medication-list__actions"><button type="button" className="secondary" onClick={() => setMedications(toggleMedication(item.id))}>{item.active ? 'Marcar finalizado' : 'Reactivar'}</button><button type="button" className="medication-delete" onClick={() => setMedications(deleteMedication(item.id))}>Eliminar</button></div>
        </article>)}</div> : <div className="empty-plan"><span aria-hidden="true">💊</span><p>Aún no has añadido medicamentos.</p></div>}
      </section>

      <section className="card medication-info">
        <div className="section-heading section-heading--compact"><div><span className="section-kicker">Información general</span><h2>Medicación de apoyo frecuente</h2></div><p>Consulta siempre tu pauta</p></div>
        <div className="medication-info-grid">{commonSupport.map((item) => <article key={item.name}><strong>{item.name}</strong><p>{item.text}</p></article>)}</div>
      </section>

      <OncoBox contextId="medicacion" context={context} title="Pregunta sobre tu medicación" initialQuestion="¿Para qué sirve uno de los medicamentos de mi lista y qué debo vigilar?" />
      <p className="medication-privacy">🔒 La lista se guarda localmente. Solo se incluye en una consulta a la IA cuando pulsas “Enviar pregunta”.</p>
    </main>
    <BottomNav />
  </>;
}
