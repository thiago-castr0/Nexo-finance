import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Container/Box externo em Vidro Fosco Clean (Light: Branco translúcido / Dark: Grafite translúcido)
 */
export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/90 bg-white/80 text-[#18181B] ring-1 ring-[#E4E4E7]/80 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(24,24,27,0.06)] transition-all duration-200 dark:border-white/10 dark:bg-[#141419]/80 dark:text-[#F4F4F5] dark:ring-white/5 dark:shadow-[0_14px_36px_-10px_rgba(0,0,0,0.45)]",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#DC2626] via-[#692296] to-[#0CB853]"
      />
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-bold leading-none tracking-tight text-[#18181B] dark:text-[#FFFFFF]",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-[#71717A] dark:text-[#A1A1AA]", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-5 pt-0 sm:p-6 sm:pt-0", className)}
      {...props}
    />
  );
}
