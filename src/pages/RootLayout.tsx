import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './RootLayout.css';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current route is the turns page
  const isTurnsPage = location.pathname === '/turns';

  // Navigation items
  const navItems = [
    { path: '/', label: '📊 Listas' },
    { path: '/caddies', label: '👥 Caddies' },
    { path: '/attendance', label: '📞 Llamado' },
    { path: '/messaging', label: '💬 Mensajes' },
    { path: '/reports', label: '📈 Reportes' },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>⛳ CaddiePro MVP</h1>
          <p className="tagline">Sistema de Gestión de Turnos de Caddies</p>
        </div>
      </header>

      {/* Show navigation only on non-turns pages */}
      {!isTurnsPage && (
        <nav className="main-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}

      <main className={`main-content ${isTurnsPage ? 'turns-page' : ''}`}>
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>© 2025 CaddiePro - Sistema desarrollado por <a href="https://berracode.com/"  rel="noopener noreferrer">Berracode</a></p>
      </footer>
    </div>
  );
};
