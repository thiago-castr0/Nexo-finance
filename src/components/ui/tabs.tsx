"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface SegmentedTabsProps<T extends string = string> {
  options: ReadonlyArray<TabOption<T>>;
  value: T;
  onChange: (next: T) => void;
  variant?: "brand" | "purple";
  className?: string;
}

/**
 * Componente de Abas Segmentadas em Linha Única (Ícone Lucide + Texto)
 */
export function SegmentedTabs<T extends string = string>({
  options,
  value,
  onChange,
  variant = "brand",
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E4E4E7] bg-[#F4F4F5]/90 p-1 dark:border-[#3F3F46] dark:bg-[#09090B]/90",
        className
      )}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = option.id === value;

        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "inline-flex flex-nowrap items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold leading-none transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7870]",
              isActive
                ? variant === "brand"
                  ? "border-[#F59B92] bg-[#FFFFFF] text-[#DC2626] shadow-2xs dark:border-[#DC2626] dark:bg-[#18181B] dark:text-[#FACBC2]"
                  : "border-[#C59BE3] bg-[#FFFFFF] text-[#692296] shadow-2xs dark:border-[#7E32B5] dark:bg-[#18181B] dark:text-[#DEC5EF]"
                : "border-transparent bg-transparent text-[#71717A] hover:text-[#18181B] dark:text-[#D4D4D8] dark:hover:text-[#FFFFFF]"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span className="whitespace-nowrap">{option.label}</span>
            {option.badge !== undefined ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  isActive
                    ? variant === "brand"
                      ? "bg-[#FACBC2]/60 text-[#DC2626] dark:bg-[#DC2626]/30 dark:text-[#FACBC2]"
                      : "bg-[#DEC5EF]/60 text-[#692296] dark:bg-[#692296]/30 dark:text-[#DEC5EF]"
                    : "bg-[#E4E4E7] text-[#3F3F46] dark:bg-[#3F3F46] dark:text-[#D4D4D8]"
                )}
              >
                {option.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
