import { useState } from 'react';
import NavHeader from '../components/NavHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPersonalAssistantContext } from '../utils/personalAssistantContext';
import { useLanguage } from '../i18n/LanguageContext';

type VoiceLocationState = { prefill?: string } | null;

export default function Voice() {
  const location = useLocation();
  const initial = (location.state as VoiceLocationState)?.prefill ?? '';
  const [text, setText] = useState(initial);
  const navigate = useNavigate();
  const personalContext = getPersonalAssistantContext();
  const { t, language, locale } = useLanguage();

  const listen = () => {
    const SpeechRecognition = (window as typeof window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any }).SpeechRecognition
      ?? (window as typeof window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
    if (!SpeechRecognition) return window.alert(t('El reconocimiento de voz no está disponible en este navegador. Puedes escribir tu pregunta.'));
    const recognition = new SpeechRecognition();
    recognition.lang = locale;
    recognition.onresult = (event: any) => setText(event.results[0][0].transcript);
    recognition.start();
  };

  return (
    <main>
      <NavHeader title={t("Háblame")} />
      <section className="card centered">
        <img className="voice-image" src="/assets/camino.png" alt="Camino hacia la luz" />
        <h2>{t("Puedes hablar con tranquilidad")}</h2>
        <p>{t("Tómate el tiempo que necesites. La conversación no se guarda automáticamente.")}</p>
        <div className="context-aware-note"><strong>Respuesta contextual</strong><span>Podrá tener en cuenta, solo cuando sea útil, tus citas, medicación y registros guardados en este dispositivo.</span></div>
        <button className="mic" type="button" onClick={listen}>🎤 {t("Comenzar a hablar")}</button>
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={t("También puedes escribir…")} />
        <p className="voice-privacy">No incluyas nombres, direcciones ni otros datos que permitan identificarte.</p>
        <button disabled={!text.trim()} type="button" onClick={() => navigate('/respuesta', { state: { question: text, contextId: 'general', context: `${personalContext.context} Responde siempre en ${language === 'ca' ? 'catalán' : language === 'en' ? 'inglés' : 'español'}.`, profileContext: personalContext.profileContext, cancerType: personalContext.cancerType } })}> {t("Enviar")}</button>
      </section>
    </main>
  );
}
