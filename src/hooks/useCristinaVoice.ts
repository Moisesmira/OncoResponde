import { useCallback, useEffect, useRef, useState } from 'react';

export type CristinaVoiceState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

type SpeakOptions = {
  text: string;
  cacheKey: string;
  fixedAudioSrc?: string;
  rate?: number;
  onEnded?: () => void;
};

const CACHE_NAME = 'oncoresponde-cristina-audio-v1';
const cacheRequest = (key: string) => new Request(`/__cristina_cache__/${encodeURIComponent(key)}.mp3`);

export function useCristinaVoice() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [state, setState] = useState<CristinaVoiceState>('idle');
  const [error, setError] = useState('');

  const releaseObjectUrl = useCallback(() => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    setState('idle');
  }, []);

  useEffect(() => () => {
    audioRef.current?.pause();
    releaseObjectUrl();
  }, [releaseObjectUrl]);

  const speak = useCallback(async ({ text, cacheKey, fixedAudioSrc, rate = 1, onEnded }: SpeakOptions) => {
    stop();
    releaseObjectUrl();
    setError('');
    setState('loading');

    try {
      let src = fixedAudioSrc || '';

      if (!src && 'caches' in window) {
        const cached = await (await caches.open(CACHE_NAME)).match(cacheRequest(cacheKey));
        if (cached) {
          const blob = await cached.blob();
          src = URL.createObjectURL(blob);
          objectUrlRef.current = src;
        }
      }

      if (!src) {
        const response = await fetch('/.netlify/functions/voz?v=3.8.1-cristina-unica', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (!response.ok) {
          const details = await response.json().catch(() => ({})) as { error?: string };
          throw new Error(details.error || 'No se ha podido preparar el audio de Cristina.');
        }
        if (response.headers.get('X-OncoResponde-Voice-Id') !== 'dNjJKg63Fr5AXwIdkATa') {
          throw new Error('El servidor no ha devuelto la voz de Cristina.');
        }
        const blob = await response.blob();
        if (!blob.size || !blob.type.startsWith('audio/')) throw new Error('El audio recibido no es válido.');
        if ('caches' in window) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(cacheRequest(cacheKey), new Response(blob, { headers: { 'Content-Type': blob.type || 'audio/mpeg' } }));
        }
        src = URL.createObjectURL(blob);
        objectUrlRef.current = src;
      }

      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.playbackRate = rate;
      audio.onended = () => { setState('idle'); onEnded?.(); };
      audio.onerror = () => {
        setError('Este dispositivo no ha podido reproducir el audio de Cristina.');
        setState('error');
      };
      audioRef.current = audio;
      await audio.play();
      setState('playing');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se ha podido reproducir el audio de Cristina.');
      setState('error');
    }
  }, [releaseObjectUrl, stop]);

  const togglePause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setState('playing');
    } else {
      audio.pause();
      setState('paused');
    }
  }, []);

  const setRate = useCallback((rate: number) => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, []);

  return { state, error, speak, stop, togglePause, setRate };
}
