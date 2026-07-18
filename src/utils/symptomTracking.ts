import { localDateKey } from './moodTracking';

export type SymptomId =
  | 'dolor'
  | 'cansancio'
  | 'nauseas'
  | 'vomitos'
  | 'apetito'
  | 'insomnio'
  | 'ansiedad'
  | 'estrenimiento'
  | 'diarrea'
  | 'disnea'
  | 'tos'
  | 'hormigueos'
  | 'fiebre'
  | 'otro';

export type SymptomIntensity = 1 | 2 | 3;

export type SymptomValue = {
  id: SymptomId;
  intensity: SymptomIntensity;
};

export type SymptomEntry = {
  date: string;
  symptoms: SymptomValue[];
  painScore?: number;
  temperature?: number;
  note?: string;
  createdAt: string;
};

export const symptomMeta: Record<SymptomId, { label: string; icon: string }> = {
  dolor: { label: 'Dolor', icon: '●' },
  cansancio: { label: 'Cansancio', icon: '⚡' },
  nauseas: { label: 'Náuseas', icon: '≈' },
  vomitos: { label: 'Vómitos', icon: '↗' },
  apetito: { label: 'Poco apetito', icon: '○' },
  insomnio: { label: 'Dormir mal', icon: '☾' },
  ansiedad: { label: 'Ansiedad', icon: '◌' },
  estrenimiento: { label: 'Estreñimiento', icon: '◇' },
  diarrea: { label: 'Diarrea', icon: '≋' },
  disnea: { label: 'Falta de aire', icon: '⌁' },
  tos: { label: 'Tos', icon: '≀' },
  hormigueos: { label: 'Hormigueos', icon: '✦' },
  fiebre: { label: 'Fiebre', icon: '°' },
  otro: { label: 'Otro', icon: '+' },
};

export const intensityLabels: Record<SymptomIntensity, string> = {
  1: 'Leve',
  2: 'Moderado',
  3: 'Intenso',
};

const STORAGE_KEY = 'oncoresponde:symptom-history:v1';

export function readSymptomHistory(): SymptomEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry): entry is SymptomEntry => {
        if (!entry || typeof entry !== 'object') return false;
        const candidate = entry as Partial<SymptomEntry>;
        return typeof candidate.date === 'string' && Array.isArray(candidate.symptoms);
      })
      .map((entry) => ({
        ...entry,
        painScore: typeof entry.painScore === 'number' && entry.painScore >= 0 && entry.painScore <= 10
          ? entry.painScore
          : undefined,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export function saveSymptomsForToday(
  symptoms: SymptomValue[],
  temperature?: number,
  note?: string,
  painScore?: number,
): SymptomEntry[] {
  const history = readSymptomHistory();
  const today = localDateKey();
  const entry: SymptomEntry = {
    date: today,
    symptoms,
    painScore: typeof painScore === 'number' && painScore >= 0 && painScore <= 10 ? painScore : undefined,
    temperature,
    note: note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...history.filter((item) => item.date !== today)].slice(0, 180);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearSymptomHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
