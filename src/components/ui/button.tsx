import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Regra Estrita de UI:
 * - NUNCA quebrar em duas linhas (`flex-row flex-nowrap whitespace-nowrap shrink-0`)
 * - Sempre manter Ícone Lucide + Texto lado a lado na mesma linha horizontal
 */
const buttonVariants = cva(
  "inline-flex flex-row flex-nowrap items-center justify-center gap-2 whitespace-nowrap shrink-0 text-sm font-medium leading-none transition-all duration-200 bg-transparent border border-solid cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:-translate-y-[1px] [&_svg]:shrink-0 [&_svg]:inline-block",
  {
    variants: {
      variant: {
        primary:
          "border-[#DC2626] text-[#DC2626] hover:bg-[#FACBC2]/40 hover:shadow-[0_4px_14px_-4px_rgba(220,38,38,0.28)] focus-visible:ring-[#EE7870] dark:border-[#E85950] dark:text-[#F59B92] dark:hover:bg-[#DC2626]/20",
        secondary:
          "border-[#692296] text-[#692296] hover:bg-[#DEC5EF]/45 hover:shadow-[0_4px_14px_-4px_rgba(105,34,150,0.28)] focus-visible:ring-[#A466D1] dark:border-[#A466D1] dark:text-[#C59BE3] dark:hover:bg-[#692296]/25",
        income:
          "border-[#0CB853] text-[#0CB853] hover:bg-[#BCE5CB]/45 hover:shadow-[0_4px_14px_-4px_rgba(12,184,83,0.25)] focus-visible:ring-[#46C87D] dark:border-[#46C87D] dark:text-[#7BD6A0] dark:hover:bg-[#0CB853]/20",
        expense:
          "border-[#DF2929] text-[#DF2929] hover:bg-[#F9C5BD]/45 hover:shadow-[0_4px_14px_-4px_rgba(223,41,41,0.25)] focus-visible:ring-[#EC6862] dark:border-[#E54541] dark:text-[#F4948C] dark:hover:bg-[#DF2929]/20",
        warning:
          "border-[#EA920F] text-[#EA920F] hover:bg-[#EDE08D]/50 hover:shadow-[0_4px_14px_-4px_rgba(234,146,15,0.25)] focus-visible:ring-[#ECC023] dark:border-[#EDAD12] dark:text-[#ECD54A] dark:hover:bg-[#EA920F]/20",
        info:
          "border-[#2572CE] text-[#2572CE] hover:bg-[#BCD6F2]/45 hover:shadow-[0_4px_14px_-4px_rgba(37,114,206,0.25)] focus-visible:ring-[#65A2E6] dark:border-[#65A2E6] dark:text-[#8CB9EB] dark:hover:bg-[#2572CE]/20",
        neutral:
          "border-[#D4D4D8] text-[#3F3F46] hover:border-[#71717A] hover:bg-[#F4F4F5] focus-visible:ring-[#71717A]/30 dark:border-[#3F3F46] dark:text-[#D4D4D8] dark:hover:border-[#71717A] dark:hover:bg-[#3F3F46]/40",
        ghost:
          "border-transparent text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] focus-visible:ring-[#D4D4D8] dark:text-[#D4D4D8] dark:hover:bg-[#3F3F46]/40 dark:hover:text-white",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
        icon: "h-9 w-9 p-0",
      },
      shape: {
        rounded: "rounded-lg",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "rounded",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: LucideIcon;
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      icon: Icon,
      isLoading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          buttonVariants({ variant, size, shape, className }),
          isLoading && "[&>svg:not(.animate-spin)]:hidden"
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2
            className="h-4 w-4 shrink-0 animate-spin"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        ) : Icon ? (
          <Icon
            className="h-4 w-4 shrink-0"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        ) : null}
        {isLoading && loadingText ? (
          <span className="inline-flex flex-row flex-nowrap items-center gap-2 whitespace-nowrap">
            {loadingText}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
