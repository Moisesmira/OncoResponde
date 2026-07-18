import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';
import OncoBox from '../components/OncoBox';

export type PrepareItem = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  before: string[];
  during: string[];
  bring: string[];
  ask: string[];
  safety?: string;
  sourceName: string;
  sourceUrl: string;
};

export const prepareItems: PrepareItem[] = [
  {
    id: 'consulta',
    icon: '🗣️',
    title: 'Consulta médica',
    subtitle: 'Organiza tus dudas y aprovecha mejor el encuentro con tu equipo.',
    before: [
      'Anota los síntomas, cambios y preocupaciones que quieras comentar.',
      'Ordena tus preguntas: primero las que más te importan.',
      'Piensa si quieres acudir con una persona de confianza.',
    ],
    during: [
      'Pide que te expliquen de nuevo aquello que no entiendas.',
      'Toma notas o pregunta si puedes grabar las indicaciones.',
      'Confirma cuál es el siguiente paso y cómo contactar si aparece un problema.',
    ],
    bring: ['Lista de medicación y alergias.', 'Informes o pruebas solicitadas.', 'Tus preguntas por escrito.'],
    ask: ['¿Cuál es el objetivo del tratamiento?', '¿Qué efectos debo vigilar?', '¿Con quién contacto si tengo dudas?'],
    sourceName: 'National Cancer Institute · Questions to Ask Your Doctor',
    sourceUrl: 'https://www.cancer.gov/about-cancer/coping/questions',
  },
  {
    id: 'analitica',
    icon: '🩸',
    title: 'Analítica',
    subtitle: 'Una extracción breve que puede ayudar a valorar tu estado y el tratamiento.',
    before: [
      'Comprueba si te han indicado acudir en ayunas; no todas las analíticas lo requieren.',
      'Bebe agua salvo que tu centro te haya dado otra indicación.',
      'No suspendas medicación por tu cuenta.',
    ],
    during: [
      'Comenta si sueles marearte o tienes dificultad para las extracciones.',
      'Mantén el brazo relajado y avisa si notas malestar.',
    ],
    bring: ['Petición o volante, si te lo han dado.', 'Tarjeta sanitaria o identificación.', 'Lista de medicación si te la solicitan.'],
    ask: ['¿Necesito estar en ayunas?', '¿Cuándo estarán los resultados?', '¿Debo cambiar alguna medicación?'],
    safety: 'Las instrucciones concretas de tu hospital tienen prioridad, especialmente si tienes diabetes o tomas anticoagulantes.',
    sourceName: 'MedlinePlus · Blood Tests',
    sourceUrl: 'https://medlineplus.gov/lab-tests/blood-testing/',
  },
  {
    id: 'tac',
    icon: '◉',
    title: 'TAC',
    subtitle: 'Una prueba rápida que obtiene imágenes mediante rayos X.',
    before: [
      'Sigue las indicaciones sobre ayuno y contraste; dependen del tipo de TAC.',
      'Informa sobre alergias previas al contraste, embarazo posible o enfermedad renal.',
      'Lleva ropa cómoda y evita objetos metálicos cuando te lo indiquen.',
    ],
    during: [
      'Permanecerás tumbado mientras la camilla atraviesa un aro amplio.',
      'Puede que te pidan contener la respiración durante unos segundos.',
      'Con contraste intravenoso puedes notar calor pasajero o sabor metálico.',
    ],
    bring: ['Informes previos si te los han pedido.', 'Lista de alergias y medicación.', 'Analítica renal si el centro la solicita.'],
    ask: ['¿Se utilizará contraste?', '¿Necesito ayuno?', '¿Cuánto durará y cuándo tendré el resultado?'],
    sourceName: 'RadiologyInfo · Body CT',
    sourceUrl: 'https://www.radiologyinfo.org/en/info/bodyct',
  },
  {
    id: 'resonancia',
    icon: '🧲',
    title: 'Resonancia magnética',
    subtitle: 'Obtiene imágenes detalladas sin utilizar radiación ionizante.',
    before: [
      'Comunica marcapasos, implantes, prótesis, clips, fragmentos metálicos o embarazo posible.',
      'Retira joyas, reloj, audífonos y otros objetos metálicos.',
      'Pregunta si necesitas ayuno o contraste; cambia según la exploración.',
    ],
    during: [
      'La prueba produce ruidos fuertes; normalmente te ofrecerán protección auditiva.',
      'Debes permanecer quieto dentro del equipo durante varios minutos.',
      'Podrás comunicarte con el personal durante toda la exploración.',
    ],
    bring: ['Información sobre implantes o dispositivos.', 'Informes previos solicitados.', 'Ropa cómoda sin metal, si el centro lo permite.'],
    ask: ['¿Mi implante es compatible?', '¿Se utilizará contraste?', '¿Qué opciones hay si tengo claustrofobia?'],
    safety: 'No entres en la sala con objetos metálicos sin autorización del personal.',
    sourceName: 'NHS · MRI scan',
    sourceUrl: 'https://www.nhs.uk/tests-and-treatments/mri-scan/',
  },
  {
    id: 'pet',
    icon: '✦',
    title: 'PET/CT',
    subtitle: 'Combina información metabólica e imágenes anatómicas.',
    before: [
      'Sigue exactamente las instrucciones del centro sobre ayuno; en PET con FDG suele pedirse varias horas sin comer.',
      'Evita ejercicio intenso el día previo cuando te lo indiquen.',
      'Informa si tienes diabetes, embarazo posible o estás en lactancia.',
    ],
    during: [
      'Tras administrar el trazador descansarás en una sala tranquila antes de las imágenes.',
      'Es importante permanecer relajado y hablar lo mínimo durante ese periodo.',
      'La adquisición de imágenes suele ser indolora y requiere estar quieto.',
    ],
    bring: ['Ropa cómoda sin metal.', 'Medicación habitual e instrucciones para diabetes.', 'Informes previos si te los solicitan.'],
    ask: ['¿Cuántas horas debo estar en ayunas?', '¿Cómo adapto la medicación para la diabetes?', '¿Qué precauciones debo seguir después?'],
    safety: 'La preparación varía según el trazador y el tipo de PET. Sigue siempre las instrucciones específicas de Medicina Nuclear.',
    sourceName: 'NHS · PET scan',
    sourceUrl: 'https://www.nhs.uk/tests-and-treatments/pet-scan/',
  },
  {
    id: 'quimioterapia',
    icon: '💧',
    title: 'Quimioterapia',
    subtitle: 'Prepárate para la primera sesión y conoce qué información conviene llevar.',
    before: [
      'Confirma la hora, duración aproximada y si puedes comer con normalidad.',
      'Lleva una lista actualizada de medicamentos, suplementos y alergias.',
      'Organiza el transporte si te han recomendado no conducir después.',
    ],
    during: [
      'El equipo comprobará tu identidad, tratamiento y analítica antes de administrarlo.',
      'Avisa de inmediato si notas dolor, picor, dificultad respiratoria, mareo o cualquier cambio brusco.',
      'Pregunta cómo manejar en casa los efectos esperables y qué signos requieren contacto urgente.',
    ],
    bring: ['Agua y algo ligero si el centro lo permite.', 'Ropa cómoda y una prenda de abrigo.', 'Entretenimiento y teléfono de contacto del equipo.'],
    ask: ['¿Qué efectos son más probables con mi pauta?', '¿Qué medicación debo tomar en casa?', '¿A qué temperatura debo llamar?'],
    safety: 'Si tienes una temperatura de 38 °C o superior durante algunos tratamientos, puede tratarse de una urgencia médica. Sigue las indicaciones de tu equipo sanitario. Si te han facilitado un teléfono de contacto, llama lo antes posible. Si no puedes contactar o te encuentras mal, acude al Servicio de Urgencias de tu hospital.',
    sourceName: 'National Cancer Institute · Chemotherapy and You',
    sourceUrl: 'https://www.cancer.gov/publications/patient-education/chemo-and-you',
  },
  {
    id: 'radioterapia',
    icon: '☀',
    title: 'Radioterapia',
    subtitle: 'Conoce la planificación, las sesiones y los cuidados básicos.',
    before: [
      'En la primera fase pueden realizarte un TAC de planificación y marcas de posicionamiento.',
      'Sigue las indicaciones específicas sobre vejiga, recto, alimentación o cuidado de la piel.',
      'No apliques cremas en la zona antes de la sesión salvo indicación del equipo.',
    ],
    during: [
      'La sesión es indolora y permanecerás solo en la sala, pero vigilado y comunicado con el personal.',
      'Debes mantener la posición; la máquina puede moverse alrededor sin tocarte.',
      'La radioterapia externa no te vuelve radiactivo.',
    ],
    bring: ['Ropa cómoda que facilite acceder a la zona tratada.', 'Calendario de citas.', 'Tus dudas y los productos de piel que estés usando.'],
    ask: ['¿Cómo debo cuidar la piel?', '¿Qué síntomas son esperables según la zona?', '¿Qué hago si no puedo acudir a una sesión?'],
    sourceName: 'National Cancer Institute · External Beam Radiation Therapy',
    sourceUrl: 'https://www.cancer.gov/about-cancer/treatment/types/radiation-therapy/external-beam',
  },
  {
    id: 'cirugia',
    icon: '✚',
    title: 'Cirugía',
    subtitle: 'Una guía para organizar la preparación y el regreso a casa.',
    before: [
      'Confirma ayuno, medicación y hora de llegada.',
      'Informa sobre anticoagulantes, alergias, prótesis y antecedentes anestésicos.',
      'Organiza quién te acompañará y la ayuda que puedas necesitar al volver a casa.',
    ],
    during: [
      'Antes de la intervención revisarás el procedimiento y el consentimiento con el equipo.',
      'Pregunta cómo se controlará el dolor y qué dispositivos podrías llevar al despertar.',
    ],
    bring: ['Documentación e informes solicitados.', 'Lista de medicación y alergias.', 'Ropa amplia para el alta y objetos personales imprescindibles.'],
    ask: ['¿Qué debo suspender y cuándo?', '¿Cuánto tiempo estaré ingresado?', '¿Qué signos deben hacerme consultar tras el alta?'],
    safety: 'No modifiques anticoagulantes, antidiabéticos u otra medicación sin instrucciones expresas del equipo quirúrgico.',
    sourceName: 'National Cancer Institute · Surgery to Treat Cancer',
    sourceUrl: 'https://www.cancer.gov/about-cancer/treatment/types/surgery',
  },
];

