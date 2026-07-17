import { useEffect, useMemo, useRef, useState } from 'react';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';

type SpokenTrack = {
  id: string;
  kind: 'Guía' | 'Podcast';
  icon: string;
  title: string;
  duration: string;
  description: string;
  script: string;
};

type AmbientId = 'lluvia' | 'mar' | 'naturaleza';

const spokenTracks: SpokenTrack[] = [
  {
    id: 'respirar-despacio', kind: 'Guía', icon: '🫁', title: 'Respirar despacio', duration: '3 min',
    description: 'Una pausa breve para reducir el ritmo y volver al presente.',
    script: 'Busca una postura cómoda. No necesitas hacerlo perfecto. Deja caer los hombros. Toma aire suavemente por la nariz. Nota cómo entra. Suelta el aire un poco más despacio. De nuevo, inspira con suavidad. Haz una pausa breve, sin forzar. Y expira lentamente. Si aparece algún pensamiento, déjalo pasar y vuelve a notar la respiración. Continúa a tu ritmo. Inspira. Pausa. Expira. Permítete estar aquí durante unos instantes. Para terminar, mueve despacio las manos y abre los ojos cuando te resulte cómodo.'
  },
  {
    id: 'dormir-mejor', kind: 'Guía', icon: '😴', title: 'Prepararte para dormir', duration: '6 min',
    description: 'Relajación corporal sencilla para el final del día.',
    script: 'Acomódate y deja que el cuerpo encuentre apoyo. Cierra los ojos si te apetece. Observa la frente y permite que se suavice. Afloja la mandíbula. Deja descansar la lengua. Nota los hombros y permite que bajen. Siente el peso de los brazos. Respira sin cambiar nada. Lleva ahora la atención al pecho y al abdomen. Con cada espiración, suelta un poco de tensión. Nota las piernas apoyadas. No necesitas dormirte ahora mismo. Tu única tarea es descansar. Los pensamientos pueden estar presentes sin que tengas que resolverlos. Vuelve una y otra vez al aire que entra y sale. Esta noche basta con cuidarte y permitir que el descanso llegue a su ritmo.'
  },
  {
    id: 'antes-prueba', kind: 'Guía', icon: '🧭', title: 'Antes de una prueba', duration: '4 min',
    description: 'Para acompañar la espera antes de una prueba o tratamiento.',
    script: 'Es comprensible sentir inquietud antes de una prueba o tratamiento. Ahora mismo no tienes que resolver todo lo que pueda ocurrir. Mira a tu alrededor y nombra mentalmente tres cosas que ves. Nota dos sonidos. Siente un punto de apoyo de tu cuerpo. Respira con suavidad. Recuérdate: puedo ir paso a paso. Puedo pedir que me expliquen lo que necesite. Puedo decir si algo me incomoda. Vuelve a respirar. La incertidumbre puede estar aquí y, al mismo tiempo, tú puedes acompañarte con amabilidad durante este momento.'
  },
  {
    id: 'incertidumbre', kind: 'Podcast', icon: '🎙️', title: 'Vivir con incertidumbre', duration: '5 min',
    description: 'Ideas breves para comprender por qué la espera puede resultar tan difícil.',
    script: 'Bienvenido a este breve espacio de OncoResponde. La incertidumbre suele ser una de las experiencias más difíciles del cáncer. No saber qué mostrará una prueba o cómo evolucionará un tratamiento puede mantener la mente en alerta. Intentar eliminar por completo esa preocupación suele aumentar el esfuerzo. Puede ayudar diferenciar entre lo que puedes hacer hoy y lo que todavía no puede resolverse. Hoy quizá puedas anotar tus preguntas, preparar la próxima consulta, pedir compañía o dedicar unos minutos a una actividad concreta. También puede ser útil limitar el tiempo dedicado a buscar información y elegir fuentes fiables. Sentir preocupación no significa que estés afrontándolo mal. Significa que estás atravesando una situación importante. Si la ansiedad ocupa gran parte del día, altera mucho el sueño o impide tus actividades, coméntalo con tu equipo sanitario o solicita apoyo psicológico.'
  },
  {
    id: 'acompanar', kind: 'Podcast', icon: '🤝', title: 'Acompañar sin agotarse', duration: '5 min',
    description: 'Un mensaje para familiares y personas cuidadoras.',
    script: 'Acompañar a una persona con cáncer puede generar cariño, responsabilidad, miedo y cansancio al mismo tiempo. Cuidar no exige saber siempre qué decir. A menudo ayuda preguntar: ¿qué necesitas de mí hoy? Algunas personas quieren hablar; otras prefieren compañía silenciosa o ayuda práctica. También es importante que quien cuida conserve momentos de descanso, alimentación, sueño y relación con otras personas. Pedir relevo no es abandonar. Es una forma de sostener el acompañamiento. Evita prometer que todo irá bien si no puedes saberlo. Puedes decir: estoy aquí, iremos paso a paso. Si notas agotamiento persistente, irritabilidad intensa, tristeza o sensación de no poder más, busca apoyo en el equipo sanitario, trabajo social o psicooncología.'
  }
];

