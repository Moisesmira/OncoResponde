export type TreatmentEventType =
  | 'radioterapia' | 'quimioterapia' | 'inmunoterapia' | 'terapia-dirigida'
  | 'cirugia' | 'analitica' | 'tac' | 'pet' | 'resonancia' | 'consulta' | 'otro';

export type TreatmentEvent = {
  id: string;
  type: TreatmentEventType;
  date: string;
  time?: string;
  title?: string;
  note?: string;
  createdAt: string;
};

export const treatmentEventMeta: Record<TreatmentEventType, { label: string; icon: string; prepareId?: string }> = {
  radioterapia: { label: 'Radioterapia', icon: '☀', prepareId: 'radioterapia' },
  quimioterapia: { label: 'Quimioterapia', icon: '💧', prepareId: 'quimioterapia' },
  inmunoterapia: { label: 'Inmunoterapia', icon: '◉' },
  'terapia-dirigida': { label: 'Terapia dirigida', icon: '◎' },
  cirugia: { label: 'Cirugía', icon: '✚', prepareId: 'cirugia' },
  analitica: { label: 'Analítica', icon: '🩸', prepareId: 'analitica' },
  tac: { label: 'TAC', icon: '◌', prepareId: 'tac' },
  pet: { label: 'PET/CT', icon: '✦', prepareId: 'pet' },
  resonancia: { label: 'Resonancia', icon: '🧲', prepareId: 'resonancia' },
  consulta: { label: 'Consulta', icon: '🗣️', prepareId: 'consulta' },
  otro: { label: 'Otro', icon: '▣' },
};

const STORAGE_KEY = 'oncoresponde:treatment-events:v1';

export function readTreatmentEvents(): TreatmentEvent[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is TreatmentEvent => Boolean(item && typeof item === 'object' && typeof (item as TreatmentEvent).id === 'string' && typeof (item as TreatmentEvent).date === 'string'))
      .sort((a, b) => `${a.date}T${a.time ?? '23:59'}`.localeCompare(`${b.date}T${b.time ?? '23:59'}`));
  } catch { return []; }
}

export function saveTreatmentEvent(event: Omit<TreatmentEvent, 'id' | 'createdAt'>): TreatmentEvent[] {
  const next = [...readTreatmentEvents(), { ...event, id: crypto.randomUUID?.() ?? `${Date.now()}`, createdAt: new Date().toISOString() }]
    .sort((a, b) => `${a.date}T${a.time ?? '23:59'}`.localeCompare(`${b.date}T${b.time ?? '23:59'}`))
    .slice(-250);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function deleteTreatmentEvent(id: string): TreatmentEvent[] {
  const next = readTreatmentEvents().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
