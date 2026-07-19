import { oneMinuteEpisodes } from './oneMinuteEpisodes';

export type ProgramDay = { day:number; title:string; description:string; episodeId:string; action:string };
const ids = oneMinuteEpisodes.map((e)=>e.id);
const actions = [
  'Anota una duda para tu próxima consulta.','Haz tres respiraciones lentas.','Camina cinco minutos si te apetece.','Bebe un vaso de agua.','Llama a alguien que te haga sentir bien.','Descansa diez minutos sin culpa.','Prepara una pregunta para tu equipo.','Escucha una canción que te guste.','Sal a tomar el aire unos minutos.','Deja preparado algo que te facilite mañana.'
];
export const program30: ProgramDay[] = Array.from({length:30},(_,i)=>{
  const episode = oneMinuteEpisodes[i % ids.length];
  return { day:i+1, title:episode.title, description:episode.description, episodeId:episode.id, action:actions[i % actions.length] };
});
