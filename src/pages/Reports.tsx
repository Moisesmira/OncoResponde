import { ChangeEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';
import { getCancerProfileContext, getCancerTypeId } from '../utils/cancerProfileContext';

type ReportType = 'anatomia' | 'tac' | 'pet' | 'resonancia' | 'analitica' | 'alta' | 'otro';
type ReportAttachment = { name: string; mimeType: string; dataUrl: string; size: number };

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
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export default function Reports() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<ReportType>('tac');
  const [reportText, setReportText] = useState('');
  const [attachment, setAttachment] = useState<ReportAttachment | null>(null);
  const [question, setQuestion] = useState('Explícame este informe en un lenguaje claro y dime qué preguntas podría hacer en la próxima consulta.');
  const [fileMessage, setFileMessage] = useState('');
  const selectedType = useMemo(() => reportTypes.find((item) => item.id === reportType) ?? reportTypes[0], [reportType]);

  const readFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setAttachment(null);
      setFileMessage('Formato no compatible. Utiliza PDF, JPG, PNG o WEBP.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setAttachment(null);
      setFileMessage('El archivo supera los 4 MB. Reduce su tamaño o selecciona solo las páginas necesarias.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setFileMessage('No se ha podido leer el archivo. Inténtalo de nuevo.');
        return;
      }
      setAttachment({ name: file.name, mimeType: file.type, dataUrl: reader.result, size: file.size });
      setFileMessage(`${file.name} preparado para analizar. Comprueba que no contiene datos identificativos.`);
    };
    reader.onerror = () => setFileMessage('No se ha podido leer el archivo. Inténtalo de nuevo.');
    reader.readAsDataURL(file);
  };

  const clearAttachment = () => {
    setAttachment(null);
    setFileMessage('');
  };

  const submit = () => {
    const cleanReport = reportText.trim();
    const cleanQuestion = question.trim();
    if ((!cleanReport && !attachment) || !cleanQuestion) return;

    const context = [
      `Tipo de informe seleccionado: ${selectedType.label}.`,
      'La persona solicita una explicación educativa de un informe clínico. Distingue siempre entre lo que el documento dice literalmente y cualquier explicación general.',
      'No diagnostiques, no determines pronóstico, no propongas cambios de tratamiento y no presentes una interpretación como definitiva.',
      'Explica primero un resumen sencillo; después aclara los términos relevantes; termina con preguntas útiles para el equipo sanitario.',
      cleanReport ? `Texto aportado por la persona (puede contener errores de transcripción):\n${cleanReport}` : 'El informe se ha aportado como archivo adjunto, sin texto copiado manualmente.',
    ].join('\n');

    navigate('/respuesta', {
      state: {
        question: cleanQuestion,
        contextId: 'informes',
        context,
        profileContext: getCancerProfileContext(),
        cancerType: getCancerTypeId(),
        attachment,
      },
    });
  };

  const canSubmit = Boolean((reportText.trim() || attachment) && question.trim());

  return (
    <>
      <main className="reports-page" id="main-content">
        <NavHeader title="Comprende tus informes" backTo="/" backLabel="Inicio" />

        <section className="reports-hero">
          <span className="section-kicker">Información médica en lenguaje claro</span>
          <h1>Comprende mejor tu informe</h1>
          <p>Sube un PDF o una fotografía, o pega el texto que quieras aclarar. OncoResponde puede ayudarte a entender términos y preparar preguntas, pero la interpretación definitiva corresponde a tu equipo sanitario.</p>
        </section>

        <aside className="reports-privacy" role="note">
          <strong>Protege tu privacidad</strong>
          <p>Antes de continuar, tapa o elimina nombre, apellidos, fecha de nacimiento, número de historia clínica, dirección, teléfono, códigos identificativos y cualquier otro dato personal. El archivo se envía únicamente para generar esta respuesta y no se incorpora al historial de la aplicación.</p>
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

          <div className="reports-upload-block">
            <span className="reports-step"><b>Paso 2.</b> Sube el informe o pega su texto</span>
            <label className="reports-file-drop">
              <span className="reports-file-icon" aria-hidden="true">📎</span>
              <strong>{attachment ? 'Cambiar archivo' : 'Subir imagen o PDF'}</strong>
              <small>PDF, JPG, PNG o WEBP · máximo 4 MB</small>
              <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={readFile} />
            </label>

            {attachment && (
              <div className="reports-file-preview" role="status">
                <div>
                  <strong>{attachment.mimeType === 'application/pdf' ? '📄' : '🖼️'} {attachment.name}</strong>
                  <small>{(attachment.size / 1024 / 1024).toFixed(2)} MB</small>
                </div>
                <button type="button" className="oncobox-clear" onClick={clearAttachment}>Quitar</button>
              </div>
            )}
            {fileMessage && <p className="reports-file-message" role="status">{fileMessage}</p>}
          </div>

          <div className="reports-divider"><span>o bien</span></div>

          <label className="reports-label" htmlFor="report-text">
            <span>Pega aquí el texto del informe</span>
            <textarea
              id="report-text"
              value={reportText}
              onChange={(event) => setReportText(event.target.value.slice(0, MAX_LENGTH))}
              placeholder="Pega únicamente el fragmento que quieras comprender…"
              maxLength={MAX_LENGTH}
            />
          </label>
          <div className="reports-meta">
            <span>{reportText.length}/{MAX_LENGTH} caracteres</span>
            {reportText && <button type="button" className="oncobox-clear" onClick={() => setReportText('')}>Borrar texto</button>}
          </div>

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

          <button type="button" className="reports-submit" disabled={!canSubmit} onClick={submit}>
            Analizar y explicar el informe
          </button>
        </section>

        <section className="reports-guardrails" aria-labelledby="reports-limits-title">
          <h2 id="reports-limits-title">Qué hará y qué no hará OncoResponde</h2>
          <div className="reports-guardrail-grid">
            <article><strong>Puede ayudarte a</strong><p>Resumir el documento, explicar palabras médicas y proponer preguntas para la consulta.</p></article>
            <article><strong>No puede sustituir</strong><p>La valoración del especialista, el diagnóstico, el pronóstico ni las decisiones de tratamiento.</p></article>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
