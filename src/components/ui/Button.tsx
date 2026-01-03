import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'default';
  children: React.ReactNode;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({ variant = 'default', children, className = '', ...rest }) => {
  const base = variant === 'primary' ? 'btn btn-primary' : 'btn';
  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
