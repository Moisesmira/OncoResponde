import NavHeader from '../components/NavHeader';

const sources = [
  { name: 'Sociedad Española de Oncología Médica (SEOM)', url: 'https://seom.org/', detail: 'Información en español sobre cáncer, tratamientos, prevención y cuidados.' },
  { name: 'Asociación Española Contra el Cáncer (AECC)', url: 'https://www.contraelcancer.es/', detail: 'Información, acompañamiento, atención psicológica y apoyo social.' },
  { name: 'National Cancer Institute (NCI)', url: 'https://www.cancer.gov/espanol', detail: 'Información extensa y revisada sobre tipos de cáncer, tratamientos y efectos secundarios.' },
  { name: 'MedlinePlus en español', url: 'https://medlineplus.gov/spanish/cancer.html', detail: 'Información sanitaria accesible de la Biblioteca Nacional de Medicina de Estados Unidos.' },
  { name: 'NCCN Guidelines for Patients', url: 'https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients', detail: 'Guías para pacientes basadas en recomendaciones clínicas; parte del contenido está en inglés.' },
  { name: 'Organización Mundial de la Salud', url: 'https://www.who.int/es/health-topics/cancer', detail: 'Datos generales, prevención y políticas internacionales sobre cáncer.' },
];

export default function Sources() {
  return <main className="sources-page">
    <NavHeader title="Fuentes fiables" />
    <section className="sources-hero"><span className="section-kicker">Información contrastada</span><h1>Dónde ampliar la información</h1><p>Estas organizaciones publican información sanitaria revisada. Una fuente fiable ayuda a comprender, pero no sustituye las indicaciones de tu equipo.</p></section>
    <section className="sources-grid">{sources.map((source) => <a className="card source-card" href={source.url} target="_blank" rel="noreferrer" key={source.name}><span aria-hidden="true">↗</span><div><h2>{source.name}</h2><p>{source.detail}</p></div></a>)}</section>
    <section className="card source-check"><h2>Antes de confiar en una página</h2><ul><li>Comprueba quién publica la información y cuándo se actualizó.</li><li>Desconfía de curas garantizadas, testimonios como única prueba o productos que prometen sustituir el tratamiento.</li><li>Comenta con tu equipo sanitario cualquier información que pueda influir en tus decisiones.</li></ul></section>
  </main>;
}
