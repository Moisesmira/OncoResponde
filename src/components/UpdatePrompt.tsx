import { useEffect, useState } from 'react';

const APP_VERSION = '3.6.1';
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

export default function UpdatePrompt() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateReady, setUpdateReady] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;

    let active = true;
    let intervalId: number | undefined;
    let refreshing = false;

    const showWaitingWorker = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting && navigator.serviceWorker.controller && active) {
        setRegistration(reg);
        setUpdateReady(true);
      }
    };

    const observeRegistration = (reg: ServiceWorkerRegistration) => {
      setRegistration(reg);
      showWaitingWorker(reg);

      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed') showWaitingWorker(reg);
        });
      });
    };

    navigator.serviceWorker.ready.then((reg) => {
      if (!active) return;
      observeRegistration(reg);
      void reg.update();

      intervalId = window.setInterval(() => {
        void reg.update();
      }, UPDATE_INTERVAL_MS);
    }).catch(() => {
      // La app sigue disponible aunque el navegador limite la actualización del service worker.
    });

    const checkWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            showWaitingWorker(reg);
            void reg.update();
          }
        }).catch(() => undefined);
      }
    };

    const reloadAfterUpdate = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    document.addEventListener('visibilitychange', checkWhenVisible);
    window.addEventListener('online', checkWhenVisible);
    navigator.serviceWorker.addEventListener('controllerchange', reloadAfterUpdate);

    return () => {
      active = false;
      if (intervalId) window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', checkWhenVisible);
      window.removeEventListener('online', checkWhenVisible);
      navigator.serviceWorker.removeEventListener('controllerchange', reloadAfterUpdate);
    };
  }, []);

  const applyUpdate = () => {
    if (!registration?.waiting) return;
    setUpdating(true);
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  if (!updateReady) return null;

  return (
    <aside className="update-prompt" role="status" aria-live="polite" aria-label="Actualización disponible">
      <div className="update-prompt__icon" aria-hidden="true">↻</div>
      <div className="update-prompt__content">
        <strong>Nueva versión disponible</strong>
        <span>Actualiza OncoResponde para ver las últimas mejoras.</span>
      </div>
      <button type="button" onClick={applyUpdate} disabled={updating}>
        {updating ? 'Actualizando…' : 'Actualizar ahora'}
      </button>
      <small>v{APP_VERSION}</small>
    </aside>
  );
}
