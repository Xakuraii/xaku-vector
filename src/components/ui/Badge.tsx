import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'amber' | 'crimson' | 'muted';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  icon,
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border';

  const variantStyles = {
    default:
      'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    success:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
    amber:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    crimson:
      'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
    muted: 'bg-zinc-100/60 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-transparent',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {icon}
      {children}
    </span>
  );
};
