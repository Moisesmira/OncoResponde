import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Hoy', icon: '⌂' },
  { to: '/oncoayuda', label: 'OncoAyuda', icon: '◌' },
  { to: '/cuidate', label: 'Cuídate', icon: '♧' },
  { to: '/camino', label: 'Mi Camino', icon: '▤' },
  { to: '/ajustes', label: 'Ajustes', icon: '⚙' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <span className="bottom-nav__icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
