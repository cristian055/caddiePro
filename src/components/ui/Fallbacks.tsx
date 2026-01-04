import type { ReactNode } from 'react';
import './Fallbacks.css';

interface FallbackErrorProps {
  error: Error | string;
  onReset?: () => void;
}

export function FallbackError({ error, onReset }: FallbackErrorProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="fallback-error">
      <div className="fallback-error__icon">⚠️</div>
      <h2 className="fallback-error__title">Error</h2>
      <p className="fallback-error__message">{errorMessage}</p>
      {onReset && (
        <button onClick={onReset} className="fallback-error__button">
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}

interface FallbackLoadingProps {
  message?: string;
}

export function FallbackLoading({ message = 'Cargando...' }: FallbackLoadingProps) {
  return (
    <div className="fallback-loading">
      <div className="fallback-loading__spinner" />
      {message && <p className="fallback-loading__message">{message}</p>}
    </div>
  );
}

interface QueryErrorProps {
  error: Error;
  onRetry?: () => void;
}

export function QueryError({ error, onRetry }: QueryErrorProps) {
  return (
    <div className="query-error">
      <div className="query-error__icon">⚠️</div>
      <h3 className="query-error__title">Error al cargar datos</h3>
      <p className="query-error__message">{error.message}</p>
      {onRetry && (
        <button onClick={onRetry} className="query-error__button">
          Reintentar
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  message?: string;
  icon?: ReactNode;
}

export function EmptyState({ message = 'No hay datos disponibles', icon = '📭' }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
