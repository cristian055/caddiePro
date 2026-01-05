import React, { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import { Icon } from './ui/Icon';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <React.Fragment>
      <ToastContext.Provider value={{ showToast, hideToast }}>
        {children}
      </ToastContext.Provider>
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <Icon
              name={toast.type === 'success' ? 'check' : toast.type === 'error' ? 'x' : 'list'}
              size={20}
              className={`toast__icon toast__icon--${toast.type}`}
            />
            <span className="toast__message">{toast.message}</span>
            <button
              className="toast__close"
              onClick={() => hideToast(toast.id)}
              aria-label="Cerrar notificación"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default ToastProvider;
