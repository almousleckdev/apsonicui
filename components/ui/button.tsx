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
      variant = "brand",
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
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-xl cursor-pointer";

    const variants = {
      primary: "bg-brand-green text-white hover:bg-green-700 active:scale-[0.98] shadow-md shadow-brand-green/20",
      secondary: "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200/80 active:scale-[0.98]",
      outline: "bg-transparent text-zinc-700 border border-zinc-300 hover:bg-zinc-100 active:scale-[0.98]",
      ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
      brand: "bg-brand-green text-white hover:bg-green-700 active:scale-[0.98] shadow-lg shadow-brand-green/20",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-xs tracking-wider uppercase",
      lg: "h-12 px-6 text-sm tracking-wider uppercase",
      xl: "h-14 px-8 text-sm tracking-wider uppercase",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : icon && iconPosition === "left" ? (
          <span className="mr-1.5">{icon}</span>
        ) : null}
        {children}
        {!loading && icon && iconPosition === "right" ? (
          <span className="ml-1.5">{icon}</span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = "Button";
