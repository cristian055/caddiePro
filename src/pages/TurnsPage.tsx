import { useNavigate } from 'react-router-dom';
import { CaddieTurns } from '../components/CaddieTurns';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { useApp } from '../context/AppContext';
import './TurnsPage.css';

export const TurnsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useApp();

  const handleAdminAccess = () => {
    // If already admin, go directly to dashboard, otherwise show login
    navigate(isAdmin ? '/dashboard' : '/login');
  };

  return (
    <div className="turns-page-wrapper">
      {/* Admin Access Button */}
      <div className="turns-page__admin-access">
        <Button
          variant="default"
          className="admin-access-btn"
          onClick={handleAdminAccess}
          aria-label={isAdmin ? 'Ir al panel de administrador' : 'Acceso administrador'}
        >
          <Icon name={isAdmin ? 'chart' : 'lock'} size={18} />
          <span>{isAdmin ? 'Ir al Panel' : 'Acceso Administrador'}</span>
        </Button>
        <span className="admin-access-hint">
          {isAdmin ? 'Haz clic para acceder al panel de administración' : 'Iniciar sesión como administrador para acceder al panel'}
        </span>
      </div>

      <CaddieTurns />
    </div>
  );
};
