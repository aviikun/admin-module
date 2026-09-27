import { NavLink, Outlet } from 'react-router-dom';
import { inspector } from '../data/inspections';

const NAV_ITEMS = [
  { to: '/schedule', label: 'Inspection Schedule' },
  { to: '/records', label: 'Inspection Records' },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-title">Satark Drishti</div>
          <div className="sidebar-brand-subtitle">Inspector Portal</div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'sidebar-nav-link active' : 'sidebar-nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          {inspector.name}
          <br />
          {inspector.designation}
        </div>
      </aside>

      <div className="mobile-topbar">
        <span className="mobile-topbar-title">Satark Drishti · Inspector Portal</span>
      </div>
      <nav className="mobile-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="app-main">
        <header className="app-header">
          <div />
          <div className="app-header-inspector">
            <div className="app-header-inspector-name">{inspector.name}</div>
            <div className="app-header-inspector-role">{inspector.region}</div>
          </div>
        </header>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
