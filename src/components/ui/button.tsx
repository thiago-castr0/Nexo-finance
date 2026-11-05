import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Regra Estrita de UI:
 * - Botões NUNCA usam glass/blur: fundo 100% sólido e nítido (#FFFFFF em Light, #18181B em Dark)
 *   para visibilidade perfeita de ícones Lucide e textos.
 * - NUNCA quebrar em duas linhas (`flex-row flex-nowrap whitespace-nowrap shrink-0`).
 * - Sempre manter Ícone Lucide + Texto lado a lado na mesma linha horizontal.
 */
const buttonVariants = cva(
  "inline-flex flex-row flex-nowrap items-center justify-center gap-2 whitespace-nowrap shrink-0 text-sm font-semibold leading-none transition-all duration-150 bg-[#FFFFFF] dark:bg-[#18181B] border border-solid cursor-pointer select-none shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:-translate-y-[1px] [&_svg]:shrink-0 [&_svg]:inline-block",
  {
    variants: {
      variant: {
        primary:
          "border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-[#FFFFFF] focus-visible:ring-[#EE7870] dark:border-[#E85950] dark:text-[#F59B92] dark:hover:bg-[#DC2626] dark:hover:text-[#FFFFFF]",
        secondary:
          "border-[#692296] text-[#692296] hover:bg-[#692296] hover:text-[#FFFFFF] focus-visible:ring-[#A466D1] dark:border-[#A466D1] dark:text-[#DEC5EF] dark:hover:bg-[#692296] dark:hover:text-[#FFFFFF]",
        income:
          "border-[#0CB853] text-[#0CB853] hover:bg-[#0CB853] hover:text-[#FFFFFF] focus-visible:ring-[#46C87D] dark:border-[#46C87D] dark:text-[#7BD6A0] dark:hover:bg-[#0CB853] dark:hover:text-[#FFFFFF]",
        expense:
          "border-[#DF2929] text-[#DF2929] hover:bg-[#DF2929] hover:text-[#FFFFFF] focus-visible:ring-[#EC6862] dark:border-[#E54541] dark:text-[#F4948C] dark:hover:bg-[#DF2929] dark:hover:text-[#FFFFFF]",
        warning:
          "border-[#EA920F] text-[#EA920F] hover:bg-[#EA920F] hover:text-[#FFFFFF] focus-visible:ring-[#ECC023] dark:border-[#EDAD12] dark:text-[#ECD54A] dark:hover:bg-[#EA920F] dark:hover:text-[#FFFFFF]",
        info:
          "border-[#2572CE] text-[#2572CE] hover:bg-[#2572CE] hover:text-[#FFFFFF] focus-visible:ring-[#65A2E6] dark:border-[#65A2E6] dark:text-[#8CB9EB] dark:hover:bg-[#2572CE] dark:hover:text-[#FFFFFF]",
        neutral:
          "border-[#D4D4D8] text-[#18181B] hover:border-[#692296] hover:text-[#692296] focus-visible:ring-[#71717A]/30 dark:border-[#3F3F46] dark:text-[#F4F4F5] dark:hover:border-[#A466D1] dark:hover:text-[#DEC5EF]",
        ghost:
          "border-transparent bg-transparent shadow-none text-[#3F3F46] hover:bg-[#F4F4F5] hover:text-[#18181B] focus-visible:ring-[#D4D4D8] dark:text-[#D4D4D8] dark:hover:bg-[#27272A] dark:hover:text-[#FFFFFF]",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
        icon: "h-9 w-9 p-0",
      },
      shape: {
        rounded: "rounded-xl",
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
