import { useMemo, useRef, useState } from 'react';
import NavHeader from '../components/NavHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPersonalAssistantContext } from '../utils/personalAssistantContext';
import { useLanguage, type AppLanguage } from '../i18n/LanguageContext';

type VoiceLocationState = { prefill?: string } | null;

const questionBank: Record<AppLanguage, string[]> = {
  es: [
    '¿Puedes explicarme mi tratamiento de forma sencilla?',
    '¿Qué efectos secundarios son los más frecuentes?',
    '¿Qué síntomas deberían preocuparme?',
    '¿Qué puedo hacer hoy para encontrarme un poco mejor?',
    '¿Qué puedo comer durante el tratamiento?',
    '¿Puedo hacer ejercicio?',
    '¿Es normal sentir tanto cansancio?',
    '¿Cómo puedo dormir mejor?',
    'Me siento preocupado, ¿es normal?',
    'Tengo miedo del futuro y no sé cómo manejarlo.',
    'No sé cómo explicar a mi familia cómo me siento.',
    '¿Qué puedo preguntar en mi próxima visita?',
    '¿Cómo puedo prepararme para la consulta?',
    'No he entendido bien lo que me dijeron. ¿Puedes ayudarme?',
    'Soy familiar: ¿cómo puedo ayudar sin agobiar?',
    'Soy familiar: ¿cómo puedo cuidarme yo también?'
  ],
  ca: [
    'Em pots explicar el meu tractament de manera senzilla?',
    'Quins efectes secundaris són els més freqüents?',
    'Quins símptomes m’haurien de preocupar?',
    'Què puc fer avui per trobar-me una mica millor?',
    'Què puc menjar durant el tractament?',
    'Puc fer exercici?',
    'És normal sentir tant cansament?',
    'Com puc dormir millor?',
    'Em sento preocupat, és normal?',
    'Tinc por del futur i no sé com gestionar-ho.',
    'No sé com explicar a la meva família com em sento.',
    'Què puc preguntar a la pròxima visita?',
    'Com em puc preparar per a la consulta?',
    'No he entès bé el que em van dir. Em pots ajudar?',
    'Soc familiar: com puc ajudar sense aclaparar?',
    'Soc familiar: com em puc cuidar jo també?'
  ],
  en: [
    'Can you explain my treatment in simple terms?',
    'What side effects are most common?',
    'Which symptoms should concern me?',
    'What can I do today to feel a little better?',
    'What can I eat during treatment?',
    'Can I exercise?',
    'Is it normal to feel this tired?',
    'How can I sleep better?',
    'I feel worried. Is that normal?',
    'I am afraid of the future and do not know how to cope.',
    'I do not know how to explain how I feel to my family.',
    'What should I ask at my next appointment?',
    'How can I prepare for my appointment?',
    'I did not fully understand what I was told. Can you help?',
    'I am a relative: how can I help without overwhelming them?',
    'I am a relative: how can I take care of myself too?'
  ]
};

const labels: Record<AppLanguage, { intro: string; trigger: string; heading: string; refresh: string; selected: string }> = {
  es: {
    intro: 'No hace falta que hagas una pregunta perfecta. Puedes escribir una duda, una preocupación o simplemente decirme cómo te encuentras.',
    trigger: 'Ahora no sé qué preguntar. Ayúdame a empezar',
    heading: 'Puedes empezar por alguna de estas preguntas:',
    refresh: 'Mostrar otras preguntas',
    selected: 'La sugerencia se ha colocado en el cuadro de texto. Puedes modificarla antes de enviarla.'
  },
  ca: {
    intro: 'No cal que facis una pregunta perfecta. Pots escriure un dubte, una preocupació o simplement dir-me com et trobes.',
    trigger: 'Ara no sé què preguntar. Ajuda’m a començar',
    heading: 'Pots començar per alguna d’aquestes preguntes:',
    refresh: 'Mostrar altres preguntes',
    selected: 'El suggeriment s’ha col·locat al quadre de text. El pots modificar abans d’enviar-lo.'
  },
  en: {
    intro: 'You do not need to ask a perfect question. You can write a doubt, a worry, or simply tell me how you feel.',
    trigger: 'I do not know what to ask. Help me get started',
    heading: 'You can start with one of these questions:',
    refresh: 'Show other questions',
    selected: 'The suggestion has been placed in the text box. You can edit it before sending.'
  }
};

