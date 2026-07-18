import { FormEvent, useMemo, useState } from 'react';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';
import { cancerLabels, getCancerProfileData } from '../utils/cancerProfileContext';
import { readMedications } from '../utils/medicationTracking';
import { readSymptomHistory, symptomMeta } from '../utils/symptomTracking';
import { readTreatmentEvents, treatmentEventMeta } from '../utils/treatmentTracking';
import {
  clearConsultationDraft,
  emptyConsultationDraft,
  readConsultationDraft,
  saveConsultationDraft,
  type ConsultationDraft,
  type ConsultationStatus,
} from '../utils/consultationTracking';

const statusOptions: Array<{ id: ConsultationStatus; label: string; icon: string }> = [
  { id: 'mucho-mejor', label: 'Mucho mejor', icon: '😊' },
  { id: 'mejor', label: 'Mejor', icon: '🙂' },
  { id: 'igual', label: 'Igual', icon: '😐' },
  { id: 'peor', label: 'Peor', icon: '🙁' },
  { id: 'mucho-peor', label: 'Mucho peor', icon: '😟' },
];

const statusLabels: Record<Exclude<ConsultationStatus, ''>, string> = {
  'mucho-mejor': 'Mucho mejor', mejor: 'Mejor', igual: 'Igual', peor: 'Peor', 'mucho-peor': 'Mucho peor',
};

function formatDate(value: string) {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(`${value}T12:00:00`));
}

