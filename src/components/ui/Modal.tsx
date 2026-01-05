import type { ReactNode } from 'react';
import { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  showClose = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showClose) && (
          <div className="modal__header">
            {title && <h2 id="modal-title" className="modal__title">{title}</h2>}
            {showClose && (
              <button
                type="button"
                className="modal__close"
                onClick={onClose}
                aria-label="Cerrar"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

// Modal Header component for consistent styling
interface ModalHeaderProps {
  children: ReactNode;
  actions?: ReactNode;
}

export function ModalHeader({ children, actions }: ModalHeaderProps) {
  return (
    <div className="modal__header-custom">
      <div className="modal__header-title">{children}</div>
      {actions && <div className="modal__header-actions">{actions}</div>}
    </div>
  );
}

// Modal Footer component for action buttons
interface ModalFooterProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
}

export function ModalFooter({
  children,
  align = 'right',
}: ModalFooterProps) {
  const alignClass = `modal__footer modal__footer--${align}`;

  return <div className={alignClass}>{children}</div>;
}
