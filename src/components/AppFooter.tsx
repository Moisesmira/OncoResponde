import { useLanguage } from '../i18n/LanguageContext';
export default function AppFooter() {
  const { t } = useLanguage();
  return (
    <footer className="app-footer" aria-label="Información de OncoResponde">
      <strong>OncoResponde 3.1</strong>
      <p>
        {t('Información orientativa basada en fuentes científicas y guías clínicas. No sustituye la valoración de tu equipo sanitario ni los servicios de urgencias.')}
      </p>
      <small>© 2026 Moisés Mira</small>
    </footer>
  );
}
