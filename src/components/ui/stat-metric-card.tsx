import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { type SemanticIntent } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

export interface StatMetricCardProps {
  title: string;
  value: string;
  trendLabel: string;
  trendIcon?: LucideIcon;
  icon: LucideIcon;
  intent: SemanticIntent;
  progressValue: number;
  progressLabel: string;
  progressRightLabel: string;
  sparklinePoints?: number[];
  footerText?: string;
  className?: string;
}

const iconContainerMap: Record<SemanticIntent, string> = {
  neutral: "bg-[#18181B] text-[#FFFFFF]",
  brand: "bg-[#DC2626] text-[#FFFFFF]",
  ai: "bg-[#692296] text-[#FFFFFF]",
  income: "bg-[#0CB853] text-[#FFFFFF]",
  expense: "bg-[#DF2929] text-[#FFFFFF]",
  warning: "bg-[#EA920F] text-[#FFFFFF]",
  info: "bg-[#2572CE] text-[#FFFFFF]",
};

const sparklineColorMap: Record<SemanticIntent, string> = {
  neutral: "#71717A",
  brand: "#DC2626",
  ai: "#692296",
  income: "#0CB853",
  expense: "#DF2929",
  warning: "#EA920F",
  info: "#2572CE",
};

const badgeVariantMap: Record<
  SemanticIntent,
  "brand" | "purple" | "income" | "expense" | "warning" | "info" | "neutral"
> = {
  neutral: "neutral",
  brand: "brand",
  ai: "purple",
  income: "income",
  expense: "expense",
  warning: "warning",
  info: "info",
};

const progressVariantMap: Record<
  SemanticIntent,
  "red" | "purple" | "success" | "danger" | "alert" | "info" | "gradient"
> = {
  neutral: "info",
  brand: "gradient",
  ai: "purple",
  income: "success",
  expense: "danger",
  warning: "alert",
  info: "info",
};

/**
 * Card de KPI com Superfície Nítida e Sólida para leitura perfeita de números, ícones e Sparkline.
 */
export function StatMetricCard({
  title,
  value,
  trendLabel,
  trendIcon,
  icon: Icon,
  intent,
  progressValue,
  progressLabel,
  progressRightLabel,
  sparklinePoints = [28, 42, 36, 58, 52, 74, 88],
  footerText,
  className,
}: StatMetricCardProps) {
  const maxPt = Math.max(...sparklinePoints, 1);
  const minPt = Math.min(...sparklinePoints, 0);
  const range = Math.max(maxPt - minPt, 1);

  const polylinePoints = sparklinePoints
    .map((pt, idx) => {
      const x = (idx / Math.max(sparklinePoints.length - 1, 1)) * 100;
      const y = 28 - ((pt - minPt) / range) * 22;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-3.5 rounded-2xl border border-[#D4D4D8] bg-[#FFFFFF] p-4 shadow-xs transition-transform duration-150 hover:-translate-y-0.5 dark:border-[#3F3F46] dark:bg-[#09090B]",
        className
      )}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#71717A] dark:text-[#A1A1AA]">
            {title}
          </span>
          <p
            className={cn(
              "text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums",
              intent === "income"
                ? "text-[#0CB853]"
                : intent === "expense"
                  ? "text-[#DF2929]"
                  : "text-[#18181B] dark:text-[#FFFFFF]"
            )}
          >
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs",
            iconContainerMap[intent]
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </div>
      </div>

      {/* Sparkline + Trend Badge Row */}
      <div className="flex items-center justify-between gap-3">
        <Badge variant={badgeVariantMap[intent]} icon={trendIcon}>
          {trendLabel}
        </Badge>

        <svg
          width="88"
          height="28"
          viewBox="0 0 100 30"
          className="overflow-visible shrink-0"
          aria-hidden="true"
        >
          <polyline
            fill="none"
            stroke={sparklineColorMap[intent]}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />
        </svg>
      </div>

      {/* Progress Bar & Footer */}
      <div className="space-y-1.5 border-t border-[#E4E4E7] pt-2.5 dark:border-[#27272A]">
        <ProgressBar
          value={progressValue}
          variant={progressVariantMap[intent]}
          size="sm"
          label={progressLabel}
          valueLabel={progressRightLabel}
        />
        {footerText ? (
          <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA] truncate">
            {footerText}
          </p>
        ) : null}
      </div>
    </div>
  );
}
