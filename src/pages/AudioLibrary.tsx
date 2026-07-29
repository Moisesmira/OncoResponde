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

const AUDIO_TWO_TEXT = `Hola de nuevo.

Me alegra que continúes con nosotros.

En este audio quiero enseñarte cómo utilizar OncoResponde de una forma sencilla y aprovechar al máximo todo lo que la aplicación puede ofrecerte.

No es necesario explorar todas las funciones desde el primer día.

Cada persona vive el proceso del cáncer de una manera diferente, y la aplicación está pensada para adaptarse a tus necesidades en cada momento.

En la pantalla principal encontrarás diferentes apartados.

Puedes utilizarlos en el orden que prefieras.

Si tienes una duda concreta, simplemente escríbela o háblame utilizando la función de voz.

Intentaré responderte con información clara, comprensible y basada en fuentes científicas fiables.

Recuerda que mis respuestas tienen un carácter orientativo y nunca sustituyen la valoración de los profesionales que conocen tu caso.

También encontrarás apartados dedicados al bienestar.

Podrás acceder a recomendaciones sobre alimentación, actividad física, descanso, bienestar emocional y otras áreas que pueden ayudarte durante el tratamiento y la recuperación.

Si en algún momento necesitas detenerte unos minutos, puedes acceder a la Biblioteca Sonora.

Allí encontrarás explicaciones, ejercicios de respiración, meditaciones guiadas y contenidos creados para acompañarte cuando más lo necesites.

No existe una forma correcta de utilizar OncoResponde.

Algunas personas consultan la aplicación antes de una visita médica para preparar sus preguntas.

Otras la utilizan después de la consulta para comprender mejor la información recibida.

Y muchas vuelven simplemente cuando necesitan resolver una duda o encontrar un momento de calma.

Te animamos también a compartir la aplicación con las personas que te acompañan.

Familiares y cuidadores suelen tener las mismas dudas que los pacientes, y comprender mejor el proceso puede ayudarles a ofrecer un apoyo más útil y más tranquilo.

Nuestro objetivo es que OncoResponde sea una herramienta sencilla, cercana y siempre disponible.

Un lugar donde encontrar respuestas cuando las necesites y un apoyo entre una consulta y la siguiente.

Gracias por seguir con nosotros.

Continuamos acompañándote, paso a paso.

Gracias por escuchar este audio de la Biblioteca Sonora OncoResponde.

Puedes volver a escucharlo siempre que lo necesites y descubrir el resto de contenidos disponibles en la aplicación.

Recuerda que la información que ofrecemos es orientativa y no sustituye el consejo de tu equipo sanitario.

Gracias por confiar en nosotros. Seguimos a tu lado.`;


