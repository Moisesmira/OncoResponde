export type ConsultationStatus = 'mucho-mejor' | 'mejor' | 'igual' | 'peor' | 'mucho-peor' | '';

export type ConsultationDraft = {
  status: ConsultationStatus;
  newSymptoms: string;
  fever: 'si' | 'no' | '';
  emergencyCare: 'si' | 'no' | '';
  medicationNeeds: string;
  questions: string[];
  notes: string;
  updatedAt: string;
};

const STORAGE_KEY = 'oncoresponde:consultation-draft:v1';

export const emptyConsultationDraft: ConsultationDraft = {
  status: '',
  newSymptoms: '',
  fever: '',
  emergencyCare: '',
  medicationNeeds: '',
  questions: [''],
  notes: '',
  updatedAt: '',
};

export function readConsultationDraft(): ConsultationDraft {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<ConsultationDraft> | null;
    if (!parsed || typeof parsed !== 'object') return emptyConsultationDraft;
    return {
      ...emptyConsultationDraft,
      ...parsed,
      questions: Array.isArray(parsed.questions) && parsed.questions.length ? parsed.questions.slice(0, 10) : [''],
    };
  } catch {
    return emptyConsultationDraft;
  }
}

export function saveConsultationDraft(draft: Omit<ConsultationDraft, 'updatedAt'>): ConsultationDraft {
  const saved = { ...draft, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return saved;
}

export function clearConsultationDraft(): void {
  localStorage.removeItem(STORAGE_KEY);
}
