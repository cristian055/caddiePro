import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'default' | 'ghost';
  children: React.ReactNode;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({ variant = 'default', children, className = '', ...rest }) => {
  const base = variant === 'primary' ? 'btn btn-primary' : variant === 'ghost' ? 'btn btn-ghost' : 'btn';
  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
