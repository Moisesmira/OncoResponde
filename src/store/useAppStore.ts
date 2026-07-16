import { create } from 'zustand';
type Mood='bien'|'regular'|'preocupado'|'apoyo'|null;
type State={mood:Mood;setMood:(m:Mood)=>void;dark:boolean;toggleDark:()=>void};
export const useAppStore=create<State>((set)=>({mood:null,setMood:(mood)=>set({mood}),dark:false,toggleDark:()=>set(s=>({dark:!s.dark}))}));
