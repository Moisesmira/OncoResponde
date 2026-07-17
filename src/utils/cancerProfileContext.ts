export type StoredCancerProfile = {
  cancerType?: string;
  histology?: string;
  stage?: string;
  treatments?: string[];
  age?: string;
  generalState?: string;
};

const STORAGE_KEY = 'oncoresponde-cancer-profile-v1';

export const cancerLabels: Record<string, string> = {
  mama: 'mama',
  prostata: 'próstata',
  pulmon: 'pulmón',
  colorrectal: 'colorrectal',
  ginecologico: 'ginecológico',
  'cabeza-cuello': 'cabeza y cuello',
  otro: 'otro tipo de cáncer',
};

export function getCancerProfileData(): StoredCancerProfile | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredCancerProfile;
  } catch {
    return null;
  }
}

export function getCancerProfileContext(): string {
  const profile = getCancerProfileData();
  if (!profile) return '';

  const parts: string[] = [];
  if (profile.cancerType) parts.push(`tipo de cáncer: ${cancerLabels[profile.cancerType] ?? profile.cancerType}`);
  if (profile.histology?.trim()) parts.push(`histología indicada: ${profile.histology.trim().slice(0, 120)}`);
  if (profile.stage?.trim()) parts.push(`estadio indicado: ${profile.stage.trim().slice(0, 40)}`);
  if (profile.treatments?.length) parts.push(`tratamientos indicados: ${profile.treatments.slice(0, 8).join(', ')}`);
  if (profile.age?.trim()) parts.push(`edad indicada: ${profile.age.trim().slice(0, 3)}`);
  if (profile.generalState?.trim()) parts.push(`estado general indicado: ${profile.generalState.trim().slice(0, 50)}`);
  return parts.join('; ');
}

export function getCancerTypeId(): string {
  return getCancerProfileData()?.cancerType ?? '';
}
