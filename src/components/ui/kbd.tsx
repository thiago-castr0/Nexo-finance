import * as React from "react";
import { cn } from "@/lib/utils";

export interface KbdPillProps extends React.HTMLAttributes<HTMLElement> {
  keys: string[];
}

/**
 * Tecla de Atalho Sólida e Nítida (Sem blur para leitura imediata)
 */
export function KbdPill({ keys, className, ...props }: KbdPillProps) {
  return (
    <span
      className={cn(
        "inline-flex flex-row flex-nowrap items-center gap-1 whitespace-nowrap shrink-0",
        className
      )}
      {...props}
    >
      {keys.map((keyLabel, index) => (
        <React.Fragment key={keyLabel}>
          <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-[#D4D4D8] bg-[#FFFFFF] px-1.5 font-mono text-[11px] font-bold text-[#18181B] shadow-2xs dark:border-[#3F3F46] dark:bg-[#18181B] dark:text-[#F4F4F5]">
            {keyLabel}
          </kbd>
          {index < keys.length - 1 ? (
            <span className="text-[10px] font-bold text-[#71717A]">+</span>
          ) : null}
        </React.Fragment>
      ))}
    </span>
  );
}
