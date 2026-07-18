import { getCancerProfileContext, getCancerTypeId } from './cancerProfileContext';
import { medicationsForToday, readMedications } from './medicationTracking';
import { readMoodHistory, moodMeta, localDateKey } from './moodTracking';
import { readSymptomHistory, symptomMeta } from './symptomTracking';
import { readTreatmentEvents, treatmentEventMeta } from './treatmentTracking';

export type HomeInsight = {
  id: string;
  icon: string;
  title: string;
  detail: string;
  to: string;
  priority: number;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`));
}

export function getHomeInsights(now = new Date()): HomeInsight[] {
  const today = localDateKey(now);
  const events = readTreatmentEvents();
  const todayEvents = events.filter((event) => event.date === today);
  const futureEvents = events.filter((event) => event.date >= today);
  const nextEvent = futureEvents[0];
  const medications = medicationsForToday(readMedications());
  const symptoms = readSymptomHistory();
  const mood = readMoodHistory().find((entry) => entry.date === today);
  const consultation = events.find((event) => event.date >= today && event.type === 'consulta');
  const insights: HomeInsight[] = [];

  if (todayEvents.length) {
    const first = todayEvents[0];
    insights.push({
      id: 'today-event',
      icon: treatmentEventMeta[first.type].icon,
      title: todayEvents.length === 1 ? treatmentEventMeta[first.type].label : `${todayEvents.length} citas hoy`,
      detail: first.time ? `Hoy a las ${first.time}` : 'Programado para hoy',
      to: '/tratamiento',
      priority: 100,
    });
  } else if (nextEvent) {
    insights.push({
      id: 'next-event',
      icon: treatmentEventMeta[nextEvent.type].icon,
      title: `Próximo: ${treatmentEventMeta[nextEvent.type].label}`,
      detail: `${formatDate(nextEvent.date)}${nextEvent.time ? ` · ${nextEvent.time}` : ''}`,
      to: '/tratamiento',
      priority: 90,
    });
  }

  if (medications.length) {
    const timed = medications.filter((item) => item.times.length).slice(0, 2);
    insights.push({
      id: 'medication',
      icon: '💊',
      title: `${medications.length} ${medications.length === 1 ? 'medicación anotada' : 'medicaciones anotadas'} para hoy`,
      detail: timed.length ? timed.map((item) => `${item.name}${item.times[0] ? ` · ${item.times[0]}` : ''}`).join(' · ') : 'Consulta tu pauta registrada',
      to: '/medicacion',
      priority: 80,
    });
  }

  const latestSymptoms = symptoms[0];
  if (latestSymptoms) {
    const symptomNames = latestSymptoms.symptoms.slice(0, 2).map((item) => symptomMeta[item.id].label);
    const pain = typeof latestSymptoms.painScore === 'number' ? `Dolor ${latestSymptoms.painScore}/10` : '';
    const detail = [pain, symptomNames.join(', ')].filter(Boolean).join(' · ') || 'Revisa tu último registro';
    insights.push({ id: 'symptoms', icon: '◷', title: 'Tu último seguimiento', detail, to: '/seguimiento', priority: 70 });
  }

  if (consultation) {
    const days = Math.ceil((new Date(`${consultation.date}T12:00:00`).getTime() - new Date(`${today}T12:00:00`).getTime()) / 86400000);
    if (days <= 14) {
      insights.push({
        id: 'consultation',
        icon: '✎',
        title: days === 0 ? 'Consulta hoy' : days === 1 ? 'Consulta mañana' : `Consulta en ${days} días`,
        detail: 'Puedes preparar síntomas y preguntas',
        to: '/consulta',
        priority: 85,
      });
    }
  }

  if (mood) {
    insights.push({
      id: 'mood',
      icon: moodMeta[mood.mood].icon,
      title: `Hoy te encuentras: ${moodMeta[mood.mood].label.toLowerCase()}`,
      detail: mood.mood === 'bien' ? 'Mantén aquello que te ayuda' : 'Tómate el día con calma y prioriza lo importante',
      to: '/seguimiento',
      priority: 60,
    });
  }

  if (!insights.length) {
    insights.push({ id: 'start', icon: '○', title: 'Empieza por lo que necesites hoy', detail: 'Puedes hablar, registrar una cita o anotar cómo te encuentras', to: '/hablame', priority: 1 });
  }

  return insights.sort((a, b) => b.priority - a.priority).slice(0, 4);
}

export function getPersonalAssistantContext(): { context: string; profileContext: string; cancerType: string } {
  const today = new Date();
  const todayKey = localDateKey(today);
  const nextEvents = readTreatmentEvents().filter((event) => event.date >= todayKey).slice(0, 4);
  const medications = medicationsForToday(readMedications()).slice(0, 8);
  const symptoms = readSymptomHistory().slice(0, 3);
  const moods = readMoodHistory().slice(0, 3);

  const eventText = nextEvents.length
    ? nextEvents.map((event) => `${treatmentEventMeta[event.type].label} ${event.date}${event.time ? ` ${event.time}` : ''}`).join('; ')
    : 'sin próximas citas anotadas';
  const medicationText = medications.length
    ? medications.map((item) => `${item.name}${item.dose ? ` ${item.dose}` : ''}${item.times.length ? ` (${item.times.join(', ')})` : ''}`).join('; ')
    : 'sin medicación anotada para hoy';
  const symptomText = symptoms.length
    ? symptoms.map((entry) => `${entry.date}: ${entry.symptoms.map((item) => `${symptomMeta[item.id].label} ${item.intensity}/3`).join(', ')}${typeof entry.painScore === 'number' ? `, dolor ${entry.painScore}/10` : ''}`).join('; ')
    : 'sin síntomas recientes anotados';
  const moodText = moods.length ? moods.map((entry) => `${entry.date}: ${moodMeta[entry.mood].label}`).join('; ') : 'sin estado de ánimo reciente anotado';

  return {
    context: `Contexto personal local aportado por la persona: próximas citas: ${eventText}. Medicación anotada para hoy: ${medicationText}. Seguimiento reciente: ${symptomText}. Estado emocional reciente: ${moodText}. Estos datos pueden estar incompletos o desactualizados; úsalos solo para adaptar la orientación y nunca para diagnosticar ni modificar tratamientos.`,
    profileContext: getCancerProfileContext(),
    cancerType: getCancerTypeId(),
  };
}
