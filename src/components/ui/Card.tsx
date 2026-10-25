import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-150';

  const variantStyles = {
    default:
      'bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 shadow-sm dark:shadow-xl',
    elevated:
      'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 shadow-md dark:shadow-2xl',
    subtle: 'bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80',
  };

  const interactiveStyles = interactive
    ? 'hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
