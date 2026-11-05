import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserStatusPillProps {
  name: string;
  role: string;
  initials: string;
  status?: "online" | "syncing" | "Protected";
  className?: string;
}

/**
 * Cápsula de Perfil Sólida com Alto Contraste (Sem glass interno)
 */
export function UserStatusPill({
  name,
  role,
  initials,
  status = "online",
  className,
}: UserStatusPillProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-row flex-nowrap items-center gap-2.5 whitespace-nowrap shrink-0 rounded-full border border-[#D4D4D8] bg-[#FFFFFF] py-1 pl-1.5 pr-3.5 shadow-xs dark:border-[#3F3F46] dark:bg-[#18181B]",
        className
      )}
    >
      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#DC2626] to-[#692296] text-[11px] font-bold text-white">
        {initials}
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#18181B]",
            status === "online"
              ? "bg-[#0CB853]"
              : status === "syncing"
                ? "bg-[#EA920F]"
                : "bg-[#692296]"
          )}
        />
      </div>

      <div className="flex flex-col text-left leading-tight">
        <span className="text-xs font-bold text-[#18181B] dark:text-[#FFFFFF] whitespace-nowrap">
          {name}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#3F3F46] dark:text-[#D4D4D8] whitespace-nowrap">
          <ShieldCheck className="h-3 w-3 text-[#0CB853]" strokeWidth={2} />
          {role}
        </span>
      </div>
    </div>
  );
}
