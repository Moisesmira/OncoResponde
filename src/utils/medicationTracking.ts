export type MedicationFrequency = 'diaria' | 'dias-concretos' | 'cuando-necesario' | 'puntual';

export type Medication = {
  id: string;
  name: string;
  purpose?: string;
  dose?: string;
  frequency: MedicationFrequency;
  times: string[];
  weekdays?: number[];
  startDate: string;
  endDate?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
};

const STORAGE_KEY = 'oncoresponde_medications_v1';

export const medicationFrequencyLabels: Record<MedicationFrequency, string> = {
  diaria: 'Cada día',
  'dias-concretos': 'Días concretos',
  'cuando-necesario': 'Solo si lo necesito',
  puntual: 'Una fecha concreta',
};

export const weekdayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function readMedications(): Medication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Medication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMedications(items: Medication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
}

export function saveMedication(input: Omit<Medication, 'id' | 'createdAt' | 'active'>): Medication[] {
  const item: Medication = {
    ...input,
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    active: true,
    createdAt: new Date().toISOString(),
  };
  return writeMedications([item, ...readMedications()]);
}

export function toggleMedication(id: string): Medication[] {
  return writeMedications(readMedications().map((item) => item.id === id ? { ...item, active: !item.active } : item));
}

export function deleteMedication(id: string): Medication[] {
  return writeMedications(readMedications().filter((item) => item.id !== id));
}

export function isMedicationScheduledForDate(item: Medication, date = new Date()): boolean {
  if (!item.active) return false;
  const key = date.toLocaleDateString('en-CA');
  if (key < item.startDate || (item.endDate && key > item.endDate)) return false;
  if (item.frequency === 'cuando-necesario') return false;
  if (item.frequency === 'puntual') return key === item.startDate;
  if (item.frequency === 'dias-concretos') return Boolean(item.weekdays?.includes(date.getDay()));
  return true;
}

export function medicationsForToday(items = readMedications()): Medication[] {
  return items.filter((item) => isMedicationScheduledForDate(item));
}
