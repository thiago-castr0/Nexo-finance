import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border border-solid px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        brand:
          "border-rose-200 bg-rose-50/70 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
        purple:
          "border-violet-200 bg-violet-50/70 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
        income:
          "border-emerald-200 bg-emerald-50/70 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
        expense:
          "border-red-200 bg-red-50/70 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
        warning:
          "border-amber-200 bg-amber-50/70 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
        info:
          "border-blue-200 bg-blue-50/70 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
        neutral:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: LucideIcon;
}

export function Badge({
  className,
  variant,
  icon: Icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {Icon ? (
        <Icon className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}
