"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface RadioOptionProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  name: string;
  className?: string;
  textColor?: string;
}

export const RadioOption: React.FC<RadioOptionProps> = ({
  value,
  label,
  checked,
  onChange,
  name,
  className,
  textColor,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange();
    }
  };

  return (
    <label
      className={cn("flex items-center cursor-pointer select-none outline-none group", className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="checkbox"
      aria-checked={checked}
    >
      <div
        className="mr-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all bg-white/10 group-focus-visible:ring-2 group-focus-visible:ring-brand-green"
        style={{
          borderColor: checked ? "#1fa84f" : textColor || "rgba(255,255,255,0.2)",
          backgroundColor: checked ? "#1fa84f" : "transparent",
        }}
      >
        {checked && (
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        )}
      </div>
      <span
        className="font-semibold text-sm transition-colors duration-200"
        style={{
          color: textColor || "rgba(255,255,255,0.7)",
        }}
      >
        {label}
      </span>
    </label>
  );
};
