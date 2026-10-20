import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'dark';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      icon,
      variant = 'default',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isDark = variant === 'dark';

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-xs font-bold uppercase tracking-widest',
              isDark ? 'text-white/80' : 'text-zinc-500'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div
              className={cn(
                'absolute left-4 flex items-center justify-center pointer-events-none text-base transition-colors z-10',
                isDark ? 'text-white/50' : 'text-zinc-400'
              )}
            >
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full text-xs sm:text-sm font-semibold rounded-2xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
              icon ? 'pl-11 pr-4' : 'px-5',
              'py-3.5 h-12',
              isDark
                ? 'bg-white/10 text-white placeholder-white/40 border border-white/15 focus:border-brand-green/80 focus:ring-2 focus:ring-brand-green/30 focus:bg-white/15'
                : 'bg-zinc-50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20',
              error && (isDark ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-red-500 focus:border-red-500 focus:ring-red-500/20'),
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className={cn('text-xs font-semibold mt-1 pl-1', isDark ? 'text-red-300' : 'text-red-500')}>{error}</p>
        ) : helperText ? (
          <p className={cn('text-xs mt-1 pl-1', isDark ? 'text-white/50' : 'text-zinc-500')}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
