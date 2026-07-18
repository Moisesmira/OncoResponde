import { ChangeEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';
import { getCancerProfileContext, getCancerTypeId } from '../utils/cancerProfileContext';

type ReportType = 'anatomia' | 'tac' | 'pet' | 'resonancia' | 'analitica' | 'alta' | 'otro';

const reportTypes: Array<{ id: ReportType; icon: string; label: string; hint: string }> = [
  { id: 'anatomia', icon: '🔬', label: 'Anatomía patológica', hint: 'Biopsia, pieza quirúrgica o estudio molecular.' },
  { id: 'tac', icon: '◉', label: 'TAC', hint: 'Informe de tomografía computarizada.' },
  { id: 'pet', icon: '✦', label: 'PET/CT', hint: 'Informe de Medicina Nuclear.' },
  { id: 'resonancia', icon: '🧲', label: 'Resonancia', hint: 'Informe de resonancia magnética.' },
  { id: 'analitica', icon: '🩸', label: 'Analítica', hint: 'Resultados de sangre u otras muestras.' },
  { id: 'alta', icon: '📄', label: 'Informe de alta', hint: 'Resumen de ingreso, tratamiento o seguimiento.' },
  { id: 'otro', icon: '▤', label: 'Otro informe', hint: 'Cualquier otro documento sanitario.' },
];

const MAX_LENGTH = 7000;

export default function Reports() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<ReportType>('tac');
  const [reportText, setReportText] = useState('');
  const [question, setQuestion] = useState('Explícame este informe en un lenguaje claro y dime qué preguntas podría hacer en la próxima consulta.');
  const [fileMessage, setFileMessage] = useState('');
  const selectedType = useMemo(() => reportTypes.find((item) => item.id === reportType) ?? reportTypes[0], [reportType]);

  const readTextFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/\.(txt|md)$/i.test(file.name)) {
      setFileMessage('En esta versión solo se leen archivos .txt o .md. Para PDF o imagen, copia y pega únicamente el texto relevante.');
      event.target.value = '';
      return;
    }
    if (file.size > 100_000) {
      setFileMessage('El archivo es demasiado grande. Copia solo la parte del informe que quieras comprender.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      setReportText(text.slice(0, MAX_LENGTH));
      setFileMessage(`Texto cargado desde ${file.name}. Revísalo y elimina cualquier dato identificativo antes de continuar.`);
    };
    reader.onerror = () => setFileMessage('No se ha podido leer el archivo. Puedes copiar y pegar el texto manualmente.');
    reader.readAsText(file, 'utf-8');
  };

  const submit = () => {
    const cleanReport = reportText.trim();
    const cleanQuestion = question.trim();
    if (!cleanReport || !cleanQuestion) return;
    const context = [
      `Tipo de informe seleccionado: ${selectedType.label}.`,
      'La persona solicita una explicación educativa de un informe clínico. Distingue siempre entre lo que el texto dice literalmente y cualquier explicación general.',
      'No diagnostiques, no determines pronóstico, no propongas cambios de tratamiento y no presentes una interpretación como definitiva.',
      'Explica primero un resumen sencillo; después aclara los términos relevantes; termina con preguntas útiles para el equipo sanitario.',
      `Texto aportado por la persona (puede contener errores de transcripción):\n${cleanReport}`,
    ].join('\n');

    navigate('/respuesta', {
      state: {
        question: cleanQuestion,
        contextId: 'informes',
        context,
        profileContext: getCancerProfileContext(),
        cancerType: getCancerTypeId(),
      },
    });
  };

  return (
    <>
      <main className="reports-page" id="main-content">
        <NavHeader title="Comprende tus informes" backTo="/" backLabel="Inicio" />

        <section className="reports-hero">
          <span className="section-kicker">Información médica en lenguaje claro</span>
          <h1>Comprende mejor tu informe</h1>
          <p>Pega el texto que quieras aclarar. OncoResponde puede ayudarte a entender términos y preparar preguntas, pero la interpretación definitiva corresponde a tu equipo sanitario.</p>
        </section>

        <aside className="reports-privacy" role="note">
          <strong>Antes de pegar el texto</strong>
          <p>Elimina nombre, apellidos, fecha de nacimiento, número de historia clínica, dirección, teléfono, códigos identificativos y cualquier otro dato personal.</p>
        </aside>

        <section className="card reports-form" aria-labelledby="reports-type-title">
          <div className="section-heading section-heading--compact">
            <div>
              <span className="section-kicker">Paso 1</span>
              <h2 id="reports-type-title">¿Qué tipo de informe es?</h2>
            </div>
          </div>
          <div className="report-type-grid">
            {reportTypes.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`report-type${reportType === item.id ? ' is-selected' : ''}`}
                onClick={() => setReportType(item.id)}
                aria-pressed={reportType === item.id}
              >
                <span aria-hidden="true">{item.icon}</span>
                <strong>{item.label}</strong>
                <small>{item.hint}</small>
              </button>
            ))}
          </div>

          <label className="reports-label" htmlFor="report-text">
            <span><b>Paso 2.</b> Pega el texto del informe</span>
            <textarea
              id="report-text"
              value={reportText}
              onChange={(event) => setReportText(event.target.value.slice(0, MAX_LENGTH))}
              placeholder="Pega aquí únicamente el fragmento que quieras comprender…"
              maxLength={MAX_LENGTH}
            />
          </label>
          <div className="reports-meta">
            <span>{reportText.length}/{MAX_LENGTH} caracteres</span>
            {reportText && <button type="button" className="oncobox-clear" onClick={() => setReportText('')}>Borrar informe</button>}
          </div>

          <div className="reports-file-row">
            <label className="secondary reports-file-button">
              Cargar texto (.txt o .md)
              <input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={readTextFile} />
            </label>
            <small>Los PDF y las fotografías no se leen automáticamente en esta versión.</small>
          </div>
          {fileMessage && <p className="reports-file-message" role="status">{fileMessage}</p>}

          <label className="reports-label" htmlFor="report-question">
            <span><b>Paso 3.</b> ¿Qué quieres saber?</span>
            <textarea
              id="report-question"
              className="reports-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value.slice(0, 600))}
              maxLength={600}
            />
          </label>

          <button type="button" className="reports-submit" disabled={!reportText.trim() || !question.trim()} onClick={submit}>
            Explicar este informe
          </button>
        </section>

        <section className="reports-guardrails" aria-labelledby="reports-limits-title">
          <h2 id="reports-limits-title">Qué hará y qué no hará OncoResponde</h2>
          <div className="reports-guardrail-grid">
            <article><strong>Puede ayudarte a</strong><p>Resumir el texto, explicar palabras médicas y proponer preguntas para la consulta.</p></article>
            <article><strong>No puede sustituir</strong><p>La valoración del especialista, el diagnóstico, el pronóstico ni las decisiones de tratamiento.</p></article>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
