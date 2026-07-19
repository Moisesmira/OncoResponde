import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useAppStore } from '../store/useAppStore';
import { saveMoodForToday } from '../utils/moodTracking';
import { getHomeInsights } from '../utils/personalAssistantContext';

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
  { to: '/perfil', title: 'Cuéntame sobre tu cáncer', text: 'Información opcional para adaptar mejor la ayuda.', icon: '○', tone: 'blue', size: 'primary' },
  { to: '/tratamiento', title: 'Mi tratamiento', text: 'Organiza citas, sesiones y próximas pruebas.', icon: '▣', tone: 'blue', size: 'primary' },
  { to: '/medicacion', title: 'Mi medicación', text: 'Guarda tu pauta anotada y consulta qué te toca hoy.', icon: '💊', tone: 'blue', size: 'secondary' },
  { to: '/informes', title: 'Comprende tus informes', text: 'Aclara términos y prepara preguntas para tu consulta.', icon: '▤', tone: 'purple', size: 'secondary' },
  { to: '/seguimiento', title: 'Mi seguimiento', text: 'Registra en 20 segundos cómo te encuentras hoy.', icon: '◷', tone: 'teal', size: 'secondary' },
  { to: '/consulta', title: 'Prepara tu consulta', text: 'Reúne síntomas, medicación y preguntas para tu próxima visita.', icon: '✎', tone: 'blue', size: 'secondary' },
  { to: '/cuidate', title: 'Cuídate', text: 'Alimentación, movimiento, descanso y bienestar.', icon: '♧', tone: 'green', size: 'secondary' },
  { to: '/calma', title: 'Encuentra calma', text: 'Respiración, música, audios y reflexiones.', icon: '≈', tone: 'teal', size: 'secondary' },
  { to: '/oncoayuda', title: 'OncoAyuda', text: 'Recursos para comprender, prepararte y resolver dudas frecuentes.', icon: 'handshake', tone: 'blue', size: 'support' },
  { to: '/camino', title: 'Mi camino', text: 'Tu diario personal durante el proceso.', icon: '▤', tone: 'purple', size: 'support' },
  { to: '/familia', title: 'Familia y cuidadores', text: 'Acompañar y cuidarse también importa.', icon: '◎', tone: 'rose', size: 'support' },
  { to: '/fuentes', title: 'Fuentes fiables', text: 'Información sanitaria de referencia.', icon: '◇', tone: 'slate', size: 'support' },
  { to: '/valora', title: 'Ayúdanos a mejorar', text: 'Comparte tu experiencia en un cuestionario anónimo de 2–3 minutos.', icon: '✦', tone: 'green', size: 'support' },
  { to: '/ajustes', title: 'Ajustes y privacidad', text: 'Accesibilidad, datos locales y transparencia.', icon: '⚙', tone: 'slate', size: 'support' },
];

function HandshakeIcon() {
  return (
    <svg className="handshake-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8.7 6.2 6.9 4.4a1.6 1.6 0 0 0-2.3 0L2.8 6.2a1.6 1.6 0 0 0 0 2.3l3.6 3.6" />
      <path d="m15.3 6.2 1.8-1.8a1.6 1.6 0 0 1 2.3 0l1.8 1.8a1.6 1.6 0 0 1 0 2.3l-3.6 3.6" />
      <path d="m7.2 10.8 4.1-4.1a2 2 0 0 1 2.8 0l1.2 1.2a1.7 1.7 0 0 1 0 2.4l-1.1 1.1" />
      <path d="m9.1 9 6.5 6.5a1.45 1.45 0 0 1-2.05 2.05l-.75-.75" />
      <path d="m7.8 10.3 5 5a1.45 1.45 0 0 1-2.05 2.05l-4.3-4.3" />
      <path d="m6.5 12 3.1 3.1a1.45 1.45 0 0 1-2.05 2.05L5.8 15.4" />
    </svg>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function Today() {
  const { mood, setMood } = useAppStore();
  const selected = mood ? recommendations[mood] : null;
  const homeInsights = getHomeInsights();

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

        <section className="smart-summary" aria-labelledby="smart-summary-title">
          <div className="section-heading section-heading--compact">
            <div>
              <span className="section-kicker">Tu día, de un vistazo</span>
              <h2 id="smart-summary-title">Lo más relevante ahora</h2>
            </div>
            <p>La información procede de lo que has guardado en este dispositivo.</p>
          </div>
          <div className="smart-summary__grid">
            {homeInsights.map((item) => (
              <Link to={item.to} className="smart-insight" key={item.id}>
                <span className="smart-insight__icon" aria-hidden="true">{item.icon}</span>
                <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
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
              <Link className={`access-card access-card--${card.tone} access-card--${card.size}`} to={card.to} key={card.to}>
                <span className="access-card__icon" aria-hidden="true">{card.icon === 'handshake' ? <HandshakeIcon /> : card.icon}</span>
                <span className="access-card__body">
                  <strong>{card.title}</strong>
                  <small>{card.text}</small>
                </span>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
          </div>
        </section>

      </main>
      <BottomNav />
    </>
  );
}
