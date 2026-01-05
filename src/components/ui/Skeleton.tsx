import type { ReactNode } from 'react';
import './Skeleton.css';

export type { BaseSkeletonProps, TextSkeletonProps, CircleSkeletonProps, CardSkeletonProps, TableSkeletonProps, ListSkeletonProps, ButtonSkeletonProps, InputSkeletonProps, BlockSkeletonProps, LoadingScreenProps };

interface BaseSkeletonProps {
  className?: string;
  variant?: 'light' | 'dark';
}

interface TextSkeletonProps extends BaseSkeletonProps {
  lines?: number;
  width?: string | number;
}

export function SkeletonText({
  lines = 1,
  width,
  className = '',
  variant = 'light',
}: TextSkeletonProps) {
  const skeletons = Array.from({ length: lines });

  return (
    <div className={`skeleton-text ${className} skeleton--${variant}`}>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="skeleton-text__line"
          style={{ width }}
        />
      ))}
    </div>
  );
}

interface CircleSkeletonProps extends BaseSkeletonProps {
  size?: number;
}

export function SkeletonCircle({
  size = 40,
  className = '',
  variant = 'light',
}: CircleSkeletonProps) {
  return (
    <div
      className={`skeleton-circle ${className} skeleton--${variant}`}
      style={{ width: size, height: size }}
    />
  );
}

interface CardSkeletonProps extends BaseSkeletonProps {
  hasAvatar?: boolean;
  lines?: number;
}

export function SkeletonCard({
  hasAvatar = true,
  lines = 3,
  className = '',
  variant = 'light',
}: CardSkeletonProps) {
  return (
    <div className={`skeleton-card ${className} skeleton--${variant}`}>
      {hasAvatar && <div className="skeleton-card__avatar" />}
      <div className="skeleton-card__content">
        <div className="skeleton-card__title" />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton-card__line" />
        ))}
      </div>
    </div>
  );
}

interface TableSkeletonProps extends BaseSkeletonProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = '',
  variant = 'light',
}: TableSkeletonProps) {
  return (
    <div className={`skeleton-table ${className} skeleton--${variant}`}>
      {/* Header */}
      <div className="skeleton-table__header">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="skeleton-table__cell" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table__row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-table__cell" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface ListSkeletonProps extends BaseSkeletonProps {
  items?: number;
  hasAvatar?: boolean;
}

export function SkeletonList({
  items = 5,
  hasAvatar = true,
  className = '',
  variant = 'light',
}: ListSkeletonProps) {
  return (
    <div className={`skeleton-list ${className} skeleton--${variant}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="skeleton-list__item">
          {hasAvatar && <div className="skeleton-list__avatar" />}
          <div className="skeleton-list__content">
            <div className="skeleton-list__title" />
            <div className="skeleton-list__subtitle" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ButtonSkeletonProps extends BaseSkeletonProps {
  width?: string | number;
  height?: string | number;
}

export function SkeletonButton({
  width,
  height,
  className = '',
  variant = 'light',
}: ButtonSkeletonProps) {
  return (
    <div
      className={`skeleton-button ${className} skeleton--${variant}`}
      style={{ width, height }}
    />
  );
}

interface InputSkeletonProps extends BaseSkeletonProps {
  width?: string | number;
  hasLabel?: boolean;
}

export function SkeletonInput({
  width,
  hasLabel = true,
  className = '',
  variant = 'light',
}: InputSkeletonProps) {
  return (
    <div className={`skeleton-input ${className} skeleton--${variant}`}>
      {hasLabel && <div className="skeleton-input__label" />}
      <div className="skeleton-input__field" style={{ width }} />
    </div>
  );
}

interface BlockSkeletonProps extends BaseSkeletonProps {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function SkeletonBlock({
  width,
  height,
  className = '',
  variant = 'light',
  style,
}: BlockSkeletonProps) {
  return (
    <div
      className={`skeleton-block ${className} skeleton--${variant}`}
      style={{ width, height, ...style }}
    />
  );
}

interface LoadingScreenProps {
  message?: string;
  icon?: ReactNode;
}

export function LoadingScreen({ message = 'Cargando...', icon }: LoadingScreenProps) {
  return (
    <div className="loading-screen">
      <div className="loading-screen__content">
        {icon || <div className="loading-screen__spinner" />}
        {message && <p className="loading-screen__message">{message}</p>}
      </div>
    </div>
  );
}
