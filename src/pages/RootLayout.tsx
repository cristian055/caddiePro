import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RootLayout.css';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Check if current route is the turns page
  const isTurnsPage = location.pathname === '/turns';

  // Navigation items (only show for admins)
  const navItems = [
    { path: '/', label: '📊 Listas' },
    { path: '/caddies', label: '👥 Caddies' },
    { path: '/attendance', label: '📞 Llamado' },
    { path: '/messaging', label: '💬 Mensajes' },
    { path: '/reports', label: '📈 Reportes' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>⛳ CaddiePro MVP</h1>
            <p className="tagline">Sistema de Gestión de Turnos de Caddies</p>
          </div>
          {user && (
            <div className="header-right">
              <span className="user-info">
                👤 {user.name} <span className="user-badge">{user.role === 'caddie' ? 'Caddie' : 'Admin'}</span>
              </span>
              <button className="logout-button" onClick={handleLogout}>
                Salir
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Show navigation only on non-turns pages and for admins */}
      {!isTurnsPage && user?.role === 'admin' && (
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
