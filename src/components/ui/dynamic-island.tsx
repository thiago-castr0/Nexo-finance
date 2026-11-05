import * as React from "react";
import { Sparkles, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DynamicIslandBarProps {
  aiStatusText: string;
  securityStatusText?: string;
  draftCount?: number;
  onDraftClick?: () => void;
  className?: string;
}

/**
 * Barra de Telemetria Sólida e Nítida (Contraste máximo para ícones e textos)
 */
export function DynamicIslandBar({
  aiStatusText,
  securityStatusText = "RLS + Magic Bytes Ativo",
  draftCount = 0,
  onDraftClick,
  className,
}: DynamicIslandBarProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-2.5 rounded-full border border-[#692296] bg-[#18181B] px-4 py-1.5 text-[#FFFFFF] shadow-md dark:border-[#A466D1] dark:bg-[#09090B]",
        className
      )}
    >
      {/* Pulso do Motor IA */}
      <div className="inline-flex flex-row flex-nowrap items-center gap-2 whitespace-nowrap shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A466D1] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#A466D1]" />
        </span>
        <Sparkles className="h-3.5 w-3.5 text-[#DEC5EF] shrink-0" strokeWidth={1.75} />
        <span className="text-xs font-bold text-[#FFFFFF] whitespace-nowrap">
          {aiStatusText}
        </span>
      </div>

      <span className="h-3.5 w-[1px] bg-white/25 hidden sm:inline-block" />

      {/* Telemetria Zero-Trust */}
      <div className="hidden sm:inline-flex flex-row flex-nowrap items-center gap-1.5 whitespace-nowrap shrink-0 text-xs font-medium text-[#E4E4E7]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#46C87D] shrink-0" strokeWidth={1.75} />
        <span>{securityStatusText}</span>
      </div>

      {/* Contador de Rascunhos se houver */}
      {draftCount > 0 && onDraftClick ? (
        <>
          <span className="h-3.5 w-[1px] bg-white/25" />
          <button
            type="button"
            onClick={onDraftClick}
            className="inline-flex flex-row flex-nowrap items-center gap-1.5 whitespace-nowrap shrink-0 rounded-full border border-[#EA920F] bg-[#EA920F] px-2.5 py-0.5 text-[11px] font-bold text-[#FFFFFF] transition-transform hover:scale-105 cursor-pointer"
          >
            <Activity className="h-3 w-3 shrink-0" strokeWidth={2} />
            <span>{draftCount} Rascunho(s) IA</span>
          </button>
        </>
      ) : null}
    </div>
  );
}