const AUDIO_THREE_TEXT = `Hola.

Me alegra que sigas aquí.

Ahora que ya conoces la aplicación, quiero compartir contigo algunas ideas para que puedas sacar el máximo partido a OncoResponde.

No se trata de utilizar todas sus funciones cada día. Se trata de encontrar el apoyo adecuado en el momento en que lo necesites.

Hay días en los que quizá solo quieras resolver una duda. Otros días necesitarás comprender mejor un tratamiento. Y habrá momentos en los que simplemente te apetecerá escuchar una voz tranquila que te ayude a respirar y detenerte unos minutos.

Todo eso forma parte de OncoResponde.

Antes de una consulta médica, puedes utilizar la aplicación para preparar las preguntas que quieras hacer a tu equipo sanitario. Muchas personas descubren que, cuando llega la consulta, olvidan algunas de las dudas que habían pensado en casa. Anotarlas previamente puede ayudarte a aprovechar mejor ese tiempo.

Después de una consulta, también puedes volver a la aplicación. A veces los profesionales utilizan términos médicos que necesitan un poco más de tiempo para ser comprendidos. Aquí podrás encontrar explicaciones sencillas que complementan la información recibida.

Si vas a comenzar un tratamiento, puedes consultar cómo suele desarrollarse, qué efectos secundarios son frecuentes y qué recomendaciones generales pueden ayudarte a afrontarlo mejor.

Recuerda que cada persona responde de una manera diferente. Por eso, la información que encontrarás tiene un carácter orientativo y nunca sustituye las indicaciones de tu equipo sanitario.

También queremos acompañarte más allá de los aspectos médicos.

Encontrarás contenidos dedicados al bienestar emocional, la alimentación, el ejercicio físico, el descanso y la relajación. Pequeños recursos que pueden ayudarte a cuidar de ti en el día a día.

La Biblioteca Sonora está pensada precisamente para esos momentos. Cuando necesites detenerte. Cuando quieras comprender algo con calma. O simplemente cuando necesites sentir que alguien te acompaña.

Si compartes este camino con un familiar o una persona cercana, invítale también a utilizar la aplicación. Muchas veces ellos tienen las mismas dudas que tú. Y comprender mejor el proceso puede ayudarles a acompañarte de una forma más tranquila y más útil.

No existe una única forma de utilizar OncoResponde.

Hazlo a tu ritmo. Vuelve cuando lo necesites. Explora solo aquello que te resulte útil.

Porque cada paciente es diferente. Cada historia es diferente. Y cada proceso merece un acompañamiento respetuoso y personalizado.

Esperamos que, poco a poco, esta aplicación se convierta en un lugar de confianza al que puedas regresar siempre que aparezca una nueva pregunta. O simplemente cuando necesites unos minutos para respirar.

Gracias por seguir caminando con nosotros.

Gracias por escuchar este audio de la Biblioteca Sonora OncoResponde.

Esperamos que esta información te haya resultado útil.

Recuerda que puedes volver a escuchar este contenido siempre que lo necesites y descubrir nuevos recursos en la aplicación.

La información ofrecida es orientativa y no sustituye la valoración de tu equipo sanitario.

Gracias por confiar en OncoResponde. Seguimos a tu lado.`;



const AUDIO_FOUR_TEXT = `Hola.

Gracias por continuar escuchando la Biblioteca Sonora de OncoResponde.

En este audio queremos contarte qué puedes esperar de nosotros y cuál es el compromiso que asumimos contigo.

Sabemos que, cuando aparece un cáncer, también aparecen muchas preguntas.

No siempre es fácil encontrar información clara.

A veces hay demasiados datos.

Otras veces, la información resulta difícil de comprender o incluso puede generar más preocupación.

Nuestro objetivo es ayudarte a distinguir lo importante.

Queremos ofrecerte información rigurosa, actualizada y explicada con un lenguaje sencillo.

Cada contenido de OncoResponde ha sido elaborado para ayudarte a comprender mejor el proceso oncológico y facilitar la comunicación con los profesionales que te atienden.

Aquí encontrarás explicaciones sobre pruebas diagnósticas, tratamientos, efectos secundarios, alimentación, ejercicio físico, bienestar emocional y muchos otros temas que forman parte del día a día de muchas personas con cáncer.

También queremos acompañarte emocionalmente.

Sabemos que el bienestar no depende únicamente de los tratamientos.

La tranquilidad, el descanso, la respiración consciente, la información comprensible y el apoyo también forman parte del cuidado.

Por eso encontrarás ejercicios de relajación, meditaciones guiadas y contenidos pensados para ayudarte en los momentos de incertidumbre.

Pero también queremos ser completamente transparentes.

OncoResponde no sustituye la atención médica.

Las respuestas que ofrecemos son orientativas y pueden no adaptarse exactamente a tu situación.

Cada persona es diferente.

Cada enfermedad tiene sus propias características.

Y cada tratamiento debe individualizarse.

Por eso, cualquier decisión relacionada con tu salud debe tomarse siempre junto a tu equipo sanitario.

Nuestro compromiso es acompañarte.

Escucharte.

Ayudarte a comprender.

Y ofrecerte herramientas que puedan hacer este camino un poco más fácil.

Gracias por confiar en nosotros.

Seguiremos trabajando para estar a tu lado.

Gracias por escuchar este audio de la Biblioteca Sonora OncoResponde.

Esperamos que esta información te haya resultado útil.

Recuerda que puedes volver a escucharlo siempre que lo necesites.

Gracias por confiar en nosotros.`;