function pickSuggestions(bank: string[], count = 5) {
  return [...bank].sort(() => Math.random() - 0.5).slice(0, count);
}

export default function Voice() {
  const location = useLocation();
  const initial = (location.state as VoiceLocationState)?.prefill ?? '';
  const [text, setText] = useState(initial);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestionSeed, setSuggestionSeed] = useState(0);
  const [selectionNotice, setSelectionNotice] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();
  const personalContext = getPersonalAssistantContext();
  const { t, language, locale } = useLanguage();
  const copy = labels[language];
  const suggestions = useMemo(
    () => pickSuggestions(questionBank[language]),
    [language, suggestionSeed]
  );

  const listen = () => {
    const SpeechRecognition = (window as typeof window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any }).SpeechRecognition
      ?? (window as typeof window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
    if (!SpeechRecognition) return window.alert(t('El reconocimiento de voz no está disponible en este navegador. Puedes escribir tu pregunta.'));
    const recognition = new SpeechRecognition();
    recognition.lang = locale;
    recognition.onresult = (event: any) => setText(event.results[0][0].transcript);
    recognition.start();
  };

  const chooseSuggestion = (suggestion: string) => {
    setText(suggestion);
    setSelectionNotice(true);
    window.setTimeout(() => textareaRef.current?.focus(), 0);
  };

  return (
    <main>
      <NavHeader title={t('Háblame')} />
      <section className="card centered voice-card">
        <img className="voice-image" src="/assets/camino.png" alt="Camino hacia la luz" />
        <h2>{t('Puedes hablar con tranquilidad')}</h2>
        <p>{t('Tómate el tiempo que necesites. La conversación no se guarda automáticamente.')}</p>
        <p className="voice-start-note">{copy.intro}</p>
        <div className="question-starter">
          <button
            className="question-starter__trigger"
            type="button"
            aria-expanded={showSuggestions}
            onClick={() => setShowSuggestions((current) => !current)}
          >
            💬 {copy.trigger}
            <span aria-hidden="true">{showSuggestions ? '−' : '+'}</span>
          </button>

          {showSuggestions && (
            <div className="question-starter__panel">
              <p>{copy.heading}</p>
              <div className="question-starter__list">
                {suggestions.map((suggestion) => (
                  <button type="button" key={suggestion} onClick={() => chooseSuggestion(suggestion)}>
                    <span>{suggestion}</span><span aria-hidden="true">›</span>
                  </button>
                ))}
              </div>
              <button className="question-starter__refresh" type="button" onClick={() => { setSuggestionSeed((seed) => seed + 1); setSelectionNotice(false); }}>
                🔄 {copy.refresh}
              </button>
              {selectionNotice && <p className="question-starter__notice" role="status">{copy.selected}</p>}
            </div>
          )}
        </div>

        <div className="context-aware-note"><strong>Respuesta contextual</strong><span>Podrá tener en cuenta, solo cuando sea útil, tus citas, medicación y registros guardados en este dispositivo.</span></div>
        <button className="mic" type="button" onClick={listen}>🎤 {t('Comenzar a hablar')}</button>
        <textarea ref={textareaRef} value={text} onChange={(event) => { setText(event.target.value); setSelectionNotice(false); }} placeholder={t('También puedes escribir…')} />



        <p className="voice-privacy">No incluyas nombres, direcciones ni otros datos que permitan identificarte.</p>
        <button disabled={!text.trim()} type="button" onClick={() => navigate('/respuesta', { state: { question: text, contextId: 'general', context: `${personalContext.context} Responde siempre en ${language === 'ca' ? 'catalán' : language === 'en' ? 'inglés' : 'español'}.`, profileContext: personalContext.profileContext, cancerType: personalContext.cancerType } })}> {t('Enviar')}</button>
      </section>
    </main>
  );
}
