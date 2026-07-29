import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';

const AUDIO_ONE_TEXT = `Hola. Soy Cristina. Quiero darte la bienvenida a OncoResponde.

Antes de empezar, quiero decirte algo importante. Si hoy estás aquí, es posible que tú, o una persona a la que quieres, estéis viviendo un momento difícil.

Recibir un diagnóstico de cáncer, iniciar un tratamiento o acompañar a un ser querido puede generar muchas emociones. Es normal sentir incertidumbre. Es normal tener miedo. Es normal sentirse desbordado. No estás solo.

OncoResponde ha sido creado precisamente para acompañarte durante este camino. Aquí encontrarás información clara, explicada con un lenguaje sencillo y basada en el conocimiento científico disponible.

Nuestro objetivo es ayudarte a comprender mejor lo que está ocurriendo. Queremos resolver dudas, explicar tratamientos, acompañarte en los momentos de incertidumbre y ofrecerte herramientas que puedan ayudarte a sentirte más seguro.

Encontrarás información sobre radioterapia, quimioterapia, inmunoterapia, cirugía, alimentación, ejercicio físico, bienestar emocional, descanso y muchos otros aspectos relacionados con el cáncer.

También podrás escuchar ejercicios de respiración, meditaciones guiadas y contenidos diseñados para ayudarte a afrontar los momentos más difíciles.

Pero recuerda siempre algo muy importante. OncoResponde no sustituye la atención médica. Las respuestas que ofrecemos tienen un carácter orientativo y pueden contener errores. Las decisiones relacionadas con tu salud deben tomarse siempre junto a los profesionales que conocen tu caso.

Ellos son quienes mejor pueden ayudarte. Nosotros queremos acompañarte entre consulta y consulta. Resolver muchas de esas preguntas que aparecen cuando llegas a casa, o cuando necesitas entender mejor lo que estás viviendo.

Queremos que esta aplicación sea un lugar al que puedas volver siempre que lo necesites. Sin prisas. Sin miedo a preguntar. Y con la tranquilidad de encontrar información rigurosa y explicada pensando en las personas.

Gracias por confiar en nosotros. Gracias por permitirnos acompañarte.

Bienvenido a OncoResponde. Aquí comienza un camino en el que no estarás solo.`;

const CACHE_NAME = 'oncoresponde-fixed-audio-v1';
const CACHE_KEY = '/audio-cache/volumen-1-bienvenido-cristina.mp3';

const volumeTracks = [
  { id: 'bienvenido', title: 'Bienvenido a OncoResponde', duration: '3–4 min', ready: true },
  { id: 'utilizar', title: 'Cómo utilizar la aplicación', duration: '2 min', ready: false },
  { id: 'aprovechar', title: 'Cómo aprovechar OncoResponde', duration: '3 min', ready: false },
  { id: 'esperar', title: 'Qué puedes esperar de nosotros', duration: '2 min', ready: false },
  { id: 'equipo', title: 'Cómo hablar con tu equipo sanitario', duration: '4 min', ready: false },
];

