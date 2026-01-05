import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  title?: string;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  title,
  header,
  footer,
  className = '',
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const paddingClass = `card--padding-${padding}`;

  return (
    <div className={`card card--${variant} ${paddingClass} ${className}`}>
      {(title || header) && (
        <div className="card__header">
          {title ? <h3 className="card__title">{title}</h3> : header}
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}
