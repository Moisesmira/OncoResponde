import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useAppStore } from '../store/useAppStore';
import { saveMoodForToday } from '../utils/moodTracking';

type MoodId = 'bien' | 'regular' | 'preocupado' | 'apoyo';

type Recommendation = {
  label: string;
  detail: string;
  to: string;
};

const moodOptions: Array<{ id: MoodId; label: string; icon: string; detail: string }> = [
  { id: 'bien', label: 'Bien', icon: '🙂', detail: 'Me encuentro con ánimo' },
  { id: 'regular', label: 'Regular', icon: '😐', detail: 'Necesito bajar el ritmo' },
  { id: 'preocupado', label: 'Preocupado', icon: '😟', detail: 'Hay algo que me inquieta' },
  { id: 'apoyo', label: 'Necesito apoyo', icon: '♥', detail: 'Quiero sentirme acompañado' },
];

const recommendations: Record<MoodId, { intro: string; energy: number; actions: Recommendation[] }> = {
  bien: {
    intro: 'Hoy puede ser un buen momento para cuidarte y mantener aquello que te ayuda.',
    energy: 4,
    actions: [
      { label: 'Muévete', detail: 'Actividad física adaptada', to: '/cuidate' },
      { label: 'Aliméntate mejor', detail: 'Consejos de alimentación', to: '/cuidate' },
      { label: 'Escribe en Mi Camino', detail: 'Guarda cómo te encuentras', to: '/camino' },
    ],
  },
  regular: {
    intro: 'Hoy quizá te ayude ir un poco más despacio y elegir una sola cosa sencilla.',
    energy: 3,
    actions: [
      { label: 'Descansa mejor', detail: 'Ideas para el sueño y el descanso', to: '/cuidate' },
      { label: 'Encuentra calma', detail: 'Respiración, música y pausa', to: '/calma' },
      { label: 'Escribe en Mi Camino', detail: 'Pon por escrito cómo estás', to: '/camino' },
    ],
  },
  preocupado: {
    intro: 'No tienes que resolverlo todo ahora. Podemos empezar por aquello que más te preocupa.',
    energy: 2,
    actions: [
      { label: 'Respira conmigo', detail: 'Haz una pausa guiada', to: '/calma' },
      { label: 'Cómo te sientes', detail: 'Bienestar emocional', to: '/cuidate' },
      { label: 'Háblame', detail: 'Cuéntame qué te preocupa', to: '/hablame' },
    ],
  },
  apoyo: {
    intro: 'Estoy aquí contigo. Elige el paso que te resulte más fácil en este momento.',
    energy: 1,
    actions: [
      { label: 'Un minuto para ti', detail: 'Una pausa breve y sin exigencias', to: '/calma' },
      { label: 'Háblame', detail: 'Puedes hablar o escribir', to: '/hablame' },
      { label: 'Familia y apoyo', detail: 'Recursos para ti y los tuyos', to: '/familia' },
    ],
  },
};

