import { useState } from 'react';
import NavHeader from '../components/NavHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPersonalAssistantContext } from '../utils/personalAssistantContext';

type VoiceLocationState = { prefill?: string } | null;

export default function Voice() {
  const location = useLocation();
  const initial = (location.state as VoiceLocationState)?.prefill ?? '';
  const [text, setText] = useState(initial);
  const navigate = useNavigate();
  const personalContext = getPersonalAssistantContext();

  const listen = () => {
    const SpeechRecognition = (window as typeof window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any }).SpeechRecognition
      ?? (window as typeof window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
    if (!SpeechRecognition) return window.alert('El reconocimiento de voz no está disponible en este navegador. Puedes escribir tu pregunta.');
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.onresult = (event: any) => setText(event.results[0][0].transcript);
    recognition.start();
  };

  return (
    <main>
      <NavHeader title="Háblame" />
      <section className="card centered">
        <img className="voice-image" src="/assets/camino.png" alt="Camino hacia la luz" />
        <h2>Puedes hablar con tranquilidad</h2>
        <p>Tómate el tiempo que necesites. La conversación no se guarda automáticamente.</p>
        <div className="context-aware-note"><strong>Respuesta contextual</strong><span>Podrá tener en cuenta, solo cuando sea útil, tus citas, medicación y registros guardados en este dispositivo.</span></div>
        <button className="mic" type="button" onClick={listen}>🎤 Comenzar a hablar</button>
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="También puedes escribir…" />
        <p className="voice-privacy">No incluyas nombres, direcciones ni otros datos que permitan identificarte.</p>
        <button disabled={!text.trim()} type="button" onClick={() => navigate('/respuesta', { state: { question: text, contextId: 'general', context: personalContext.context, profileContext: personalContext.profileContext, cancerType: personalContext.cancerType } })}>Enviar</button>
      </section>
    </main>
  );
}
