import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';
import { program30 } from '../data/program30';
import { oneMinuteEpisodes } from '../data/oneMinuteEpisodes';
import { useCristinaVoice } from '../hooks/useCristinaVoice';

const START = 'oncoresponde:program30:start';
const DONE = 'oncoresponde:program30:done';

function readDone(): number[] {
  try { return JSON.parse(localStorage.getItem(DONE) || '[]'); } catch { return []; }
}

function getCurrentDay() {
  const raw = localStorage.getItem(START);
  if (!raw) {
    localStorage.setItem(START, new Date().toISOString());
    return 1;
  }
  const diff = Math.floor((Date.now() - new Date(raw).getTime()) / 86400000) + 1;
  return Math.max(1, Math.min(30, diff));
}

export default function Program30() {
  const [done, setDone] = useState<number[]>(readDone);
  const current = getCurrentDay();
  const cristina = useCristinaVoice();
  const today = program30[current - 1];
  const episodesById = useMemo(
    () => new Map(oneMinuteEpisodes.map((episode) => [episode.id, episode])),
    [],
  );

  function toggle(day: number) {
    const next = done.includes(day) ? done.filter((item) => item !== day) : [...done, day];
    setDone(next);
    localStorage.setItem(DONE, JSON.stringify(next));
  }

  async function play(episodeId: string) {
    const episode = episodesById.get(episodeId);
    if (!episode) return;
    await cristina.speak({ text: episode.script, cacheKey: `minute-${episode.id}`, rate: .85 });
    localStorage.setItem('oncoresponde:last-audio', JSON.stringify({
      id: episode.id,
      title: episode.title,
      at: new Date().toISOString(),
    }));
  }

  return <>
    <main className="program-page">
      <NavHeader title="Programa de 30 días" backTo="/" backLabel="Inicio" />
      <section className="program-hero">
        <span className="section-kicker">Acompañamiento inicial</span>
        <h1>30 días, un paso cada día</h1>
        <p>Un audio breve y una acción sencilla. Puedes avanzar a tu ritmo y consultar toda la biblioteca cuando quieras.</p>
        <div className="program-progress"><b>{done.length}/30</b><span>completados</span><div><i style={{ width: `${done.length / 30 * 100}%` }} /></div></div>
      </section>
      <section className="program-today">
        <div><span className="section-kicker">Día {current}</span><h2>{today.title}</h2><p>{today.description}</p></div>
        <button onClick={() => play(today.episodeId)}>▶ Escuchar</button>
        <div className="program-action">
          <strong>Objetivo de hoy</strong><p>{today.action}</p>
          <button className={done.includes(current) ? 'is-complete' : ''} onClick={() => toggle(current)}>{done.includes(current) ? '✓ Conseguido' : 'Marcar como realizado'}</button>
        </div>
        <Link className="button secondary" to="/hablame" state={{ prefill: `Hoy he trabajado el tema «${today.title}» y quisiera preguntar: ` }}>💬 Hablar sobre este tema</Link>
      </section>
      <section className="program-grid" aria-label="Recorrido de 30 días">
        {program30.map((item) => {
          const isDone = done.includes(item.day);
          return <article key={item.day} className={`program-day${item.day === current ? ' is-current' : ''}${isDone ? ' is-done' : ''}`}>
            <span>Día {item.day}</span><strong>{item.title}</strong><small>{item.action}</small>
            <div className="program-day-actions">
              <button onClick={() => play(item.episodeId)} aria-label={`Escuchar día ${item.day}: ${item.title}`}>▶ Escuchar</button>
              <button className={isDone ? 'is-complete' : ''} onClick={() => toggle(item.day)} aria-label={isDone ? `Marcar día ${item.day} como pendiente` : `Marcar día ${item.day} como realizado`}>{isDone ? '✓ Realizado' : '○ Marcar realizado'}</button>
            </div>
          </article>;
        })}
      </section>
    </main>
    <BottomNav />
  </>;
}
