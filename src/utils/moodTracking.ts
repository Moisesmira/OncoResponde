export type TrackedMood = 'bien' | 'regular' | 'preocupado' | 'apoyo';

export type MoodEntry = {
  date: string;
  mood: TrackedMood;
  createdAt: string;
};

const STORAGE_KEY = 'oncoresponde:mood-history:v1';

export const moodMeta: Record<TrackedMood, { label: string; icon: string; score: number }> = {
  bien: { label: 'Bien', icon: '🙂', score: 4 },
  regular: { label: 'Regular', icon: '😐', score: 3 },
  preocupado: { label: 'Preocupado', icon: '😟', score: 2 },
  apoyo: { label: 'Necesito apoyo', icon: '♥', score: 1 },
};

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function readMoodHistory(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry): entry is MoodEntry => {
        if (!entry || typeof entry !== 'object') return false;
        const candidate = entry as Partial<MoodEntry>;
        return (
          typeof candidate.date === 'string' &&
          typeof candidate.createdAt === 'string' &&
          typeof candidate.mood === 'string' &&
          candidate.mood in moodMeta
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export function saveMoodForToday(mood: TrackedMood): MoodEntry[] {
  const history = readMoodHistory();
  const today = localDateKey();
  const entry: MoodEntry = { date: today, mood, createdAt: new Date().toISOString() };
  const next = [entry, ...history.filter((item) => item.date !== today)].slice(0, 180);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearMoodHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentStreak(history: MoodEntry[]): number {
  if (!history.length) return 0;
  const dates = new Set(history.map((entry) => entry.date));
  const cursor = new Date();
  if (!dates.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (dates.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
