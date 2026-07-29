import { useLanguage } from '../i18n/LanguageContext';

export default function AppFooter() {
  const { t } = useLanguage();
  return (
    <footer className="app-footer" aria-label="Información de OncoResponde">
      <strong>OncoResponde 3.6.4</strong>
      <p>{t('Información orientativa.')}</p>
      <small>© 2026 Moisés Mira</small>
    </footer>
  );
}
