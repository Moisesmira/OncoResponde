import { useNavigate } from 'react-router-dom';

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

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(backTo);
  };

  return (
    <header className="nav-header">
      <button type="button" onClick={goBack} aria-label={`${backLabel}: ${title}`}>
        <span aria-hidden="true">←</span> {backLabel}
      </button>
      <strong className="nav-header__title">{title}</strong>
      <button type="button" onClick={() => navigate('/')} aria-label="Ir a la pantalla de inicio">
        <span aria-hidden="true">⌂</span> Hoy
      </button>
    </header>
  );
}