export default function AudioLibrary() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [rate, setRate] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function loadCachedAudio() {
      if (!('caches' in window)) return;
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(CACHE_KEY);
      if (!cached || cancelled) return;
      const blob = await cached.blob();
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      setAudioUrl(url);
    }
    loadCachedAudio().catch(() => undefined);
    return () => {
      cancelled = true;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  async function ensureAudio() {
    if (audioUrl) return audioUrl;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/.netlify/functions/voz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: AUDIO_ONE_TEXT }),
      });
      if (!response.ok) {
        const details = await response.json().catch(() => ({}));
        throw new Error(details.error || 'No se ha podido crear el audio con Cristina.');
      }
      const blob = await response.blob();
      if (!blob.size || !blob.type.includes('audio')) throw new Error('La respuesta recibida no contiene un audio válido.');
      if ('caches' in window) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(CACHE_KEY, new Response(blob, { headers: { 'Content-Type': blob.type || 'audio/mpeg' } }));
      }
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      setAudioUrl(url);
      return url;
    } finally {
      setLoading(false);
    }
  }

  async function playAudio() {
    try {
      const url = await ensureAudio();
      const player = audioRef.current;
      if (!player) return;
      if (player.src !== url) player.src = url;
      player.playbackRate = rate;
      await player.play();
      setPlaying(true);
      localStorage.setItem('oncoresponde:last-audio', JSON.stringify({ title: 'Bienvenido a OncoResponde', id: 'vol1-bienvenido' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido reproducir el audio.');
    }
  }

  function togglePause() {
    const player = audioRef.current;
    if (!player) return;
    if (player.paused) {
      player.play().then(() => setPlaying(true)).catch(() => undefined);
    } else {
      player.pause();
      setPlaying(false);
    }
  }

  function changeRate(next: number) {
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  return <>
    <main className="sound-library-page" id="main-content">
      <NavHeader title="Biblioteca Sonora" backTo="/" backLabel="Inicio" />

      <section className="sound-library-hero">
        <div className="sound-library-hero__icon" aria-hidden="true">🎧</div>
        <div>
          <span className="section-kicker">Acompañamiento cuando lo necesites</span>
          <h1>Biblioteca Sonora</h1>
          <p>Audios claros y cercanos para comprender, respirar, descansar y sentirte acompañado durante el proceso oncológico.</p>
        </div>
      </section>

      <section className="sound-volume-card" aria-labelledby="volume-one-title">
        <div className="sound-volume-card__cover" aria-hidden="true"><span>I</span><small>OncoResponde</small></div>
        <div className="sound-volume-card__intro">
          <span className="section-kicker">Volumen I · 5 audios</span>
          <h2 id="volume-one-title">Bienvenidos a OncoResponde</h2>
          <p>Conoce la aplicación, descubre cómo puede ayudarte y prepara mejor la comunicación con tu equipo sanitario.</p>
        </div>
      </section>

      <section className="sound-track-list" aria-label="Audios del Volumen I">
        {volumeTracks.map((track, index) => (
          <article className={`sound-track${track.ready ? ' is-ready' : ' is-pending'}`} key={track.id}>
            <span className="sound-track__number">{String(index + 1).padStart(2, '0')}</span>
            <div className="sound-track__body">
              <h3>{track.title}</h3>
              <small>{track.duration} · Voz de Cristina</small>
              {!track.ready && <span className="sound-track__status">Próximamente</span>}
            </div>
            {track.ready ? <button type="button" onClick={playing ? togglePause : playAudio} disabled={loading}>
              {loading ? 'Creando audio…' : playing ? '⏸ Pausar' : '▶ Escuchar'}
            </button> : <button type="button" disabled>Próximamente</button>}
          </article>
        ))}
      </section>

      <section className="sound-player-card" aria-live="polite">
        <div>
          <span className="section-kicker">Ahora escuchas</span>
          <h2>Bienvenido a OncoResponde</h2>
          <p>{audioUrl ? 'Audio disponible en este dispositivo.' : 'La primera vez se creará con la voz Cristina y quedará guardado en este dispositivo.'}</p>
        </div>
        <audio ref={audioRef} src={audioUrl || undefined} onEnded={() => setPlaying(false)} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} controls={Boolean(audioUrl)} preload="metadata" />
        <div className="sound-player-card__controls">
          <button type="button" onClick={playAudio} disabled={loading}>{loading ? 'Creando…' : '▶ Reproducir'}</button>
          <label>Velocidad
            <select value={rate} onChange={(event) => changeRate(Number(event.target.value))}>
              <option value="0.75">0,75×</option><option value="1">1×</option><option value="1.25">1,25×</option>
            </select>
          </label>
        </div>
        {error && <p className="sound-player-error" role="alert">{error}</p>}
      </section>

      <section className="wellness-note" role="note">
        <strong>Orientación, no diagnóstico</strong>
        <p>Estos audios ofrecen información general y no sustituyen las indicaciones de tu equipo sanitario ni los servicios de urgencias.</p>
      </section>

      <Link className="button secondary sound-library-back" to="/">← Volver al inicio</Link>
    </main>
    <BottomNav />
  </>;
}
