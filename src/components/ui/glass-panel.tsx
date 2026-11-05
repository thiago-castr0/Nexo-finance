import * as React from "react";
import { cn } from "@/lib/utils";

export type SemanticIntent =
  | "neutral"
  | "brand"
  | "ai"
  | "income"
  | "expense"
  | "warning"
  | "info";

export type GlassSurfaceTone =
  | "white-glass"
  | "purple-glass"
  | "red-glass"
  | "brand-stage";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  intent?: SemanticIntent;
  tone?: GlassSurfaceTone;
  blur?: "sm" | "md" | "xl" | "2xl";
  topBeam?: boolean;
  interactive?: boolean;
}

const blurMap = {
  sm: "backdrop-blur-md",
  md: "backdrop-blur-xl",
  xl: "backdrop-blur-2xl",
  "2xl": "backdrop-blur-3xl",
} as const;

const topBeamMap: Record<SemanticIntent, string> = {
  neutral: "from-[#E4E4E7] via-[#D4D4D8] to-transparent dark:from-white/20 dark:to-transparent",
  brand: "from-[#DC2626] via-[#E85950] to-[#692296]",
  ai: "from-[#692296] via-[#A466D1] to-[#DC2626]",
  income: "from-[#0CB853] via-[#46C87D] to-transparent",
  expense: "from-[#DF2929] via-[#EC6862] to-transparent",
  warning: "from-[#EA920F] via-[#ECC023] to-transparent",
  info: "from-[#2572CE] via-[#65A2E6] to-transparent",
};

/**
 * Container Glass Clean & Moderno (Estilo iOS):
 * - Light Mode: Vidro branco limpo e translúcido (bg-white/80), borda sutil 1px e sombra leve.
 * - Dark Mode: Vidro escuro elegante (bg-[#141419]/80) com borda especular fina (border-white/10).
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      className,
      intent = "neutral",
      blur = "xl",
      topBeam = true,
      interactive = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-white/90 bg-white/80 text-[#18181B] shadow-[0_8px_32px_-4px_rgba(24,24,27,0.06),0_2px_6px_-1px_rgba(24,24,27,0.03)] ring-1 ring-[#E4E4E7]/80 transition-all duration-200 dark:border-white/10 dark:bg-[#141419]/80 dark:text-[#F4F4F5] dark:ring-white/5 dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.55)]",
          blurMap[blur],
          interactive && "nexo-card-hover",
          className
        )}
        {...props}
      >
        {topBeam ? (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
              topBeamMap[intent]
            )}
          />
        ) : null}
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";
