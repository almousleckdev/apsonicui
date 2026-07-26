import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "brand";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg cursor-pointer";

    const variants = {
      primary: "bg-zinc-900 text-white hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-zinc-50 dark:text-black dark:hover:bg-white",
      secondary: "bg-zinc-100 text-zinc-900 border border-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700",
      outline: "bg-transparent text-zinc-900 border border-zinc-900 hover:bg-zinc-900/5 dark:text-white dark:border-white dark:hover:bg-white/5",
      ghost: "bg-transparent text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800",
      brand: "bg-brand-green hover:bg-brand-green/90 active:scale-[0.98] text-white font-bold rounded-full shadow-lg shadow-brand-green/25 hover:shadow-brand-green/40",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-6 text-base",
      xl: "h-14 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : icon && iconPosition === "left" ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        {children}
        {!loading && icon && iconPosition === "right" ? (
          <span className="ml-2">{icon}</span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = "Button";
