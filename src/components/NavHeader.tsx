import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

type NavHeaderProps = {
  title: string;
  backTo?: string;
  backLabel?: string;
};

export default function NavHeader({
  title,
  backTo = '/',
  backLabel = 'Volver',
}: NavHeaderProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(backTo);
  };

  return (
    <header className="nav-header">
      <button type="button" onClick={goBack} aria-label={`${t(backLabel)}: ${t(title)}`}>
        <span aria-hidden="true">←</span> {t(backLabel)}
      </button>
      <strong className="nav-header__title">{t(title)}</strong>
      <button type="button" onClick={() => navigate('/')} aria-label={t("Ir a la pantalla de inicio")}>
        <span aria-hidden="true">⌂</span> Hoy
      </button>
    </header>
  );
}