const AUDIO_FIVE_TEXT = `Hola.

En este último audio del primer volumen queremos hablar de algo muy importante.

La comunicación con tu equipo sanitario.

Los profesionales que te atienden son las personas que mejor conocen tu situación clínica.

Trabajar juntos, compartiendo información y resolviendo dudas, puede ayudarte a vivir el proceso con mayor tranquilidad y seguridad.

No tengas miedo a preguntar.

No existen preguntas pequeñas cuando hablamos de tu salud.

Si algo no ha quedado claro durante una consulta, pide que te lo expliquen de otra manera.

Comprender lo que está ocurriendo te permitirá participar de forma más activa en las decisiones relacionadas con tu tratamiento.

Muchas personas encuentran útil preparar previamente las preguntas que desean hacer.

Puedes anotarlas en una libreta, en el teléfono o incluso utilizar OncoResponde para ir organizando tus dudas.

De este modo aprovecharás mejor el tiempo de la consulta.

También es importante explicar cómo te encuentras realmente.

Habla de tus síntomas físicos.

Pero también de cómo te sientes emocionalmente.

La ansiedad.

El miedo.

La tristeza.

Las dificultades para dormir.

El cansancio.

Todo ello forma parte de tu salud y merece ser atendido.

Si acudes acompañado por un familiar o una persona de confianza, esa persona también puede ayudarte a recordar la información recibida y apoyarte durante las decisiones importantes.

Recuerda que las decisiones relacionadas con tu tratamiento se toman de forma individualizada.

Los profesionales aportan su experiencia y sus conocimientos.

Tú aportas tus preferencias, tus necesidades y cómo estás viviendo este proceso.

Juntos formaréis el mejor equipo posible.

Desde OncoResponde queremos ayudarte a preparar esas conversaciones.

A comprender mejor las explicaciones.

Y a sentirte más seguro cuando llegue el momento de tomar decisiones.

Porque una buena comunicación también forma parte del tratamiento.

Gracias por compartir este primer volumen con nosotros.

Esperamos seguir acompañándote durante todo el camino.

Has terminado el primer volumen de la Biblioteca Sonora OncoResponde.

Esperamos que estos primeros audios te hayan ayudado a conocer mejor la aplicación y a sentirte acompañado desde el primer momento.

En el siguiente volumen comenzaremos a comprender mejor qué es el cáncer, cómo se desarrolla y qué significan muchos de los términos médicos que pueden aparecer durante el proceso.

Gracias por confiar en OncoResponde.

Seguimos a tu lado.`;

const CACHE_NAME = 'oncoresponde-fixed-audio-v3';

type Track = {
  id: string;
  title: string;
  duration: string;
  ready: boolean;
  text?: string;
  cacheKey?: string;
};

const volumeTracks: Track[] = [
  {
    id: 'bienvenido',
    title: 'Bienvenido a OncoResponde',
    duration: '3–4 min',
    ready: true,
    text: AUDIO_ONE_TEXT,
    cacheKey: '/audio-cache/volumen-1-bienvenido-cristina.mp3',
  },
  {
    id: 'utilizar',
    title: 'Cómo utilizar la aplicación',
    duration: '3 min',
    ready: true,
    text: AUDIO_TWO_TEXT,
    cacheKey: '/audio-cache/volumen-1-como-utilizar-cristina.mp3',
  },
  {
    id: 'aprovechar',
    title: 'Cómo aprovechar OncoResponde',
    duration: '4 min',
    ready: true,
    text: AUDIO_THREE_TEXT,
    cacheKey: '/audio-cache/volumen-1-como-aprovechar-cristina.mp3',
  },
  {
    id: 'esperar',
    title: 'Qué puedes esperar de nosotros',
    duration: '3 min',
    ready: true,
    text: AUDIO_FOUR_TEXT,
    cacheKey: '/audio-cache/volumen-1-que-puedes-esperar-cristina.mp3',
  },
  {
    id: 'equipo',
    title: 'Cómo hablar con tu equipo sanitario',
    duration: '4 min',
    ready: true,
    text: AUDIO_FIVE_TEXT,
    cacheKey: '/audio-cache/volumen-1-hablar-equipo-sanitario-cristina.mp3',
  },
];

