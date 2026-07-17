import { useEffect, useState } from 'react';
import NavHeader from '../components/NavHeader';
import BottomNav from '../components/BottomNav';

type CancerType = 'mama' | 'prostata' | 'pulmon' | 'colorrectal' | 'ginecologico' | 'cabeza-cuello' | 'otro' | '';

type CancerProfileData = {
  cancerType: CancerType;
  histology: string;
  stage: string;
  treatments: string[];
  age: string;
  generalState: string;
};

const STORAGE_KEY = 'oncoresponde-cancer-profile-v1';

const cancerTypes: Array<{ id: Exclude<CancerType, ''>; label: string; icon: string; description: string }> = [
  { id: 'mama', label: 'Mama', icon: '🩷', description: 'Cáncer de mama' },
  { id: 'prostata', label: 'Próstata', icon: '💙', description: 'Cáncer de próstata' },
  { id: 'pulmon', label: 'Pulmón', icon: '🫁', description: 'Cáncer de pulmón' },
  { id: 'colorrectal', label: 'Colorrectal', icon: '🟤', description: 'Colon o recto' },
  { id: 'ginecologico', label: 'Ginecológico', icon: '👩', description: 'Ovario, endometrio, cérvix u otro' },
  { id: 'cabeza-cuello', label: 'Cabeza y cuello', icon: '🙂', description: 'Tumores ORL' },
  { id: 'otro', label: 'Otro', icon: '＋', description: 'Otro tipo de cáncer' },
];

const treatmentOptions = ['Cirugía', 'Quimioterapia', 'Radioterapia', 'Hormonoterapia', 'Inmunoterapia', 'Terapia dirigida', 'Todavía no lo sé'];

const emptyProfile: CancerProfileData = {
  cancerType: '',
  histology: '',
  stage: '',
  treatments: [],
  age: '',
  generalState: '',
};