export default function Relaxation() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rate, setRate] = useState(0.85);
  const [isPaused, setIsPaused] = useState(false);
  const [ambient, setAmbient] = useState<AmbientId | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<AudioNode[]>([]);

  const activeTrack = useMemo(() => spokenTracks.find((track) => track.id === activeId), [activeId]);

  useEffect(() => () => {
    window.speechSynthesis?.cancel();
    stopAmbient();
  }, []);

  function stopSpeech() {
    window.speechSynthesis?.cancel();
    setActiveId(null);
    setIsPaused(false);
  }

  function playTrack(track: SpokenTrack) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(track.script);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.onend = () => { setActiveId(null); setIsPaused(false); };
    utterance.onerror = () => { setActiveId(null); setIsPaused(false); };
    setActiveId(track.id);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
  }

  function togglePause() {
    if (!activeId) return;
    if (isPaused) window.speechSynthesis.resume();
    else window.speechSynthesis.pause();
    setIsPaused(!isPaused);
  }

  function stopAmbient() {
    ambientNodesRef.current.forEach((node) => {
      try { node.disconnect(); } catch { /* no-op */ }
    });
    ambientNodesRef.current = [];
    audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    setAmbient(null);
  }

  function startAmbient(id: AmbientId) {
    stopAmbient();
    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    const ctx = new AudioContextCtor();
    audioContextRef.current = ctx;

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    if (id === 'lluvia') { filter.type = 'highpass'; filter.frequency.value = 900; gain.gain.value = 0.055; }
    if (id === 'mar') { filter.type = 'lowpass'; filter.frequency.value = 650; gain.gain.value = 0.12; }
    if (id === 'naturaleza') { filter.type = 'bandpass'; filter.frequency.value = 1400; filter.Q.value = 0.7; gain.gain.value = 0.045; }

    source.connect(filter); filter.connect(gain); gain.connect(ctx.destination); source.start();
    ambientNodesRef.current = [source, filter, gain];
    setAmbient(id);
  }

  function changeRate(value: number) {
    setRate(value);
    if (activeTrack) playTrack(activeTrack);
  }

  return (
    <>
      <main className="relax-page" id="main-content">
        <NavHeader title="Escucha y relájate" backTo="/cuidate" backLabel="Cuídate" />

        <section className="relax-hero card">
          <span className="section-kicker">Un momento para ti</span>
          <h1>🎧 Escucha y relájate</h1>
          <p>Guías habladas, micro-podcasts y sonidos suaves para acompañar momentos de espera, inquietud o descanso.</p>
          <p className="privacy-inline">Los audios se generan en tu dispositivo. No necesitas introducir datos personales.</p>
        </section>

        <section className="relax-player card" aria-live="polite">
          <div>
            <span className="section-kicker">Reproductor</span>
            <h2>{activeTrack ? `${activeTrack.icon} ${activeTrack.title}` : 'Elige un audio'}</h2>
            <p>{activeTrack ? (isPaused ? 'Audio en pausa' : 'Reproduciendo ahora') : 'Puedes detenerlo en cualquier momento.'}</p>
          </div>
          <div className="relax-controls">
            <button type="button" className="secondary-button" onClick={togglePause} disabled={!activeId}>{isPaused ? '▶ Continuar' : '⏸ Pausa'}</button>
            <button type="button" className="secondary-button" onClick={stopSpeech} disabled={!activeId}>■ Detener</button>
          </div>
          <label className="speed-control">
            <span>Velocidad de la voz: <strong>{rate.toFixed(2)}×</strong></span>
            <input type="range" min="0.65" max="1.1" step="0.05" value={rate} onChange={(event) => changeRate(Number(event.target.value))} />
            <small>Más lenta</small><small>Más rápida</small>
          </label>
        </section>

        <section className="relax-section card">
          <div className="section-heading"><div><span className="section-kicker">Relajaciones guiadas</span><h2>Escoge el momento</h2></div></div>
          <div className="audio-card-grid">
            {spokenTracks.filter((track) => track.kind === 'Guía').map((track) => (
              <article className={`audio-card${activeId === track.id ? ' is-playing' : ''}`} key={track.id}>
                <span className="audio-card__icon" aria-hidden="true">{track.icon}</span>
                <div><small>{track.kind} · {track.duration}</small><h3>{track.title}</h3><p>{track.description}</p></div>
                <button type="button" className="primary-button" onClick={() => playTrack(track)}>{activeId === track.id ? 'Reiniciar' : '▶ Escuchar'}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="relax-section card">
          <div className="section-heading"><div><span className="section-kicker">Micro-podcasts</span><h2>Comprender y acompañarte</h2></div></div>
          <div className="audio-card-grid">
            {spokenTracks.filter((track) => track.kind === 'Podcast').map((track) => (
              <article className={`audio-card${activeId === track.id ? ' is-playing' : ''}`} key={track.id}>
                <span className="audio-card__icon" aria-hidden="true">{track.icon}</span>
                <div><small>{track.kind} · {track.duration}</small><h3>{track.title}</h3><p>{track.description}</p></div>
                <button type="button" className="primary-button" onClick={() => playTrack(track)}>{activeId === track.id ? 'Reiniciar' : '▶ Escuchar'}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="relax-section card">
          <div className="section-heading"><div><span className="section-kicker">Música relajante</span><h2>Escuchar en YouTube</h2></div></div>
          <article className="audio-card external-audio-card">
            <span className="audio-card__icon" aria-hidden="true">🎼</span>
            <div>
              <small>Recurso externo · 3 h</small>
              <h3>Piano y naturaleza</h3>
              <p>Música tranquila para relajarte, descansar, leer o favorecer el sueño.</p>
              <p className="external-resource-note">Se abrirá YouTube en una pestaña nueva. El contenido y la publicidad dependen de YouTube.</p>
            </div>
            <a
              className="primary-button external-link-button"
              href="https://www.youtube.com/watch?v=MTrBYHZNF7k"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir Piano y naturaleza en YouTube, se abre en una pestaña nueva"
            >
              ▶ Abrir en YouTube
            </a>
          </article>
          <div className="future-music-grid" aria-label="Próximos recursos de música relajante">
            <span>🌧️ Lluvia suave · Próximamente</span>
            <span>🌊 Mar · Próximamente</span>
            <span>🌲 Bosque · Próximamente</span>
          </div>
        </section>

        <section className="relax-section card">
          <div className="section-heading"><div><span className="section-kicker">Sonidos relajantes</span><h2>Ambiente continuo</h2></div><p>Se generan localmente</p></div>
          <div className="ambient-grid">
            {([
              ['lluvia', '🌧️', 'Lluvia suave'],
              ['mar', '🌊', 'Oleaje profundo'],
              ['naturaleza', '🌿', 'Naturaleza'],
            ] as Array<[AmbientId, string, string]>).map(([id, icon, label]) => (
              <button type="button" key={id} className={ambient === id ? 'is-active' : ''} onClick={() => ambient === id ? stopAmbient() : startAmbient(id)}>
                <span>{icon}</span><strong>{label}</strong><small>{ambient === id ? '■ Detener' : '▶ Reproducir'}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="wellness-note" role="note">
          <strong>Contenido de apoyo</strong>
          <p>Estos recursos pueden ayudarte a relajarte, pero no sustituyen la atención sanitaria o psicológica. Si la angustia es intensa, persistente o te sientes en peligro, solicita ayuda profesional o llama al 112.</p>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