export default function AudioLibrary() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<Track>(volumeTracks[0]);
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [rate, setRate] = useState(1);

  function clearObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  useEffect(() => {
    let cancelled = false;
    setPlaying(false);
    setAudioUrl('');
    setError('');
    clearObjectUrl();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }

    async function loadCachedAudio() {
      if (!activeTrack.cacheKey || !('caches' in window)) return;
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(activeTrack.cacheKey);
      if (!cached || cancelled) return;
      const blob = await cached.blob();
      const url = URL.createObjectURL(blob);
      if (cancelled) {
        URL.revokeObjectURL(url);
        return;
      }
      objectUrlRef.current = url;
      setAudioUrl(url);
    }

    loadCachedAudio().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [activeTrack.id]);

  useEffect(() => () => clearObjectUrl(), []);

  async function ensureAudio(track = activeTrack) {
    if (track.id === activeTrack.id && audioUrl) return audioUrl;
    if (!track.text || !track.cacheKey) throw new Error('Este audio todavía no está disponible.');

    setLoading(true);
    setError('');
    try {
      if ('caches' in window) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(track.cacheKey);
        if (cached) {
          const cachedBlob = await cached.blob();
          clearObjectUrl();
          const cachedUrl = URL.createObjectURL(cachedBlob);
          objectUrlRef.current = cachedUrl;
          setAudioUrl(cachedUrl);
          return cachedUrl;
        }
      }

      const response = await fetch('/.netlify/functions/voz?v=3.5.3-audios4-5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: track.text }),
      });
      if (!response.ok) {
        const details = await response.json().catch(() => ({}));
        throw new Error(details.error || 'No se ha podido crear el audio con Cristina.');
      }
      const blob = await response.blob();
      if (!blob.size || !blob.type.includes('audio')) {
        throw new Error('La respuesta recibida no contiene un audio válido.');
      }
      if ('caches' in window) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(track.cacheKey, new Response(blob, {
          headers: { 'Content-Type': blob.type || 'audio/mpeg' },
        }));
      }
      clearObjectUrl();
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      setAudioUrl(url);
      return url;
    } finally {
      setLoading(false);
    }
  }

  async function selectAndPlay(track: Track) {
    if (!track.ready) return;
    try {
      if (activeTrack.id !== track.id) {
        setActiveTrack(track);
        setAudioUrl('');
        setPlaying(false);
        setError('');
      }
      const url = await ensureAudio(track);
      const player = audioRef.current;
      if (!player) return;
      if (player.src !== url) player.src = url;
      player.playbackRate = rate;
      await player.play();
      setPlaying(true);
      localStorage.setItem('oncoresponde:last-audio', JSON.stringify({
        title: track.title,
        id: `vol1-${track.id}`,
      }));
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
        {volumeTracks.map((track, index) => {
          const isActive = activeTrack.id === track.id;
          return (
            <article className={`sound-track${track.ready ? ' is-ready' : ' is-pending'}${isActive ? ' is-active' : ''}`} key={track.id}>
              <span className="sound-track__number">{String(index + 1).padStart(2, '0')}</span>
              <div className="sound-track__body">
                <h3>{track.title}</h3>
                <small>{track.duration} · Voz de Cristina</small>
                {!track.ready && <span className="sound-track__status">Próximamente</span>}
              </div>
              {track.ready ? (
                <button
                  type="button"
                  onClick={() => isActive && playing ? togglePause() : selectAndPlay(track)}
                  disabled={loading}
                >
                  {loading && isActive ? 'Creando audio…' : isActive && playing ? '⏸ Pausar' : '▶ Escuchar'}
                </button>
              ) : <button type="button" disabled>Próximamente</button>}
            </article>
          );
        })}
      </section>

      <section className="sound-player-card" aria-live="polite">
        <div>
          <span className="section-kicker">Ahora escuchas</span>
          <h2>{activeTrack.title}</h2>
          <p>{audioUrl ? 'Audio disponible en este dispositivo.' : 'La primera vez se creará con la voz Cristina y quedará guardado en este dispositivo.'}</p>
        </div>
        <audio
          ref={audioRef}
          src={audioUrl || undefined}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          controls={Boolean(audioUrl)}
          preload="metadata"
        />
        <div className="sound-player-card__controls">
          <button type="button" onClick={() => selectAndPlay(activeTrack)} disabled={loading}>
            {loading ? 'Creando…' : '▶ Reproducir'}
          </button>
          <label>Velocidad
            <select value={rate} onChange={(event) => changeRate(Number(event.target.value))}>
              <option value="0.75">0,75×</option>
              <option value="1">1×</option>
              <option value="1.25">1,25×</option>
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
