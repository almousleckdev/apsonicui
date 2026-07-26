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
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "mb-2 block text-xs font-bold uppercase tracking-widest",
              isDark ? "text-zinc-400" : "text-zinc-600"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              "flex w-full px-4 py-3.5 text-xs sm:text-sm min-h-[120px] transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
              "rounded-2xl border",
              isDark
                ? cn(
                    "bg-zinc-900/60 text-white placeholder-zinc-500",
                    error
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/20"
                      : "border-zinc-800 hover:border-zinc-700 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                  )
                : cn(
                    "bg-zinc-50 text-zinc-900 placeholder-zinc-400",
                    error
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/20"
                      : "border-zinc-200 hover:border-zinc-300 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                  ),
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-semibold pl-1 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
