import { Modal, ModalFooter } from './ui/Modal';
import { Button } from './ui/Button';
import './LogoutConfirmation.css';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cerrar Sesión"
      size="sm"
      showClose={false}
    >
      <div className="logout-confirmation">
        <div className="logout-confirmation__icon">⚠️</div>
        <p className="logout-confirmation__message">
          ¿Estás seguro de que deseas cerrar sesión como administrador?
        </p>
        <p className="logout-confirmation__warning">
          Tendrás que volver a iniciar sesión para acceder al panel administrador.
        </p>

        <ModalFooter align="right">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="btn btn-danger" onClick={onConfirm}>
            Cerrar Sesión
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
