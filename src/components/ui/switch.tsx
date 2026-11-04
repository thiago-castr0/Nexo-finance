"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  variant?: "brand" | "purple" | "success" | "info";
  disabled?: boolean;
  className?: string;
}

const variantTrackClasses = {
  brand: "bg-[#DC2626] border-[#DC2626]",
  purple: "bg-[#692296] border-[#692296]",
  success: "bg-[#0CB853] border-[#0CB853]",
  info: "bg-[#2572CE] border-[#2572CE]",
} as const;

export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  variant = "brand",
  disabled = false,
  className,
}: SwitchProps) {
  const id = React.useId();

  return (
    <div
      className={cn(
        "inline-flex items-center justify-between gap-3",
        className
      )}
    >
      {label || description ? (
        <div className="space-y-0.5">
          {label ? (
            <label
              htmlFor={id}
              className="cursor-pointer whitespace-nowrap text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5]"
            >
              {label}
            </label>
          ) : null}
          {description ? (
            <p className="text-[11px] text-[#71717A] dark:text-[#D4D4D8]">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || "Alternar opção"}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-solid transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7870] disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? variantTrackClasses[variant]
            : "border-[#D4D4D8] bg-[#E4E4E7] dark:border-[#3F3F46] dark:bg-[#3F3F46]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#FFFFFF] shadow-xs transition-transform duration-200",
            checked ? "translate-x-5.5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

export interface ThemeSwitchProps {
  darkMode: boolean;
  onToggle: (nextDark: boolean) => void;
  className?: string;
}

/**
 * Switch dedicado para alternância entre Light Mode e Dark Mode
 * com ícones Lucide Sun e Moon + indicação visual clara.
 */
export function ThemeSwitch({
  darkMode,
  onToggle,
  className,
}: ThemeSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={darkMode}
      aria-label={
        darkMode ? "Ativar modo claro (Light Mode)" : "Ativar modo escuro (Dark Mode)"
      }
      onClick={() => onToggle(!darkMode)}
      className={cn(
        "group inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-solid px-2.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A466D1]",
        darkMode
          ? "border-[#7E32B5] bg-[#18181B] text-[#DEC5EF] hover:border-[#A466D1]"
          : "border-[#E4E4E7] bg-[#FFFFFF] text-[#3F3F46] hover:border-[#D4D4D8]",
        className
      )}
    >
      <div className="relative flex h-5 w-9 items-center rounded-full border border-[#D4D4D8] bg-[#F4F4F5] p-0.5 transition-colors dark:border-[#7E32B5] dark:bg-[#692296]/40">
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full transition-transform duration-200",
            darkMode
              ? "translate-x-3.5 bg-[#692296] text-[#FFFFFF]"
              : "translate-x-0 bg-[#DC2626] text-[#FFFFFF]"
          )}
        >
          {darkMode ? (
            <Moon className="h-2.5 w-2.5" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Sun className="h-2.5 w-2.5" strokeWidth={1.75} aria-hidden="true" />
          )}
        </span>
      </div>
      <span className="whitespace-nowrap text-[11px] font-semibold">
        {darkMode ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
}
