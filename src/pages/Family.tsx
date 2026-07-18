import NavHeader from '../components/NavHeader';
import OncoBox from '../components/OncoBox';

const cards = [
  ['Escuchar sin tener que resolver', 'A veces ayuda más estar disponible, preguntar qué necesita la persona y respetar sus silencios.'],
  ['Acompañar a las consultas', 'Anotar preguntas, escuchar las indicaciones y confirmar después qué ha entendido cada uno.'],
  ['Repartir las tareas', 'Organizar compras, desplazamientos, medicación anotada o llamadas evita que una sola persona cargue con todo.'],
  ['Cuidarse también importa', 'Dormir, comer, mantener pequeños descansos y pedir relevo no es abandonar: permite seguir acompañando.'],
  ['Hablar con niños y adolescentes', 'Usar palabras claras, verdaderas y adaptadas a su edad. Permitir preguntas y repetir la información cuando lo necesiten.'],
  ['Cuándo pedir ayuda', 'Si el agotamiento, la ansiedad o la tristeza interfieren de forma mantenida, conviene contactar con profesionales o asociaciones de apoyo.'],
];

export default function Family() {
  return <main className="family-page">
    <NavHeader title="Familia y cuidadores" />
    <section className="family-hero"><span className="section-kicker">Acompañar sin olvidarse de uno mismo</span><h1>Información práctica para familiares y personas cuidadoras</h1><p>El cáncer afecta a toda la familia. Aquí encontrarás pautas breves para acompañar, comunicarse y reconocer cuándo también necesitas apoyo.</p></section>
    <section className="family-grid">{cards.map(([title, text]) => <article className="card" key={title}><h2>{title}</h2><p>{text}</p></article>)}</section>
    <section className="card family-support"><h2>Apoyo disponible</h2><div><a href="tel:900100036"><strong>AECC</strong><span>900 100 036 · atención continuada</span></a><a href="tel:717003717"><strong>Teléfono de la Esperanza</strong><span>717 003 717</span></a><a href="tel:112"><strong>Emergencias</strong><span>112</span></a><a href="tel:061"><strong>Urgencias sanitarias</strong><span>061</span></a></div></section>
    <OncoBox contextId="familia" context="Apoyo a familiares y cuidadores de una persona con cáncer. Priorizar comunicación clara, reparto de tareas, autocuidado y derivación a ayuda profesional cuando sea necesario." title="Pregunta como familiar o cuidador" />
  </main>;
}
