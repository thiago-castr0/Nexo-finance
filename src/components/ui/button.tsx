import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 bg-transparent border border-solid cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]",
  {
    variants: {
      variant: {
        primary:
          "border-rose-600 text-rose-600 hover:bg-rose-50/80 focus-visible:ring-rose-500/40 dark:border-rose-500 dark:text-rose-400 dark:hover:bg-rose-950/40",
        secondary:
          "border-violet-600 text-violet-600 hover:bg-violet-50/80 focus-visible:ring-violet-500/40 dark:border-violet-500 dark:text-violet-400 dark:hover:bg-violet-950/40",
        income:
          "border-emerald-600 text-emerald-700 hover:bg-emerald-50/80 focus-visible:ring-emerald-500/40 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/40",
        expense:
          "border-red-600 text-red-600 hover:bg-red-50/80 focus-visible:ring-red-500/40 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/40",
        warning:
          "border-amber-600 text-amber-700 hover:bg-amber-50/80 focus-visible:ring-amber-500/40 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950/40",
        info:
          "border-blue-600 text-blue-600 hover:bg-blue-50/80 focus-visible:ring-blue-500/40 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/40",
        neutral:
          "border-slate-300 text-slate-700 hover:bg-slate-100/70 focus-visible:ring-slate-400/40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800/50",
        ghost:
          "border-transparent text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 focus-visible:ring-slate-400/40 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-5 text-base",
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
        className={cn(buttonVariants({ variant, size, shape, className }))}
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
        {isLoading && loadingText ? loadingText : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
