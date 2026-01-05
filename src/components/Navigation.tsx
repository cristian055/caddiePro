import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Icon } from './ui/Icon';
import { useApp } from '../context/AppContext';
import { useToast } from './ToastProvider';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const { isAdmin, logoutAdmin } = useApp();
  const { showToast } = useToast();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [wasAdmin, setWasAdmin] = useState(isAdmin);

  // Show toast when admin state changes
  useEffect(() => {
    if (isAdmin && !wasAdmin) {
      showToast('Sesión de administrador iniciada', 'success');
      setWasAdmin(true);
    } else if (!isAdmin && wasAdmin) {
      showToast('Sesión cerrada correctamente', 'info');
      setWasAdmin(false);
    }
  }, [isAdmin, wasAdmin, showToast]);

  const handleLogout = async () => {
    await logoutAdmin();
    setIsOpen(false);
  };

  // Get current page title for header
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Turnos';
    if (path === '/dashboard') return 'Panel';
    if (path === '/caddies') return 'Caddies';
    if (path === '/attendance') return 'Asistencia';
    if (path === '/messaging') return 'Mensajes';
    if (path === '/reports') return 'Reportes';
    return 'CaddiePro';
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        {/* Logo and Title */}
        <Link to="/" className="navigation__logo">
          <Icon name="golf" size={24} />
          <span className="navigation__title">CaddiePro</span>
        </Link>

        {/* Main Navigation Links */}
        <div className="navigation__links">
          <Link
            to="/"
            className={`navigation__link ${location.pathname === '/' ? 'navigation__link--active' : ''}`}
          >
            <Icon name="list" size={18} />
            <span>Turnos</span>
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/dashboard"
                className={`navigation__link ${location.pathname.startsWith('/dashboard') ? 'navigation__link--active' : ''}`}
              >
                <Icon name="chart" size={18} />
                <span>Panel</span>
              </Link>

              <Link
                to="/caddies"
                className={`navigation__link ${location.pathname.startsWith('/caddies') ? 'navigation__link--active' : ''}`}
              >
                <Icon name="people" size={18} />
                <span>Caddies</span>
              </Link>

              <Link
                to="/attendance"
                className={`navigation__link ${location.pathname.startsWith('/attendance') ? 'navigation__link--active' : ''}`}
              >
                <Icon name="phone" size={18} />
                <span>Asistencia</span>
              </Link>

              <Link
                to="/messaging"
                className={`navigation__link ${location.pathname.startsWith('/messaging') ? 'navigation__link--active' : ''}`}
              >
                <Icon name="message" size={18} />
                <span>Mensajes</span>
              </Link>

              <Link
                to="/reports"
                className={`navigation__link ${location.pathname.startsWith('/reports') ? 'navigation__link--active' : ''}`}
              >
                <Icon name="chart" size={18} />
                <span>Reportes</span>
              </Link>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="navigation__user-menu">
          <button
            className={`navigation__user-toggle ${isAdmin ? 'navigation__user-toggle--admin' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menú de usuario"
            aria-expanded={isOpen}
          >
            <Icon name="settings" size={20} />
            {isAdmin && (
              <span className="navigation__admin-badge">
                <Icon name="lock" size={12} />
                <span>Admin</span>
              </span>
            )}
          </button>

          {isOpen && (
            <div className="navigation__user-dropdown">
              {isAdmin ? (
                <>
                  <div className="navigation__user-info">
                    <div className="navigation__user-avatar">
                      <Icon name="lock" size={18} />
                    </div>
                    <div className="navigation__user-details">
                      <span className="navigation__user-name">Administrador</span>
                      <span className="navigation__user-status">
                        <span className="navigation__status-dot navigation__status-dot--online"></span>
                        Conectado
                      </span>
                    </div>
                  </div>

                  <div className="navigation__dropdown-divider" />

                  <button
                    className="navigation__logout-btn"
                    onClick={handleLogout}
                  >
                    <Icon name="arrow-left" size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <div className="navigation__user-info">
                  <div className="navigation__user-avatar navigation__user-avatar--guest">
                    <Icon name="settings" size={18} />
                  </div>
                  <div className="navigation__user-details">
                    <span className="navigation__user-name">Usuario</span>
                    <span className="navigation__user-status">
                      <span className="navigation__status-dot"></span>
                      Modo visitante
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile page title indicator */}
      <div className="navigation__mobile-title">
        {getPageTitle()}
      </div>
    </nav>
  );
};
