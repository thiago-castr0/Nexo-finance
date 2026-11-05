import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Badges Semânticos Sólidos e Nítidos (Sem blur/glass para leitura perfeita de ícones e textos)
 */
const badgeVariants = cva(
  "inline-flex flex-row flex-nowrap items-center gap-1.5 whitespace-nowrap shrink-0 rounded-full border border-solid px-2.5 py-1 text-xs font-semibold leading-none transition-colors [&_svg]:shrink-0 [&_svg]:inline-block",
  {
    variants: {
      variant: {
        brand:
          "border-[#DC2626] bg-[#FACBC2] text-[#18181B] dark:border-[#E85950] dark:bg-[#DC2626] dark:text-[#FFFFFF]",
        purple:
          "border-[#692296] bg-[#DEC5EF] text-[#18181B] dark:border-[#A466D1] dark:bg-[#692296] dark:text-[#FFFFFF]",
        income:
          "border-[#0CB853] bg-[#BCE5CB] text-[#18181B] dark:border-[#46C87D] dark:bg-[#0CB853] dark:text-[#FFFFFF]",
        expense:
          "border-[#DF2929] bg-[#F9C5BD] text-[#18181B] dark:border-[#EC6862] dark:bg-[#DF2929] dark:text-[#FFFFFF]",
        warning:
          "border-[#EA920F] bg-[#EDE08D] text-[#18181B] dark:border-[#ECC023] dark:bg-[#EA920F] dark:text-[#FFFFFF]",
        info:
          "border-[#2572CE] bg-[#BCD6F2] text-[#18181B] dark:border-[#65A2E6] dark:bg-[#2572CE] dark:text-[#FFFFFF]",
        neutral:
          "border-[#D4D4D8] bg-[#FFFFFF] text-[#18181B] dark:border-[#3F3F46] dark:bg-[#18181B] dark:text-[#F4F4F5]",
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
        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}
