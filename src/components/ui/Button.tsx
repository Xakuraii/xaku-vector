import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-xs sm:text-sm px-4 py-2 gap-2',
      lg: 'text-sm sm:text-base px-5 py-2.5 sm:py-3 gap-2.5 font-semibold',
    };

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-md shadow-red-950/20 active:translate-y-px',
      secondary:
        'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-zinc-100 dark:border-zinc-700/80',
      outline:
        'border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200',
      ghost:
        'hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
      danger:
        'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:text-red-400 dark:border-red-900/40',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
