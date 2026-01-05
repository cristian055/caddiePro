import { useNavigate } from 'react-router-dom';
import { CaddieTurns } from '../components/CaddieTurns';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import './TurnsPage.css';

export const TurnsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/login');
  };

  return (
    <div className="turns-page-wrapper">
      {/* Admin Access Button */}
      <div className="turns-page__admin-access">
        <Button
          variant="default"
          className="admin-access-btn"
          onClick={handleAdminLogin}
          aria-label="Acceso administrador"
        >
          <Icon name="lock" size={18} />
          <span>Acceso Administrador</span>
        </Button>
        <span className="admin-access-hint">Iniciar sesión como administrador para acceder al panel</span>
      </div>

      <CaddieTurns />
    </div>
  );
};
