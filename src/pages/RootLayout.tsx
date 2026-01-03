import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import Icon from '../components/ui/Icon';
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
    { path: '/dashboard', label: 'Listas', icon: 'chart' },
    { path: '/caddies', label: 'Caddies', icon: 'people' },
    { path: '/attendance', label: 'Llamado', icon: 'phone' },
    { path: '/messaging', label: 'Mensajes', icon: 'message' },
    { path: '/reports', label: 'Reportes', icon: 'chart' },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1><Icon name="golf" className="title-icon" size={22} /> CaddiePro MVP</h1>
          <p className="tagline">Sistema de Gestión de Turnos de Caddies</p>
        </div>
        
        {isTurnsPage && (
          <Button
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
            {isAdmin ? (
              <><Icon name="lock" className="btn-icon" /> Salir Admin</>
            ) : (
              <><Icon name="settings" className="btn-icon" /> Admin</>
            )}
          </Button>
        )}
      </header>

      {/* Show navigation only on admin/dashboard pages */}
      {isDashboard && (
        <nav className="main-nav">
          <Button
            className="nav-button home-btn"
            onClick={() => navigate('/')}
            title="Volver a Turnos"
          >
            <Icon name="arrow-left" className="btn-icon" /> Turnos
          </Button>
          {navItems.map(item => (
            <Button
              key={item.path}
              className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon name={(item as any).icon} className="btn-icon" /> {item.label}
            </Button>
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
