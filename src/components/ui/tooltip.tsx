"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlassTooltipProps {
  label: string;
  content: string;
  tag?: string;
  className?: string;
}

/**
 * Gatilho sólido e nítido + Box externo do Popover em Vidro Fosco
 */
export function GlassTooltip({
  label,
  content,
  tag = "Info Semântica",
  className,
}: GlassTooltipProps) {
  return (
    <div className={cn("group relative inline-flex items-center", className)}>
      <button
        type="button"
        className="inline-flex flex-row flex-nowrap items-center gap-1.5 whitespace-nowrap shrink-0 rounded-full border border-[#692296] bg-[#FFFFFF] px-3 py-1 text-xs font-bold text-[#692296] shadow-2xs transition-colors hover:bg-[#692296] hover:text-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A466D1] dark:border-[#A466D1] dark:bg-[#18181B] dark:text-[#DEC5EF] [&_svg]:shrink-0 [&_svg]:inline-block"
      >
        <Info className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        <span>{label}</span>
      </button>

      {/* Container Externo do Popover com Glassmorphism */}
      <div
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-2xl border border-[#C59BE3] bg-white/92 p-3.5 text-left opacity-0 backdrop-blur-2xl shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-[#7E32B5] dark:bg-[#18181B]/95"
      >
        <span className="inline-block rounded-md border border-[#692296] bg-[#DEC5EF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#18181B]">
          {tag}
        </span>
        <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#18181B] dark:text-[#F4F4F5]">
          {content}
        </p>
      </div>
    </div>
  );
}
