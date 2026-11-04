import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex flex-row flex-nowrap items-center gap-1.5 whitespace-nowrap shrink-0 rounded-full border border-solid px-2.5 py-0.5 text-xs font-medium leading-none transition-colors [&_svg]:shrink-0 [&_svg]:inline-block",
  {
    variants: {
      variant: {
        brand:
          "border-[#F59B92] bg-[#FACBC2]/45 text-[#DC2626] dark:border-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#FACBC2]",
        purple:
          "border-[#C59BE3] bg-[#DEC5EF]/50 text-[#692296] dark:border-[#7E32B5] dark:bg-[#692296]/25 dark:text-[#DEC5EF]",
        income:
          "border-[#7BD6A0] bg-[#BCE5CB]/45 text-[#0CB853] dark:border-[#13BD5B] dark:bg-[#0CB853]/20 dark:text-[#BCE5CB]",
        expense:
          "border-[#F4948C] bg-[#F9C5BD]/45 text-[#DF2929] dark:border-[#E54541] dark:bg-[#DF2929]/20 dark:text-[#F9C5BD]",
        warning:
          "border-[#ECD54A] bg-[#EDE08D]/50 text-[#EA920F] dark:border-[#EDAD12] dark:bg-[#EA920F]/20 dark:text-[#EDE08D]",
        info:
          "border-[#8CB9EB] bg-[#BCD6F2]/50 text-[#2572CE] dark:border-[#448BDE] dark:bg-[#2572CE]/20 dark:text-[#BCD6F2]",
        neutral:
          "border-[#E4E4E7] bg-[#F4F4F5] text-[#3F3F46] dark:border-[#3F3F46] dark:bg-[#18181B] dark:text-[#D4D4D8]",
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