export default function Prepare() {
  const [searchParams] = useSearchParams();
  const requestedGuide = searchParams.get('guia');
  const initialGuide = prepareItems.some((item) => item.id === requestedGuide) ? requestedGuide! : prepareItems[0].id;
  const [selectedId, setSelectedId] = useState(initialGuide);

  useEffect(() => {
    if (requestedGuide && prepareItems.some((item) => item.id === requestedGuide)) {
      setSelectedId(requestedGuide);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [requestedGuide]);
  const selected = useMemo(
    () => prepareItems.find((item) => item.id === selectedId) ?? prepareItems[0],
    [selectedId],
  );

  const context = `La persona está consultando el módulo Prepárate, concretamente: ${selected.title}. Debes explicar de forma práctica qué puede esperar, cómo prepararse y qué preguntas hacer. Recalca que las instrucciones de su hospital tienen prioridad y no inventes protocolos concretos.`;

  return (
    <>
      <main className="prepare-page" id="main-content">
        <NavHeader title="Guía para prepararte" backTo="/tratamiento" backLabel="Mi tratamiento" />

        <section className="prepare-hero">
          <span className="section-kicker">Antes de una prueba o tratamiento</span>
          <h1>Prepárate con más tranquilidad</h1>
          <p>Esta guía forma parte de Mi tratamiento. Te ayuda a saber qué puede ocurrir, qué llevar y qué preguntas hacer. Las indicaciones de tu centro siempre tienen prioridad.</p>
        </section>

        <section className="prepare-selector" aria-label="Elige una prueba o tratamiento">
          {prepareItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`prepare-chip${selectedId === item.id ? ' is-selected' : ''}`}
              onClick={() => setSelectedId(item.id)}
              aria-pressed={selectedId === item.id}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.title}
            </button>
          ))}
        </section>

        <article className="prepare-detail" aria-live="polite">
          <header className="prepare-detail__header">
            <span className="prepare-detail__icon" aria-hidden="true">{selected.icon}</span>
            <div>
              <span className="section-kicker">Guía práctica</span>
              <h2>{selected.title}</h2>
              <p>{selected.subtitle}</p>
            </div>
          </header>

          <div className="prepare-columns">
            <section className="prepare-panel">
              <h3>Antes</h3>
              <ul>{selected.before.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section className="prepare-panel">
              <h3>Durante</h3>
              <ul>{selected.during.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section className="prepare-panel">
              <h3>Qué llevar</h3>
              <ul>{selected.bring.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section className="prepare-panel prepare-panel--questions">
              <h3>Preguntas útiles</h3>
              <ul>{selected.ask.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>

          {selected.safety && (
            <aside className="prepare-safety" role="note">
              <strong>Importante</strong>
              <p>{selected.safety}</p>
            </aside>
          )}

          <a className="prepare-source" href={selected.sourceUrl} target="_blank" rel="noreferrer">
            <span>Fuente de referencia</span>
            <strong>{selected.sourceName}</strong>
            <b aria-hidden="true">↗</b>
          </a>
        </article>

        <OncoBox
          contextId={`preparate-${selected.id}`}
          context={context}
          title={`Pregunta sobre ${selected.title}`}
          initialQuestion={`¿Cómo puedo prepararme para ${selected.title.toLowerCase()}?`}
          buttonLabel="Pedir orientación"
        />

        <section className="prepare-note" role="note">
          <strong>Información orientativa</strong>
          <p>La preparación puede cambiar según el hospital, la prueba, el tratamiento y tu situación. Ante instrucciones diferentes, sigue siempre las de tu equipo sanitario.</p>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
