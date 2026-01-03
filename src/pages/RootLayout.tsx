import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './RootLayout.css';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logoutAdmin } = useApp();

  // Check if current route is the turns page
  const isTurnsPage = location.pathname === '/' || location.pathname === '/turns';
  const isDashboard = isAdmin && !isTurnsPage;

  // Navigation items (dashboard pages)
  const navItems = [
    { path: '/dashboard', label: '📊 Listas' },
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
        
        {isTurnsPage && (
          <button
            className="admin-toggle-btn"
            onClick={() => {
              if (isAdmin) {
                logoutAdmin();
                navigate('/');
              } else {
                navigate('/login');
              }
            }}
            title={isAdmin ? 'Salir del modo administrador' : 'Acceso administrador'}
          >
            {isAdmin ? '🔒 Salir Admin' : '⚙️ Admin'}
          </button>
        )}
      </header>

      {/* Show navigation only on admin/dashboard pages */}
      {isDashboard && (
        <nav className="main-nav">
          <button 
            className="nav-button home-btn"
            onClick={() => navigate('/')}
            title="Volver a Turnos"
          >
            ← Turnos
          </button>
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
