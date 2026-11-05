"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterChipOption<T extends string = string> {
  id: T;
  label: string;
  icon: LucideIcon;
  count?: number;
  intent?: "neutral" | "brand" | "ai" | "income" | "expense";
}

export interface FilterChipGroupProps<T extends string = string> {
  options: ReadonlyArray<FilterChipOption<T>>;
  value: T;
  onChange: (next: T) => void;
  className?: string;
}

const activeChipStyles = {
  neutral:
    "border-[#18181B] bg-[#18181B] text-[#FFFFFF] dark:border-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#09090B]",
  brand:
    "border-[#DC2626] bg-[#DC2626] text-[#FFFFFF]",
  ai: "border-[#692296] bg-[#692296] text-[#FFFFFF]",
  income:
    "border-[#0CB853] bg-[#0CB853] text-[#FFFFFF]",
  expense:
    "border-[#DF2929] bg-[#DF2929] text-[#FFFFFF]",
} as const;

/**
 * Chips de Filtro Rápido Sólidos e Nítidos (Sem glass nos elementos internos)
 */
export function FilterChipGroup<T extends string = string>({
  options,
  value,
  onChange,
  className,
}: FilterChipGroupProps<T>) {
  return (
    <div
      role="group"
      className={cn("inline-flex flex-wrap items-center gap-2", className)}
    >
      {options.map((chip) => {
        const Icon = chip.icon;
        const isActive = chip.id === value;
        const intent = chip.intent || "brand";

        return (
          <button
            key={chip.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(chip.id)}
            className={cn(
              "inline-flex flex-row flex-nowrap items-center gap-1.5 whitespace-nowrap shrink-0 rounded-xl border border-solid px-3.5 py-2 text-xs font-bold leading-none transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7870] [&_svg]:shrink-0 [&_svg]:inline-block",
              isActive
                ? activeChipStyles[intent]
                : "border-[#D4D4D8] bg-[#FFFFFF] text-[#18181B] hover:border-[#692296] hover:text-[#692296] dark:border-[#3F3F46] dark:bg-[#18181B] dark:text-[#F4F4F5] dark:hover:border-[#A466D1]"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span>{chip.label}</span>
            {chip.count !== undefined ? (
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-[#F4F4F5] text-[#18181B] dark:bg-[#27272A] dark:text-[#F4F4F5]"
                )}
              >
                {chip.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
