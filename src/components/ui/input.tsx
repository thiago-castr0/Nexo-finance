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
            className="block text-xs font-medium text-slate-700 dark:text-zinc-300"
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
                  ? "text-red-500"
                  : "text-slate-400 dark:text-zinc-500"
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
              "flex h-10 w-full rounded-lg border border-solid bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
              Icon && "pl-9",
              error && "pr-9",
              tabularNums && "tabular-nums",
              error
                ? "border-red-500 focus-visible:border-red-600 focus-visible:ring-2 focus-visible:ring-red-500/20 dark:border-red-500"
                : "border-slate-200 focus-visible:border-rose-500 focus-visible:ring-2 focus-visible:ring-rose-500/20 dark:border-zinc-800 dark:focus-visible:border-rose-500",
              className
            )}
            {...props}
          />

          {error ? (
            <AlertCircle
              className="pointer-events-none absolute right-3 h-4 w-4 shrink-0 text-red-500"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          ) : null}
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400"
          >
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className="text-xs text-slate-500 dark:text-zinc-400"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