const accessCards = [
  { to: '/seguimiento', title: 'Mi seguimiento', text: 'Registra en 20 segundos cómo te encuentras hoy.', icon: '◷', tone: 'teal' },
  { to: '/perfil', title: 'Cuéntame sobre tu cáncer', text: 'Información opcional para adaptar mejor la ayuda.', icon: '○', tone: 'blue' },
  { to: '/oncoayuda', title: 'OncoAyuda', text: 'Haz una pregunta escrita y recibe orientación.', icon: '◌', tone: 'blue' },
  { to: '/cuidate', title: 'Cuídate', text: 'Alimentación, movimiento, descanso y bienestar.', icon: '♧', tone: 'green' },
  { to: '/calma', title: 'Encuentra calma', text: 'Respiración, música, audios y reflexiones.', icon: '≈', tone: 'teal' },
  { to: '/preparate', title: 'Prepárate', text: 'Información práctica antes de pruebas y tratamientos.', icon: '▣', tone: 'orange' },
  { to: '/camino', title: 'Mi Camino', text: 'Tu diario personal durante el proceso.', icon: '▤', tone: 'purple' },
  { to: '/familia', title: 'Familia y cuidadores', text: 'Acompañar y cuidarse también importa.', icon: '◎', tone: 'rose' },
  { to: '/fuentes', title: 'Fuentes fiables', text: 'Información sanitaria de referencia.', icon: '◇', tone: 'slate' },
  { to: '/ajustes', title: 'Ajustes y privacidad', text: 'Accesibilidad, datos locales y transparencia.', icon: '⚙', tone: 'slate' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function Today() {
  const { mood, setMood } = useAppStore();
  const selected = mood ? recommendations[mood] : null;

  return (
    <>
      <main className="today-page">
        <section className="today-hero" aria-labelledby="today-title">
          <img src="/assets/camino.png" alt="Persona recorriendo un sendero hacia la luz" />
          <div className="today-hero__shade" />
          <div className="today-hero__content">
            <span className="brand-pill">OncoResponde · Información que acompaña</span>
            <h1 id="today-title">{getGreeting()}</h1>
            <p>Estoy aquí para ayudarte a comprender mejor lo que estás viviendo.</p>
          </div>
        </section>

        <section className="talk-card" aria-labelledby="talk-title">
          <div className="talk-card__copy">
            <span className="talk-card__eyebrow">Tu acceso principal</span>
            <h2 id="talk-title">Háblame <span aria-hidden="true">♥</span></h2>
            <p>Cuéntame qué necesitas o qué te preocupa. Puedes hablar con tranquilidad o escribir.</p>
          </div>
          <div className="talk-card__actions">
            <Link className="button talk-card__primary" to="/hablame">🎤 Hablar</Link>
            <Link className="button talk-card__secondary" to="/oncoayuda">✎ Escribir</Link>
          </div>
        </section>

        <section className="card mood-card" aria-labelledby="mood-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Hoy</span>
              <h2 id="mood-title">¿Cómo te encuentras hoy?</h2>
            </div>
            <p>Elige la opción que más se acerque a este momento.</p>
          </div>

          <div className="mood-grid">
            {moodOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`mood-option${option.id === 'apoyo' ? ' mood-option--support' : ''}${mood === option.id ? ' is-selected' : ''}`}
                onClick={() => { setMood(option.id); saveMoodForToday(option.id); }}
                aria-pressed={mood === option.id}
              >
                <span className="mood-option__icon" aria-hidden="true">{option.icon}</span>
                <strong>{option.label}</strong>
                <small>{option.detail}</small>
              </button>
            ))}
          </div>

          {selected ? (
            <div className="daily-plan" aria-live="polite">
              <div className="daily-plan__header">
                <div>
                  <span className="section-kicker">Tu plan para hoy</span>
                  <h3>Una propuesta sencilla para este momento</h3>
                </div>
                <div className="energy-meter" aria-label={`Nivel orientativo de energía: ${selected.energy} de 5`}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <span key={level} className={level <= selected.energy ? 'is-on' : ''} />
                  ))}
                </div>
              </div>
              <p>{selected.intro}</p>
              <div className="recommendation-list">
                {selected.actions.map((action) => (
                  <Link to={action.to} className="recommendation-item" key={action.label}>
                    <span>
                      <strong>{action.label}</strong>
                      <small>{action.detail}</small>
                    </span>
                    <b aria-hidden="true">→</b>
                  </Link>
                ))}
              </div>
              {mood === 'apoyo' && (
                <div className="support-strip">
                  <strong>¿Necesitas ayuda inmediata?</strong>
                  <a href="tel:900100036">AECC · 900 100 036</a>
                  <a href="tel:717003717">Teléfono de la Esperanza · 717 003 717</a>
                  <a href="tel:112">Emergencias · 112</a>
                  <a href="tel:061">Salud Responde · 061</a>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-plan">
              <span aria-hidden="true">☼</span>
              <p>Cuando elijas cómo te encuentras, aparecerán recomendaciones para hoy.</p>
            </div>
          )}
        </section>

        <section className="access-section" aria-labelledby="access-title">
          <div className="section-heading section-heading--compact">
            <div>
              <span className="section-kicker">Explora a tu ritmo</span>
              <h2 id="access-title">Todo lo que puede ayudarte</h2>
            </div>
            <p>No necesitas descubrirlo todo hoy.</p>
          </div>
          <div className="access-grid">
            {accessCards.map((card) => (
              <Link className={`access-card access-card--${card.tone}`} to={card.to} key={card.to}>
                <span className="access-card__icon" aria-hidden="true">{card.icon}</span>
                <span className="access-card__body">
                  <strong>{card.title}</strong>
                  <small>{card.text}</small>
                </span>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
          </div>
        </section>

        <footer className="today-footer">
          <strong>OncoResponde</strong>
          <p>Orientación, no diagnóstico. La IA puede cometer errores. Contrasta siempre la información con tu equipo sanitario.</p>
          <small>OncoResponde 2.3 · Información orientativa. No sustituye la atención médica ni los servicios de urgencias.</small>
        </footer>
      </main>
      <BottomNav />
    </>
  );
}
