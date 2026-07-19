import NavHeader from '../components/NavHeader';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfvn4RQnkBZ-vWpAq2DuPlKMj02bgIK545Z56xZGEHFu3huRw/viewform?usp=header';

export default function Feedback() {
  return (
    <main className="feedback-page">
      <NavHeader title="Valora tu experiencia" />

      <section className="feedback-hero" aria-labelledby="feedback-title">
        <div className="feedback-hero__icon" aria-hidden="true">📝</div>
        <span className="section-kicker">PREM-OncoResponde</span>
        <h1 id="feedback-title">Ayúdanos a mejorar</h1>
        <p>
          Tu experiencia nos ayuda a mejorar OncoResponde para otros pacientes y familiares.
          El cuestionario es anónimo y se completa en aproximadamente 2–3 minutos.
        </p>
      </section>

      <section className="card feedback-card">
        <div className="feedback-card__item">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>Cuestionario anónimo</strong>
            <p>No te pediremos nombre, correo electrónico ni datos que permitan identificarte.</p>
          </div>
        </div>
        <div className="feedback-card__item">
          <span aria-hidden="true">◷</span>
          <div>
            <strong>Solo necesitas unos minutos</strong>
            <p>Responde según tu experiencia real utilizando la aplicación.</p>
          </div>
        </div>
        <div className="feedback-card__item">
          <span aria-hidden="true">♡</span>
          <div>
            <strong>Tu opinión tiene valor</strong>
            <p>Las respuestas se utilizarán para evaluar y mejorar la utilidad, claridad y facilidad de uso de OncoResponde.</p>
          </div>
        </div>

        <a
          className="button feedback-button"
          href={FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Responder cuestionario <span aria-hidden="true">↗</span>
        </a>
        <p className="feedback-external-note">El formulario se abrirá en una nueva pestaña. OncoResponde permanecerá abierto.</p>
      </section>
    </main>
  );
}
