import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import NavHeader from '../components/NavHeader';
import { oneMinuteEpisodes, type AudioCategory, type OneMinuteEpisode } from '../data/oneMinuteEpisodes';
import { useAppStore } from '../store/useAppStore';

const ALL = 'Todos';
const categories: Array<AudioCategory | typeof ALL> = [ALL, 'Respiración', 'Bienestar emocional', 'Tratamientos', 'Dormir mejor', 'Espera', 'Familia', 'Meditaciones', 'Primeros días'];
const LS_FAV = 'oncoresponde-audio-favourites';
const LS_RECENT = 'oncoresponde-audio-recent';
const LS_FEEDBACK = 'oncoresponde-minute-feedback';

function readList(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function readFeedback(): Record<string, 'yes' | 'no'> {
  try { return JSON.parse(localStorage.getItem(LS_FEEDBACK) || '{}'); } catch { return {}; }
}

export default function OneMinute() {
  const mood = useAppStore((state) => state.mood);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<AudioCategory | typeof ALL>(ALL);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(0.85);
  const [favourites, setFavourites] = useState<string[]>(() => readList(LS_FAV));
  const [recent, setRecent] = useState<string[]>(() => readList(LS_RECENT));
  const [feedback, setFeedback] = useState<Record<string, 'yes' | 'no'>>(() => readFeedback());
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const recommended = useMemo(() => {
    if (mood === 'preocupado' || mood === 'apoyo') return oneMinuteEpisodes.find((e) => e.id === 'respirar-ansiedad')!;
    if (mood === 'regular') return oneMinuteEpisodes.find((e) => e.id === 'una-cosa-hoy')!;
    return oneMinuteEpisodes.find((e) => e.id === 'cuando-todo-empieza')!;
  }, [mood]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return oneMinuteEpisodes.filter((episode) => {
      const categoryMatches = category === ALL || episode.category === category;
      const text = `${episode.title} ${episode.description} ${episode.tags.join(' ')}`.toLowerCase();
      return categoryMatches && (!needle || text.includes(needle));
    });
  }, [category, query]);

  const recentEpisodes = recent.map((id) => oneMinuteEpisodes.find((e) => e.id === id)).filter(Boolean) as OneMinuteEpisode[];
  const favouriteEpisodes = favourites.map((id) => oneMinuteEpisodes.find((e) => e.id === id)).filter(Boolean) as OneMinuteEpisode[];
  const activeEpisode = oneMinuteEpisodes.find((e) => e.id === activeId) || null;

  function rememberRecent(id: string) {
    const next = [id, ...recent.filter((item) => item !== id)].slice(0, 6);
    setRecent(next); localStorage.setItem(LS_RECENT, JSON.stringify(next));
  }
  function play(episode: OneMinuteEpisode, selectedRate = rate) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(episode.script);
    speech.lang = 'es-ES'; speech.rate = selectedRate;
    speech.onend = () => { setActiveId(null); setPaused(false); };
    speech.onerror = () => { setActiveId(null); setPaused(false); };
    utteranceRef.current = speech;
    setActiveId(episode.id); setPaused(false); rememberRecent(episode.id);
    localStorage.setItem('oncoresponde:last-audio', JSON.stringify({ id: episode.id, title: episode.title, at: new Date().toISOString() }));
    window.speechSynthesis.speak(speech);
  }
  function togglePause() {
    if (!activeId) return;
    if (paused) window.speechSynthesis.resume(); else window.speechSynthesis.pause();
    setPaused(!paused);
  }
  function stop() { window.speechSynthesis?.cancel(); setActiveId(null); setPaused(false); }
  function changeRate(next: number) { setRate(next); if (activeEpisode) play(activeEpisode, next); }
  function toggleFavourite(id: string) {
    const next = favourites.includes(id) ? favourites.filter((item) => item !== id) : [id, ...favourites];
    setFavourites(next); localStorage.setItem(LS_FAV, JSON.stringify(next));
  }
  function saveFeedback(id: string, value: 'yes' | 'no') {
    const next = { ...feedback, [id]: value }; setFeedback(next); localStorage.setItem(LS_FEEDBACK, JSON.stringify(next));
  }

  function EpisodeCard({ episode }: { episode: OneMinuteEpisode }) {
    const playing = activeId === episode.id;
    const fav = favourites.includes(episode.id);
    return <article className={`audio-library-card${playing ? ' is-playing' : ''}`}>
      <div className="audio-library-card__top"><span>{episode.category}</span><button type="button" className="favourite-button" onClick={() => toggleFavourite(episode.id)} aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'} aria-pressed={fav}>{fav ? '★' : '☆'}</button></div>
      <h3>{episode.title}</h3><p>{episode.description}</p>
      <div className="audio-library-card__meta"><small>🎧 {episode.duration}</small><button type="button" onClick={() => play(episode)}>{playing ? '↻ Reiniciar' : '▶ Escuchar'}</button></div>
      {feedback[episode.id] && <small className="audio-library-card__rated">Valorado {feedback[episode.id] === 'yes' ? '👍' : '👎'}</small>}
    </article>;
  }

  return <>
    <main className="minute-page audio-library-page" id="main-content">
      <NavHeader title="Escuchar y relajarte" backTo="/cuidate" backLabel="Cuídate" />
      <section className="audio-library-hero">
        <div><span className="section-kicker">Biblioteca de acompañamiento</span><h1>🎧 Escuchar y relajarte</h1><p>Cápsulas breves para comprender, respirar, descansar y sentirte acompañado.</p></div>
        <div className="audio-library-summary"><b>{oneMinuteEpisodes.length}</b><span>audios disponibles</span></div>
      </section>

      <section className="recommended-audio" aria-labelledby="recommended-title">
        <div><span className="section-kicker">Recomendado para ti</span><h2 id="recommended-title">{recommended.title}</h2><p>{recommended.description}</p><small>{recommended.category} · {recommended.duration}</small></div>
        <button type="button" onClick={() => play(recommended)}>▶ Escuchar ahora</button>
      </section>

      <section className="audio-sticky-player" aria-live="polite">
        <div><span className="section-kicker">Reproductor</span><strong>{activeEpisode ? activeEpisode.title : 'Elige un audio'}</strong><small>{activeEpisode ? (paused ? 'En pausa' : 'Reproduciendo') : 'La voz se genera en este dispositivo.'}</small></div>
        <div className="audio-sticky-player__controls">
          <button type="button" onClick={togglePause} disabled={!activeEpisode}>{paused ? '▶ Reanudar' : '⏸ Pausa'}</button>
          <button type="button" onClick={stop} disabled={!activeEpisode}>■ Detener</button>
          <label>Velocidad<select value={rate} onChange={(e) => changeRate(Number(e.target.value))}><option value="0.7">0,70×</option><option value="0.85">0,85×</option><option value="1">1,00×</option><option value="1.15">1,15×</option></select></label>
        </div>
        {activeEpisode && <div className="audio-player-followup"><div><strong>¿Te ha resultado útil?</strong><button className={feedback[activeEpisode.id] === 'yes' ? 'is-selected' : ''} onClick={() => saveFeedback(activeEpisode.id, 'yes')}>👍 Sí</button><button className={feedback[activeEpisode.id] === 'no' ? 'is-selected' : ''} onClick={() => saveFeedback(activeEpisode.id, 'no')}>👎 No</button></div><Link className="button" to="/hablame" state={{ prefill: `He escuchado «${activeEpisode.title}» y quisiera preguntar: ` }}>💬 Hablar sobre este tema</Link></div>}
      </section>

      <section className="audio-library-tools" aria-label="Buscar y filtrar audios">
        <label className="audio-search"><span>Buscar un audio</span><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ej.: miedo, radioterapia, dormir…" /></label>
        <div className="audio-category-tabs" role="group" aria-label="Categorías">{categories.map((item) => <button type="button" key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </section>

      {favouriteEpisodes.length > 0 && <section className="audio-shelf"><div className="section-heading section-heading--compact"><div><span className="section-kicker">Guardados</span><h2>Mis favoritos</h2></div></div><div className="audio-library-grid">{favouriteEpisodes.slice(0,4).map((e) => <EpisodeCard key={e.id} episode={e} />)}</div></section>}
      {recentEpisodes.length > 0 && <section className="audio-shelf"><div className="section-heading section-heading--compact"><div><span className="section-kicker">Tu actividad</span><h2>Escuchados recientemente</h2></div></div><div className="audio-library-grid">{recentEpisodes.slice(0,4).map((e) => <EpisodeCard key={e.id} episode={e} />)}</div></section>}

      <section className="audio-shelf"><div className="section-heading section-heading--compact"><div><span className="section-kicker">Biblioteca</span><h2>{category === ALL ? 'Todos los audios' : category}</h2></div><small>{filtered.length} resultados</small></div>{filtered.length ? <div className="audio-library-grid">{filtered.map((e) => <EpisodeCard key={e.id} episode={e} />)}</div> : <div className="empty-audio-state"><strong>No hemos encontrado audios</strong><p>Prueba con otra palabra o categoría.</p></div>}</section>
      <section className="wellness-note" role="note"><strong>Contenido de apoyo</strong><p>No sustituye una valoración sanitaria. Si aparecen síntomas intensos, nuevos o preocupantes, consulta con tu equipo.</p></section>
    </main><BottomNav />
  </>;
}
