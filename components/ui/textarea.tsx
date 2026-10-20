import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: "default" | "dark";
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, variant = "default", ...props }, ref) => {
    const isDark = variant === "dark";

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "block text-xs font-bold uppercase tracking-widest",
              isDark ? "text-white/80" : "text-zinc-500"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              "flex w-full px-5 py-3.5 text-xs sm:text-sm font-semibold min-h-[120px] transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              "rounded-2xl border",
              isDark
                ? cn(
                    "bg-zinc-900 text-white placeholder-zinc-500",
                    error
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/20"
                      : "border-zinc-800 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                  )
                : cn(
                    "bg-zinc-50 text-zinc-900 placeholder-zinc-400 border border-zinc-200",
                    error
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/20"
                      : "focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"
                  ),
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 font-semibold pl-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
