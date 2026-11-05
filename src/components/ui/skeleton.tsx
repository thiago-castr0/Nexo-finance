import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

/**
 * Placeholder Shimmer Translúcido para Estados de Carregamento de IA e Tabelas
 */
export function SkeletonGlass({
  lines = 3,
  className,
  ...props
}: SkeletonGlassProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "space-y-3 rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass-sm)] p-4 backdrop-blur-lg",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="h-4 w-1/3 animate-pulse rounded-lg bg-[#D4D4D8]/60 dark:bg-white/15" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-[#DEC5EF]/60 dark:bg-[#692296]/30" />
      </div>
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "h-3 animate-pulse rounded-md bg-[#E4E4E7]/80 dark:bg-white/10",
            idx === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}
