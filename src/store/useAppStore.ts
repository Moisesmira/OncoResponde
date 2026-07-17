import { create } from 'zustand';
import type { TrackedMood } from '../utils/moodTracking';

type Mood = TrackedMood | null;
type State = {
  mood: Mood;
  setMood: (mood: Mood) => void;
  dark: boolean;
  toggleDark: () => void;
};

export const useAppStore = create<State>((set) => ({
  mood: null,
  setMood: (mood) => set({ mood }),
  dark: false,
  toggleDark: () => set((state) => ({ dark: !state.dark })),
}));
