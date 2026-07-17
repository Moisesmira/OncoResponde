import { Link } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';

const topics = [
  { id: 'alimentacion', icon: '🍎', title: 'Alimentación', text: 'Ideas prácticas para mantener energía, hidratación y tolerancia a las comidas.' },
  { id: 'ejercicio', icon: '🚶', title: 'Ejercicio', text: 'Movimiento adaptado a tu energía, situación y tratamiento.' },
  { id: 'respiracion', icon: '🫁', title: 'Respiración', text: 'Una pausa guiada para bajar el ritmo y recuperar sensación de calma.' },
  { id: 'dormir', icon: '😴', title: 'Dormir mejor', text: 'Hábitos sencillos para favorecer el descanso y afrontar noches difíciles.' },
  { id: 'mindfulness', icon: '🌿', title: 'Mindfulness', text: 'Ejercicios breves para volver al presente sin exigirte dejar la mente en blanco.' },
  { id: 'bienestar-emocional', icon: '❤️', title: 'Bienestar emocional', text: 'Comprender y acompañar miedo, tristeza, enfado o incertidumbre.' },
  { id: 'comunicacion', icon: '👨‍👩‍👧', title: 'Comunicación', text: 'Hablar con tu familia, amistades y equipo sanitario con mayor claridad.' },
];

export default function WellnessHub() {
  return (
    <>
      <main className="wellness-page">
        <NavHeader title="Cuídate" />
        <section className="wellness-intro">
          <span className="section-kicker">Cuidarte también forma parte del proceso</span>
          <h1>Cuídate</h1>
          <p>Bienestar físico y emocional para acompañarte en cada etapa de tu proceso.</p>
          <p className="wellness-intro__soft">No hace falta hacerlo todo hoy. Elige aquello que más pueda ayudarte en este momento.</p>
        </section>

        <section className="wellness-grid" aria-label="Áreas de bienestar">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={topic.id === 'respiracion' ? '/respiracion' : `/cuidate/${topic.id}`}
              className={`wellness-card wellness-card--${topic.id}`}
            >
              <span className="wellness-card__icon" aria-hidden="true">{topic.icon}</span>
              <span className="wellness-card__copy">
                <strong>{topic.title}</strong>
                <small>{topic.text}</small>
              </span>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </section>

        <section className="wellness-note" role="note">
          <strong>Una orientación segura</strong>
          <p>Adapta cualquier recomendación a las indicaciones de tu equipo sanitario, especialmente si tienes síntomas, limitaciones físicas o restricciones alimentarias.</p>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
