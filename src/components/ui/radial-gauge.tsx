import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadialGaugeProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
  variant?: "brand" | "ai" | "income" | "expense" | "warning" | "info";
  className?: string;
}

const strokeColors = {
  brand: "#DC2626",
  ai: "#692296",
  income: "#0CB853",
  expense: "#DF2929",
  warning: "#EA920F",
  info: "#2572CE",
} as const;

/**
 * Anel Circular Futurista (Estilo Apple WatchOS / iOS Health Ring)
 * para exibir Score de Saúde Financeira e Metas de Orçamento.
 */
export function RadialGauge({
  value,
  max = 100,
  size = 112,
  strokeWidth = 9,
  label,
  sublabel,
  variant = "income",
  className,
}: RadialGaugeProps) {
  const gradientId = React.useId();
  const normalized = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center text-center",
        className
      )}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 transform"
          role="img"
          aria-label={`${label}: ${normalized}%`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={strokeColors[variant]} />
              <stop
                offset="100%"
                stopColor={variant === "brand" ? "#692296" : variant === "ai" ? "#DC2626" : strokeColors[variant]}
              />
            </linearGradient>
          </defs>

          {/* Trilha de fundo translúcida */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-[#E4E4E7] dark:text-white/10"
          />

          {/* Arco ativo luminoso */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums">
            {normalized}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Score
          </span>
        </div>
      </div>

      <span className="mt-2 text-xs font-bold text-[var(--text-primary)] whitespace-nowrap">
        {label}
      </span>
      {sublabel ? (
        <span className="text-[11px] text-[var(--text-muted)] whitespace-nowrap">
          {sublabel}
        </span>
      ) : null}
    </div>
  );
}