export default function CancerProfile() {
  const [profile, setProfile] = useState<CancerProfileData>(emptyProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setProfile({ ...emptyProfile, ...JSON.parse(stored) });
    } catch {
      // Si el almacenamiento no está disponible, el formulario sigue funcionando durante la sesión.
    }
  }, []);

  const update = <K extends keyof CancerProfileData>(key: K, value: CancerProfileData[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const toggleTreatment = (treatment: string) => {
    const next = profile.treatments.includes(treatment)
      ? profile.treatments.filter((item) => item !== treatment)
      : [...profile.treatments, treatment];
    update('treatments', next);
  };

  const saveProfile = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
  };

  const clearProfile = () => {
    if (!window.confirm('¿Quieres borrar la información guardada sobre tu cáncer en este dispositivo?')) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setProfile(emptyProfile);
    setSaved(false);
  };

  const selectedLabel = cancerTypes.find((item) => item.id === profile.cancerType)?.label;

  return (
    <>
      <main className="profile-page">
        <NavHeader title="Cuéntame sobre tu cáncer" />

        <section className="profile-intro">
          <span className="section-kicker">Personalización opcional</span>
          <h1>Cuéntame lo que sabes de tu cáncer</h1>
          <p>
            Puedes completar solo aquello que conozcas y te apetezca compartir. Esta información se guarda únicamente
            en este dispositivo y ayuda a adaptar mejor los contenidos de OncoResponde.
          </p>
          <div className="privacy-note" role="note">
            <strong>Tu decisión, siempre.</strong>
            <span>No es necesario completar este apartado para utilizar la aplicación.</span>
          </div>
        </section>

        <section className="profile-section" aria-labelledby="cancer-type-title">
          <div className="profile-section__heading">
            <span className="profile-step">1</span>
            <div>
              <h2 id="cancer-type-title">Tipo de cáncer</h2>
              <p>Selecciona una opción. Puedes cambiarla cuando quieras.</p>
            </div>
          </div>

          <div className="cancer-type-grid">
            {cancerTypes.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`cancer-type-card${profile.cancerType === item.id ? ' is-selected' : ''}`}
                onClick={() => update('cancerType', item.id)}
                aria-pressed={profile.cancerType === item.id}
              >
                <span className="cancer-type-card__icon" aria-hidden="true">{item.icon}</span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
                <span className="cancer-type-card__check" aria-hidden="true">✓</span>
              </button>
            ))}
          </div>
        </section>

        <section className="profile-section" aria-labelledby="details-title">
          <div className="profile-section__heading">
            <span className="profile-step">2</span>
            <div>
              <h2 id="details-title">Lo que sabes hasta ahora</h2>
              <p>Todos los campos son opcionales.</p>
            </div>
          </div>

          <div className="profile-form-grid">
            <label className="profile-field">
              <span>Histología o tipo concreto</span>
              <input
                type="text"
                value={profile.histology}
                onChange={(event) => update('histology', event.target.value)}
                placeholder="Por ejemplo: adenocarcinoma"
              />
              <small>Déjalo vacío si no lo sabes.</small>
            </label>

            <label className="profile-field">
              <span>Estadio</span>
              <select value={profile.stage} onChange={(event) => update('stage', event.target.value)}>
                <option value="">No lo sé o prefiero no indicarlo</option>
                <option value="I">Estadio I</option>
                <option value="II">Estadio II</option>
                <option value="III">Estadio III</option>
                <option value="IV">Estadio IV</option>
                <option value="localizado">Localizado</option>
                <option value="localmente-avanzado">Localmente avanzado</option>
                <option value="metastasico">Metastásico</option>
              </select>
            </label>

            <label className="profile-field">
              <span>Edad</span>
              <input
                type="number"
                min="18"
                max="110"
                inputMode="numeric"
                value={profile.age}
                onChange={(event) => update('age', event.target.value)}
                placeholder="Opcional"
              />
            </label>

            <label className="profile-field">
              <span>Estado general</span>
              <select value={profile.generalState} onChange={(event) => update('generalState', event.target.value)}>
                <option value="">Prefiero no indicarlo</option>
                <option value="activo">Hago vida activa con normalidad</option>
                <option value="limitacion-ligera">Tengo alguna limitación, pero soy independiente</option>
                <option value="ayuda-parcial">Necesito ayuda para algunas actividades</option>
                <option value="ayuda-frecuente">Necesito ayuda con frecuencia</option>
              </select>
            </label>
          </div>
        </section>

        <section className="profile-section" aria-labelledby="treatments-title">
          <div className="profile-section__heading">
            <span className="profile-step">3</span>
            <div>
              <h2 id="treatments-title">Tratamientos</h2>
              <p>Marca todos los que correspondan, pasados, actuales o previstos.</p>
            </div>
          </div>

          <div className="treatment-grid">
            {treatmentOptions.map((treatment) => (
              <button
                type="button"
                key={treatment}
                className={`treatment-chip${profile.treatments.includes(treatment) ? ' is-selected' : ''}`}
                onClick={() => toggleTreatment(treatment)}
                aria-pressed={profile.treatments.includes(treatment)}
              >
                <span aria-hidden="true">{profile.treatments.includes(treatment) ? '✓' : '+'}</span>
                {treatment}
              </button>
            ))}
          </div>
        </section>

        <section className="profile-summary" aria-live="polite">
          <div>
            <span className="section-kicker">Resumen</span>
            <h2>{selectedLabel ? `Has seleccionado: ${selectedLabel}` : 'Todavía no has seleccionado un tipo de cáncer'}</h2>
            <p>
              {profile.treatments.length
                ? `Tratamientos indicados: ${profile.treatments.join(', ')}.`
                : 'No has indicado tratamientos. Puedes guardar igualmente el formulario.'}
            </p>
          </div>
          <div className="profile-actions">
            <button type="button" className="button profile-save" onClick={saveProfile}>Guardar en este dispositivo</button>
            <button type="button" className="button profile-clear" onClick={clearProfile}>Borrar datos</button>
          </div>
          {saved && <p className="save-confirmation" role="status">✓ Información guardada correctamente en este dispositivo.</p>}
        </section>

        <section className="profile-safety" role="note">
          <strong>Importante</strong>
          <p>Esta información sirve para personalizar la orientación. No constituye una historia clínica ni sustituye los datos de tu equipo sanitario.</p>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
