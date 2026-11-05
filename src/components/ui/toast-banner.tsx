import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SemanticIntent } from "@/components/ui/glass-panel";

export interface NotificationBannerProps {
  title: string;
  description: string;
  icon: LucideIcon;
  intent?: SemanticIntent;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  className?: string;
}

const bannerStyles: Record<SemanticIntent, string> = {
  neutral:
    "border-[#E4E4E7] bg-[var(--surface-glass-md)] text-[var(--text-primary)]",
  brand:
    "border-[#F59B92] bg-[#FACBC2]/25 dark:border-[#DC2626]/45 dark:bg-[#DC2626]/12 text-[var(--text-primary)]",
  ai: "border-[#C59BE3] bg-[#DEC5EF]/30 dark:border-[#7E32B5]/50 dark:bg-[#692296]/15 text-[var(--text-primary)]",
  income:
    "border-[#7BD6A0] bg-[#BCE5CB]/30 dark:border-[#0CB853]/45 dark:bg-[#0CB853]/12 text-[var(--text-primary)]",
  expense:
    "border-[#F4948C] bg-[#F9C5BD]/30 dark:border-[#DF2929]/45 dark:bg-[#DF2929]/12 text-[var(--text-primary)]",
  warning:
    "border-[#ECD54A] bg-[#EDE08D]/35 dark:border-[#EA920F]/45 dark:bg-[#EA920F]/14 text-[var(--text-primary)]",
  info: "border-[#8CB9EB] bg-[#BCD6F2]/30 dark:border-[#2572CE]/45 dark:bg-[#2572CE]/14 text-[var(--text-primary)]",
};

const iconAccentStyles: Record<SemanticIntent, string> = {
  neutral: "text-[#3F3F46] dark:text-[#D4D4D8] border-[#E4E4E7] bg-white/80 dark:bg-white/10",
  brand: "text-[#DC2626] border-[#F59B92] bg-white/80 dark:bg-[#DC2626]/20 dark:text-[#FACBC2]",
  ai: "text-[#692296] border-[#C59BE3] bg-white/80 dark:bg-[#692296]/25 dark:text-[#DEC5EF]",
  income: "text-[#0CB853] border-[#7BD6A0] bg-white/80 dark:bg-[#0CB853]/20 dark:text-[#BCE5CB]",
  expense: "text-[#DF2929] border-[#F4948C] bg-white/80 dark:bg-[#DF2929]/20 dark:text-[#F9C5BD]",
  warning: "text-[#EA920F] border-[#ECD54A] bg-white/80 dark:bg-[#EA920F]/20 dark:text-[#EDE08D]",
  info: "text-[#2572CE] border-[#8CB9EB] bg-white/80 dark:bg-[#2572CE]/20 dark:text-[#BCD6F2]",
};

const buttonVariantMap: Record<
  SemanticIntent,
  "primary" | "secondary" | "income" | "expense" | "warning" | "info" | "neutral"
> = {
  neutral: "neutral",
  brand: "primary",
  ai: "secondary",
  income: "income",
  expense: "expense",
  warning: "warning",
  info: "info",
};

/**
 * Banner de Notificação / Alerta em Vidro Fosco Semântico
 */
export function NotificationBanner({
  title,
  description,
  icon: Icon,
  intent = "ai",
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  className,
}: NotificationBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-solid p-4 backdrop-blur-xl shadow-[inset_0_1px_0_0_var(--border-specular-inset)] transition-all",
        bannerStyles[intent],
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-solid",
            iconAccentStyles[intent]
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--text-primary)]">{title}</p>
          <p className="text-xs text-[var(--text-secondary)]">{description}</p>
        </div>
      </div>

      {actionLabel && onAction ? (
        <Button
          variant={buttonVariantMap[intent]}
          size="sm"
          icon={ActionIcon}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
