import * as React from "react";
import { AlertCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  helperText?: string;
  tabularNums?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      icon: Icon,
      error,
      helperText,
      tabularNums = false,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#3F3F46] dark:text-[#D4D4D8]"
          >
            {label}
          </label>
        ) : null}

        <div className="relative flex items-center">
          {Icon ? (
            <Icon
              className={cn(
                "pointer-events-none absolute left-3 h-4 w-4 shrink-0 transition-colors",
                error
                  ? "text-[#DF2929]"
                  : "text-[#71717A] dark:text-[#D4D4D8]"
              )}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          ) : null}

          <input
            id={inputId}
            ref={ref}
            type={type}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "flex h-10 w-full rounded-lg border border-solid bg-[#FFFFFF] px-3 py-2 text-sm text-[#18181B] transition-all duration-150 placeholder:text-[#71717A] hover:border-[#D4D4D8] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#18181B] dark:text-[#F4F4F5] dark:placeholder:text-[#71717A] dark:hover:border-[#71717A]",
              Icon && "pl-9",
              error && "pr-9",
              tabularNums && "tabular-nums",
              error
                ? "border-[#DF2929] focus-visible:border-[#DF2929] focus-visible:ring-2 focus-visible:ring-[#F9C5BD] dark:border-[#E54541]"
                : "border-[#E4E4E7] focus-visible:border-[#DC2626] focus-visible:ring-2 focus-visible:ring-[#FACBC2]/70 dark:border-[#3F3F46] dark:focus-visible:border-[#E85950]",
              className
            )}
            {...props}
          />

          {error ? (
            <AlertCircle
              className="pointer-events-none absolute right-3 h-4 w-4 shrink-0 text-[#DF2929]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          ) : null}
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs font-medium text-[#DF2929] dark:text-[#F4948C]"
          >
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className="text-xs text-[#71717A] dark:text-[#D4D4D8]"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
