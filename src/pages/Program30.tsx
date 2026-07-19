import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';
import { program30 } from '../data/program30';
import { oneMinuteEpisodes } from '../data/oneMinuteEpisodes';

const START='oncoresponde:program30:start';
const DONE='oncoresponde:program30:done';
function readDone():number[]{ try{return JSON.parse(localStorage.getItem(DONE)||'[]')}catch{return[]} }
function getCurrentDay(){ const raw=localStorage.getItem(START); if(!raw){localStorage.setItem(START,new Date().toISOString()); return 1;} const diff=Math.floor((Date.now()-new Date(raw).getTime())/86400000)+1; return Math.max(1,Math.min(30,diff)); }

export default function Program30(){
 const [done,setDone]=useState<number[]>(readDone); const current=getCurrentDay();
 const today=program30[current-1]; const episode=useMemo(()=>oneMinuteEpisodes.find(e=>e.id===today.episodeId)!,[today]);
 function toggle(day:number){const next=done.includes(day)?done.filter(d=>d!==day):[...done,day];setDone(next);localStorage.setItem(DONE,JSON.stringify(next));}
 function play(){ if(!('speechSynthesis'in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(episode.script);u.lang='es-ES';u.rate=.85;speechSynthesis.speak(u);localStorage.setItem('oncoresponde:last-audio',JSON.stringify({id:episode.id,title:episode.title,at:new Date().toISOString()})); }
 return <><main className="program-page"><NavHeader title="Programa de 30 días" backTo="/" backLabel="Inicio" />
 <section className="program-hero"><span className="section-kicker">Acompañamiento inicial</span><h1>30 días, un paso cada día</h1><p>Un audio breve y una acción sencilla. Puedes avanzar a tu ritmo y consultar toda la biblioteca cuando quieras.</p><div className="program-progress"><b>{done.length}/30</b><span>completados</span><div><i style={{width:`${done.length/30*100}%`}} /></div></div></section>
 <section className="program-today"><div><span className="section-kicker">Día {current}</span><h2>{today.title}</h2><p>{today.description}</p></div><button onClick={play}>▶ Escuchar</button><div className="program-action"><strong>Objetivo de hoy</strong><p>{today.action}</p><button className={done.includes(current)?'is-complete':''} onClick={()=>toggle(current)}>{done.includes(current)?'✓ Conseguido':'Marcar como realizado'}</button></div><Link className="button secondary" to="/hablame" state={{prefill:`Hoy he trabajado el tema «${today.title}» y quisiera preguntar: `}}>💬 Hablar sobre este tema</Link></section>
 <section className="program-grid" aria-label="Recorrido de 30 días">{program30.map(item=><article key={item.day} className={`program-day${item.day===current?' is-current':''}${done.includes(item.day)?' is-done':''}`}><span>Día {item.day}</span><strong>{item.title}</strong><small>{item.action}</small><button onClick={()=>toggle(item.day)}>{done.includes(item.day)?'✓':'○'}</button></article>)}</section>
 </main><BottomNav/></>;
}
