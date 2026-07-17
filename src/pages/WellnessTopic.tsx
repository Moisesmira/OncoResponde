import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';

type Topic = {
  title: string;
  icon: string;
  message: string;
  explanation: string;
  tips: string[];
  questions: string[];
};

const topics: Record<string, Topic> = {
  alimentacion: {
    title: 'Alimentación', icon: '🍎',
    message: 'Comer bien no significa hacerlo perfecto: significa encontrar lo que hoy puedes tolerar y te ayuda a mantenerte.',
    explanation: 'Durante el cáncer y sus tratamientos pueden cambiar el apetito, el gusto, la digestión o las necesidades nutricionales. No existe una dieta única para todas las personas; conviene priorizar una alimentación variada, suficiente y adaptada a los síntomas.',
    tips: ['Haz comidas pequeñas si te cuesta terminar un plato.', 'Mantén líquidos a mano y bebe en pequeñas cantidades.', 'Consulta antes de tomar suplementos o productos “anticáncer”.'],
    questions: ['¿Qué puedo comer si tengo poco apetito?', '¿Cómo puedo aumentar las proteínas?', '¿Qué alimentos debo evitar durante el tratamiento?'],
  },
  ejercicio: {
    title: 'Ejercicio', icon: '🚶',
    message: 'Moverte un poco también cuenta. El objetivo es acompañar a tu cuerpo, no ponerlo a prueba.',
    explanation: 'La actividad física adaptada puede ayudar a conservar fuerza, funcionalidad y bienestar. La cantidad adecuada depende del tratamiento, los síntomas, la condición previa y las recomendaciones médicas.',
    tips: ['Empieza con periodos cortos y aumenta solo si te sienta bien.', 'Combina caminar con ejercicios suaves de fuerza cuando sea posible.', 'Detente y consulta ante dolor torácico, mareo intenso o dificultad respiratoria nueva.'],
    questions: ['¿Qué ejercicio puedo hacer durante la quimioterapia?', '¿Cómo empiezo si estoy muy cansado?', '¿Es seguro hacer ejercicios de fuerza?'],
  },
  dormir: {
    title: 'Dormir mejor', icon: '😴',
    message: 'Una mala noche no significa que la siguiente vaya a ser igual. Podemos preparar el descanso sin forzarlo.',
    explanation: 'El sueño puede alterarse por la preocupación, el dolor, algunos tratamientos o los cambios de rutina. Las medidas sencillas y constantes suelen ayudar más que intentar “obligarse” a dormir.',
    tips: ['Mantén horarios parecidos para levantarte.', 'Reserva la cama para dormir y descansar.', 'Anota las preocupaciones antes de acostarte para sacarlas de la cabeza.'],
    questions: ['¿Qué puedo hacer si me despierto de madrugada?', '¿Cómo dormir mejor con ansiedad?', '¿Las siestas empeoran el sueño nocturno?'],
  },
  mindfulness: {
    title: 'Mindfulness', icon: '🌿',
    message: 'No necesitas dejar la mente en blanco. Solo volver, una vez más, al momento presente.',
    explanation: 'Mindfulness consiste en prestar atención a la experiencia presente con curiosidad y sin juzgarla. Puede practicarse durante pocos minutos y no sustituye el apoyo psicológico cuando este es necesario.',
    tips: ['Empieza con uno o dos minutos.', 'Usa la respiración o los sonidos como punto de apoyo.', 'Cuando te distraigas, vuelve con amabilidad.'],
    questions: ['¿Cómo puedo empezar a practicar mindfulness?', '¿Qué hago si aparecen pensamientos negativos?', '¿Puede ayudarme antes de una prueba médica?'],
  },
  'bienestar-emocional': {
    title: 'Bienestar emocional', icon: '❤️',
    message: 'Lo que sientes tiene sentido. No tienes que estar fuerte todo el tiempo.',
    explanation: 'Miedo, tristeza, enfado, culpa o incertidumbre son respuestas frecuentes. Compartirlas, ponerles nombre y pedir ayuda cuando desbordan puede reducir su peso.',
    tips: ['Identifica qué emoción aparece y qué necesitas en ese momento.', 'Habla con alguien de confianza sin sentir que debes protegerle de todo.', 'Solicita apoyo profesional si el malestar es intenso o persistente.'],
    questions: ['¿Cómo manejar el miedo a que el cáncer vuelva?', '¿Cuándo debería pedir ayuda psicológica?', '¿Cómo afrontar la espera de resultados?'],
  },
  comunicacion: {
    title: 'Comunicación', icon: '👨‍👩‍👧',
    message: 'Hablar no siempre resuelve el problema, pero puede hacer que no tengas que llevarlo en soledad.',
    explanation: 'Cada persona decide cuánto quiere contar y a quién. Preparar las conversaciones y expresar necesidades concretas puede facilitar el apoyo de la familia y la comunicación con el equipo sanitario.',
    tips: ['Elige un momento tranquilo y explica primero qué necesitas.', 'Puedes decir “ahora prefiero que me escuches” o “necesito ayuda práctica”.', 'Lleva tus preguntas escritas a las consultas.'],
    questions: ['¿Cómo explicar el cáncer a mis hijos?', '¿Cómo pedir apoyo sin sentirme una carga?', '¿Qué preguntas debería hacer a mi oncólogo?'],
  },
};

export default function WellnessTopic() {
  const { topicId = '' } = useParams();
  const navigate = useNavigate();
  const topic = topics[topicId];
  if (!topic) return <Navigate to="/cuidate" replace />;

  const ask = (question: string) => navigate('/hablame', { state: { prefill: question } });

  return (
    <>
      <main className="topic-page">
        <NavHeader title={topic.title} />
        <section className="topic-hero">
          <span className="topic-hero__icon" aria-hidden="true">{topic.icon}</span>
          <span className="section-kicker">Más allá del tratamiento</span>
          <h1>{topic.title}</h1>
          <p className="topic-hero__message">{topic.message}</p>
        </section>

        <section className="topic-section">
          <h2>Lo esencial</h2>
          <p>{topic.explanation}</p>
          <ul className="topic-tips">
            {topic.tips.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
        </section>

        <section className="topic-section topic-questions">
          <span className="section-kicker">Preguntas rápidas</span>
          <h2>¿Qué te gustaría saber?</h2>
          <p>Pulsa una pregunta para llevarla a OncoResponde. Podrás revisarla antes de enviarla.</p>
          <div className="quick-question-list">
            {topic.questions.map((question) => (
              <button type="button" key={question} onClick={() => ask(question)}>
                <span>{question}</span><b aria-hidden="true">→</b>
              </button>
            ))}
          </div>
        </section>

        <section className="topic-privacy" role="note">
          <strong>Protege tu privacidad</strong>
          <p>No incluyas nombres, direcciones, números de historia clínica ni otros datos identificativos. Las respuestas son orientativas y pueden contener errores.</p>
        </section>

        <Link className="back-to-wellness" to="/cuidate">← Volver a Más allá del tratamiento</Link>
      </main>
      <BottomNav />
    </>
  );
}