export default function Consultation() {
  const [draft, setDraft] = useState<ConsultationDraft>(readConsultationDraft);
  const [saved, setSaved] = useState(Boolean(draft.updatedAt));

  const profile = useMemo(getCancerProfileData, []);
  const medications = useMemo(() => readMedications().filter((item) => item.active), []);
  const symptoms = useMemo(() => readSymptomHistory().slice(0, 7), []);
  const appointments = useMemo(() => {
    const today = new Date().toLocaleDateString('en-CA');
    return readTreatmentEvents().filter((item) => item.date >= today).slice(0, 5);
  }, []);

  const recentSymptoms = useMemo(() => {
    const totals = new Map<string, number>();
    symptoms.forEach((entry) => entry.symptoms.forEach((item) => totals.set(item.id, (totals.get(item.id) ?? 0) + 1)));
    return [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [symptoms]);

  const painValues = symptoms.map((entry) => entry.painScore).filter((value): value is number => typeof value === 'number');
  const averagePain = painValues.length ? (painValues.reduce((sum, value) => sum + value, 0) / painValues.length).toFixed(1) : '';
  const questions = draft.questions.map((item) => item.trim()).filter(Boolean);

  const update = <K extends keyof ConsultationDraft>(key: K, value: ConsultationDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    const result = saveConsultationDraft({
      status: draft.status,
      newSymptoms: draft.newSymptoms.trim(),
      fever: draft.fever,
      emergencyCare: draft.emergencyCare,
      medicationNeeds: draft.medicationNeeds.trim(),
      questions: draft.questions.map((item) => item.trim()).filter(Boolean).slice(0, 10).concat(draft.questions.every((item) => item.trim()) ? [] : ['']).slice(0, 10),
      notes: draft.notes.trim(),
    });
    setDraft(result);
    setSaved(true);
  };

  const changeQuestion = (index: number, value: string) => update('questions', draft.questions.map((item, itemIndex) => itemIndex === index ? value : item));
  const addQuestion = () => draft.questions.length < 10 && update('questions', [...draft.questions, '']);
  const removeQuestion = (index: number) => update('questions', draft.questions.length === 1 ? [''] : draft.questions.filter((_, itemIndex) => itemIndex !== index));

  const clear = () => {
    if (!window.confirm('¿Quieres borrar toda la preparación de esta consulta?')) return;
    clearConsultationDraft();
    setDraft(emptyConsultationDraft);
    setSaved(false);
  };

  return <>
    <main className="consultation-page">
      <NavHeader title="Prepara tu consulta" backTo="/" />

      <section className="consultation-hero">
        <span className="section-kicker">Antes de tu próxima visita</span>
        <h1>Prepara tu consulta</h1>
        <p>Reúne lo más importante que quieres explicar y preguntar. La aplicación completa el resumen con los datos que ya hayas guardado.</p>
      </section>

      <section className="consultation-alert" role="note">
        <strong>No esperes a la consulta si te encuentras mal</strong>
        <p>Ante dificultad respiratoria importante, dolor intenso, confusión, sangrado relevante, fiebre de 38 °C o superior durante algunos tratamientos, o cualquier empeoramiento preocupante, sigue las indicaciones de tu equipo y solicita atención médica.</p>
      </section>

      <form onSubmit={save}>
        <section className="card consultation-section">
          <div className="consultation-heading"><span>1</span><div><h2>¿Cómo te has encontrado?</h2><p>Piensa en el periodo desde tu última visita.</p></div></div>
          <div className="consultation-status-grid">
            {statusOptions.map((option) => <button type="button" key={option.id} className={draft.status === option.id ? 'is-selected' : ''} onClick={() => update('status', option.id)} aria-pressed={draft.status === option.id}><span>{option.icon}</span><strong>{option.label}</strong></button>)}
          </div>
        </section>

        <section className="card consultation-section">
          <div className="consultation-heading"><span>2</span><div><h2>Cambios importantes</h2><p>Anota solo aquello que conviene comentar.</p></div></div>
          <div className="consultation-form-grid">
            <label className="consultation-wide">Síntomas nuevos o que han empeorado<textarea value={draft.newSymptoms} onChange={(e) => update('newSymptoms', e.target.value)} placeholder="Ej.: más cansancio, dolor al tragar, hormigueo en manos…" maxLength={600} /></label>
            <fieldset><legend>¿Has tenido fiebre?</legend><div className="choice-row"><button type="button" className={draft.fever === 'si' ? 'is-selected' : ''} onClick={() => update('fever', 'si')}>Sí</button><button type="button" className={draft.fever === 'no' ? 'is-selected' : ''} onClick={() => update('fever', 'no')}>No</button></div></fieldset>
            <fieldset><legend>¿Has acudido a Urgencias o ingresado?</legend><div className="choice-row"><button type="button" className={draft.emergencyCare === 'si' ? 'is-selected' : ''} onClick={() => update('emergencyCare', 'si')}>Sí</button><button type="button" className={draft.emergencyCare === 'no' ? 'is-selected' : ''} onClick={() => update('emergencyCare', 'no')}>No</button></div></fieldset>
            <label className="consultation-wide">Medicación que necesitas revisar o renovar<textarea value={draft.medicationNeeds} onChange={(e) => update('medicationNeeds', e.target.value)} placeholder="Ej.: me queda poca medicación, no sé cuándo tomarla…" maxLength={500} /></label>
          </div>
        </section>

        <section className="card consultation-section">
          <div className="consultation-heading"><span>3</span><div><h2>Mis preguntas</h2><p>Escríbelas antes para no olvidarlas durante la visita.</p></div></div>
          <div className="consultation-questions">
            {draft.questions.map((question, index) => <div key={index}><span>{index + 1}</span><input value={question} onChange={(e) => changeQuestion(index, e.target.value)} placeholder="¿Qué quieres preguntar?" maxLength={220} /><button type="button" onClick={() => removeQuestion(index)} aria-label={`Eliminar pregunta ${index + 1}`}>×</button></div>)}
          </div>
          <button type="button" className="secondary consultation-add" onClick={addQuestion} disabled={draft.questions.length >= 10}>+ Añadir otra pregunta</button>
          <label className="consultation-notes">Otras notas<textarea value={draft.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Información adicional que quieras recordar…" maxLength={700} /></label>
        </section>

        <section className="card consultation-summary" id="consultation-summary">
          <div className="section-heading section-heading--compact"><div><span className="section-kicker">Resumen automático</span><h2>Para mostrar en la consulta</h2></div><p>{new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date())}</p></div>
          <div className="consultation-summary-grid">
            <article><h3>Situación oncológica</h3><p>{profile?.cancerType ? `Cáncer de ${cancerLabels[profile.cancerType] ?? profile.cancerType}` : 'No se ha registrado el tipo de cáncer.'}</p>{profile?.stage && <p>Estadio anotado: {profile.stage}</p>}{profile?.treatments?.length ? <p>Tratamientos: {profile.treatments.join(', ')}</p> : null}</article>
            <article><h3>Desde la última visita</h3><p>{draft.status ? statusLabels[draft.status] : 'Sin valoración registrada.'}</p>{draft.newSymptoms && <p>{draft.newSymptoms}</p>}<p>Fiebre: {draft.fever === 'si' ? 'Sí' : draft.fever === 'no' ? 'No' : 'No indicado'} · Urgencias/ingreso: {draft.emergencyCare === 'si' ? 'Sí' : draft.emergencyCare === 'no' ? 'No' : 'No indicado'}</p></article>
            <article><h3>Próximas citas</h3>{appointments.length ? <ul>{appointments.map((item) => <li key={item.id}>{formatDate(item.date)}{item.time ? ` · ${item.time}` : ''} — {item.title || treatmentEventMeta[item.type].label}</li>)}</ul> : <p>No hay próximas citas registradas.</p>}</article>
            <article><h3>Medicación activa</h3>{medications.length ? <ul>{medications.slice(0, 12).map((item) => <li key={item.id}>{item.name}{item.dose ? ` — ${item.dose}` : ''}</li>)}</ul> : <p>No hay medicación registrada.</p>}{draft.medicationNeeds && <p><strong>Revisar:</strong> {draft.medicationNeeds}</p>}</article>
            <article><h3>Seguimiento reciente</h3>{recentSymptoms.length ? <p>{recentSymptoms.map(([id, count]) => `${symptomMeta[id as keyof typeof symptomMeta]?.label ?? id} (${count})`).join(' · ')}</p> : <p>No hay síntomas recientes registrados.</p>}{averagePain && <p>Dolor medio anotado: {averagePain}/10</p>}</article>
            <article><h3>Preguntas pendientes</h3>{questions.length ? <ol>{questions.map((question, index) => <li key={`${question}-${index}`}>{question}</li>)}</ol> : <p>No hay preguntas anotadas.</p>}{draft.notes && <p><strong>Notas:</strong> {draft.notes}</p>}</article>
          </div>
        </section>

        <div className="consultation-actions">
          <button type="submit">Guardar preparación</button>
          <button type="button" className="secondary" onClick={() => window.print()}>Imprimir o guardar como PDF</button>
          <button type="button" className="consultation-clear" onClick={clear}>Borrar preparación</button>
        </div>
        {saved && <p className="consultation-saved" role="status">✓ Preparación guardada en este dispositivo.</p>}
      </form>
    </main>
    <BottomNav />
  </>;
}
