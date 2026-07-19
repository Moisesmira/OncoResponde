import { NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const items = [
  { to: '/', label: 'Hoy', icon: '⌂' },
  { to: '/oncoayuda', label: 'OncoAyuda', icon: '◌' },
  { to: '/cuidate', label: 'Cuídate', icon: '♧' },
  { to: '/seguimiento', label: 'Seguimiento', icon: '◷' },
  { to: '/ajustes', label: 'Ajustes', icon: '⚙' },
];

export default function BottomNav() {
  const { t } = useLanguage();
  return (
    <nav className="bottom-nav" aria-label={t("Navegación principal")}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <span className="bottom-nav__icon" aria-hidden="true">{item.icon}</span>
          <span>{t(item.label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
