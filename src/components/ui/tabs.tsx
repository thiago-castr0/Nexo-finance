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
 * Abas Segmentadas Nítidas e Sólidas (Sem glass nos botões internos para máxima legibilidade)
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
        "inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-[#D4D4D8] bg-[#F4F4F5] p-1 dark:border-[#3F3F46] dark:bg-[#09090B]",
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
              "inline-flex flex-row flex-nowrap items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border px-3.5 py-2 text-xs font-bold leading-none transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7870] [&_svg]:shrink-0 [&_svg]:inline-block",
              isActive
                ? variant === "brand"
                  ? "border-[#DC2626] bg-[#FFFFFF] text-[#DC2626] shadow-xs dark:border-[#E85950] dark:bg-[#18181B] dark:text-[#FACBC2]"
                  : "border-[#692296] bg-[#FFFFFF] text-[#692296] shadow-xs dark:border-[#A466D1] dark:bg-[#18181B] dark:text-[#DEC5EF]"
                : "border-transparent bg-transparent text-[#3F3F46] hover:bg-[#FFFFFF]/80 hover:text-[#18181B] dark:text-[#D4D4D8] dark:hover:bg-[#18181B] dark:hover:text-[#FFFFFF]"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span className="whitespace-nowrap">{option.label}</span>
            {option.badge !== undefined ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  isActive
                    ? variant === "brand"
                      ? "bg-[#FACBC2] text-[#18181B]"
                      : "bg-[#DEC5EF] text-[#18181B]"
                    : "bg-[#E4E4E7] text-[#18181B] dark:bg-[#27272A] dark:text-[#F4F4F5]"
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
