import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  valueLabel?: string;
  variant?: "red" | "purple" | "success" | "danger" | "alert" | "info" | "gradient";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const barColorClasses = {
  red: "bg-[#DC2626]",
  purple: "bg-[#692296]",
  success: "bg-[#0CB853]",
  danger: "bg-[#DF2929]",
  alert: "bg-[#EA920F]",
  info: "bg-[#2572CE]",
  gradient: "bg-gradient-to-r from-[#DC2626] via-[#7E32B5] to-[#692296]",
} as const;

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
} as const;

export function ProgressBar({
  value,
  max = 100,
  label,
  valueLabel,
  variant = "gradient",
  size = "md",
  className,
}: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, Math.round((value / max) * 100)));

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label || valueLabel ? (
        <div className="flex items-center justify-between gap-2 text-xs">
          {label ? (
            <span className="truncate font-medium text-[#3F3F46] dark:text-[#D4D4D8]">
              {label}
            </span>
          ) : null}
          {valueLabel ? (
            <span className="whitespace-nowrap font-semibold text-[#18181B] tabular-nums dark:text-[#FFFFFF]">
              {valueLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Barra de progresso"}
        className={cn(
          "w-full overflow-hidden rounded-full bg-[#F4F4F5] border border-[#E4E4E7] dark:bg-[#09090B] dark:border-[#3F3F46]",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            barColorClasses[variant]
          )}
          style={{ width: `${Math.max(percentage, 3)}%` }}
        />
      </div>
    </div>
  );
}
