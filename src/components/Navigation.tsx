import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from './ui/Icon';
import { useApp } from '../context/AppContext';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const { isAdmin, logoutAdmin } = useApp();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    setIsOpen(false);
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
                <Icon name="arrow-left" size={18} />
                <span>Reportes</span>
              </Link>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="navigation__user-menu">
          <button
            className="navigation__user-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menú de usuario"
            aria-expanded={isOpen}
          >
            <Icon name="settings" size={20} />
            {isAdmin && (
              <span className="navigation__admin-badge">
                <Icon name="lock" size={12} />
                Admin
              </span>
            )}
          </button>

          {isOpen && (
            <div className="navigation__user-dropdown">
              {isAdmin ? (
                <>
                  <div className="navigation__user-info">
                    <span className="navigation__user-status">
                      <Icon name="lock" size={14} />
                      Modo administrador
                    </span>
                  </div>

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
                  <span className="navigation__user-status">
                    <Icon name="lock" size={14} />
                    Usuario
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
