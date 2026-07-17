import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type Phase = 'Preparado' | 'Inspirar' | 'Mantener' | 'Espirar';
const cycles = [
  { phase: 'Inspirar' as Phase, seconds: 4 },
  { phase: 'Mantener' as Phase, seconds: 2 },
  { phase: 'Espirar' as Phase, seconds: 6 },
];

export default function Breathing() {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remaining, setRemaining] = useState(cycles[0].seconds);
  const [sound, setSound] = useState(false);
  const [pace, setPace] = useState(1);
  const audioRef = useRef<AudioContext | null>(null);
  const phase = running ? cycles[phaseIndex].phase : 'Preparado';

  const chime = () => {
    if (!sound) return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const context = audioRef.current ?? new AudioCtx();
    audioRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 440;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.35);
  };

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current > 1) return current - 1;
        setPhaseIndex((index) => {
          const next = (index + 1) % cycles.length;
          window.setTimeout(chime, 0);
          return next;
        });
        const nextIndex = (phaseIndex + 1) % cycles.length;
        return Math.max(1, Math.round(cycles[nextIndex].seconds * pace));
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, phaseIndex, pace, sound]);

  const start = () => {
    setPhaseIndex(0);
    setRemaining(Math.max(1, Math.round(cycles[0].seconds * pace)));
    setRunning(true);
    chime();
  };

  const stop = () => {
    setRunning(false);
    setPhaseIndex(0);
    setRemaining(Math.max(1, Math.round(cycles[0].seconds * pace)));
  };

  return (
    <main className={`breathing-page breathing-page--${phase.toLowerCase()}`}>
      <Link className="breathing-close" to="/cuidate" aria-label="Cerrar ejercicio de respiración">×</Link>
      <section className="breathing-content" aria-live="polite">
        <span className="breathing-kicker">Un momento para ti</span>
        <h1>Respira conmigo</h1>
        <p>Adopta una postura cómoda. Si notas mareo o malestar, vuelve a respirar con normalidad.</p>

        <div className={`breathing-orbit${running ? ' is-running' : ''}`}>
          <div className="breathing-sphere">
            <strong>{phase}</strong>
            <span>{running ? remaining : 'Pulsa comenzar'}</span>
          </div>
        </div>

        <div className="breathing-controls">
          {!running ? (
            <button type="button" className="breathing-primary" onClick={start}>Comenzar</button>
          ) : (
            <button type="button" className="breathing-primary" onClick={stop}>Parar</button>
          )}
          <label className="breathing-toggle">
            <input type="checkbox" checked={sound} onChange={(event) => setSound(event.target.checked)} />
            <span>Sonido suave al cambiar</span>
          </label>
          <label className="breathing-pace">
            <span>Ritmo</span>
            <select value={pace} onChange={(event) => { setPace(Number(event.target.value)); stop(); }}>
              <option value="0.8">Algo más rápido</option>
              <option value="1">Suave</option>
              <option value="1.25">Más pausado</option>
            </select>
          </label>
        </div>
      </section>
    </main>
  );
}
