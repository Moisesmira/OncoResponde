import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import NavHeader from '../components/NavHeader';
import { oneMinuteEpisodes, type OneMinuteEpisode } from '../data/oneMinuteEpisodes';

export default function OneMinute() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(0.85);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function play(episode: OneMinuteEpisode) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(episode.script);
    speech.lang = 'es-ES';
    speech.rate = rate;
    speech.onend = () => { setActiveId(null); setPaused(false); };
    speech.onerror = () => { setActiveId(null); setPaused(false); };
    setActiveId(episode.id);
    setPaused(false);
    window.speechSynthesis.speak(speech);
  }

  function togglePause() {
    if (!activeId) return;
    if (paused) window.speechSynthesis.resume();
    else window.speechSynthesis.pause();
    setPaused(!paused);
  }

  function stop() {
    window.speechSynthesis?.cancel();
    setActiveId(null);
    setPaused(false);
  }

  return (
    <>
      <main className="minute-page" id="main-content">
        <NavHeader title="Un minuto con OncoResponde" backTo="/" backLabel="Inicio" />
        <section className="minute-hero card">
          <span className="section-kicker">Un minuto para comprender, respirar y cuidarte</span>
          <h1>🎙️ Un minuto con OncoResponde</h1>
          <p>Mensajes breves y tranquilos para distintos momentos del proceso oncológico.</p>
          <p className="privacy-inline">La voz se genera en este dispositivo. No se envía información personal.</p>
        </section>

        <section className="minute-player card" aria-live="polite">
          <div>
            <span className="section-kicker">Reproductor</span>
            <h2>{activeId ? oneMinuteEpisodes.find((item) => item.id === activeId)?.title : 'Elige un episodio'}</h2>
            <p>{activeId ? (paused ? 'Audio en pausa' : 'Reproduciendo ahora') : 'Puedes detenerlo en cualquier momento.'}</p>
          </div>
          <div className="relax-controls">
            <button type="button" className="secondary-button" onClick={togglePause} disabled={!activeId}>{paused ? '▶ Continuar' : '⏸ Pausa'}</button>
            <button type="button" className="secondary-button" onClick={stop} disabled={!activeId}>■ Detener</button>
          </div>
          <label className="speed-control">
            <span>Velocidad de la voz: <strong>{rate.toFixed(2)}×</strong></span>
            <input type="range" min="0.65" max="1.05" step="0.05" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
            <small>Más lenta</small><small>Más rápida</small>
          </label>
        </section>

        <section className="minute-library" aria-labelledby="minute-library-title">
          <div className="section-heading section-heading--compact"><div><span className="section-kicker">Biblioteca</span><h2 id="minute-library-title">Escucha según tu momento</h2></div></div>
          <div className="minute-grid">
            {oneMinuteEpisodes.map((episode) => (
              <article className={`minute-episode${activeId === episode.id ? ' is-playing' : ''}`} key={episode.id}>
                <span className="minute-episode__category">{episode.category}</span>
                <h3>{episode.title}</h3>
                <p>{episode.description}</p>
                <div className="minute-episode__footer"><small>🎧 {episode.duration}</small><button type="button" onClick={() => play(episode)}>{activeId === episode.id ? 'Reiniciar' : '▶ Escuchar'}</button></div>
              </article>
            ))}
          </div>
        </section>

        <section className="wellness-note" role="note"><strong>Contenido de apoyo</strong><p>Estos audios ofrecen información general y acompañamiento. No sustituyen la valoración ni las recomendaciones de tu equipo sanitario.</p></section>
      </main>
      <BottomNav />
    </>
  );
}
