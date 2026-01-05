import type { ReactNode } from 'react';
import './Container.css';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
}

export function Container({
  children,
  className = '',
  size = 'lg',
  centered = false,
}: ContainerProps) {
  const sizeClass = `container--${size}`;
  const centeredClass = centered ? 'container--centered' : '';

  return (
    <div className={`container ${sizeClass} ${centeredClass} ${className}`}>
      {children}
    </div>
  );
}
