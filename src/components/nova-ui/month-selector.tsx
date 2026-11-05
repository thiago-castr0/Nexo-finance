"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export interface MonthSelectorProps {
  currentDate: Date;
  onChange: (newDate: Date) => void;
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function MonthSelector({ currentDate, onChange }: MonthSelectorProps) {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => {
    const prev = new Date(currentYear, currentMonth - 1, 1);
    onChange(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentYear, currentMonth + 1, 1);
    onChange(next);
  };

  const handleResetCurrent = () => {
    onChange(new Date());
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return now.getMonth() === currentMonth && now.getFullYear() === currentYear;
  };

  return (
    <div className="flex items-center gap-1.5 rounded-2xl border border-[#E4E4E7] bg-white/80 px-2 py-1 shadow-sm backdrop-blur-xl dark:border-[#27272A] dark:bg-[#18181B]/80">
      <button
        type="button"
        onClick={handlePrevMonth}
        className="flex h-7 w-7 items-center justify-center rounded-xl text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] active:scale-95 transition-all dark:text-[#A1A1AA] dark:hover:bg-[#27272A] dark:hover:text-[#FFFFFF]"
        title="Mês anterior"
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={handleResetCurrent}
        className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-extrabold text-[#18181B] hover:bg-[#DEC5EF]/30 transition-colors dark:text-[#FFFFFF] dark:hover:bg-[#692296]/20"
        title={isCurrentMonth() ? "Mês atual" : "Voltar para o mês atual"}
      >
        <Calendar className="h-3.5 w-3.5 text-[#692296] dark:text-[#DEC5EF]" />
        <span>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </span>
      </button>

      <button
        type="button"
        onClick={handleNextMonth}
        className="flex h-7 w-7 items-center justify-center rounded-xl text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] active:scale-95 transition-all dark:text-[#A1A1AA] dark:hover:bg-[#27272A] dark:hover:text-[#FFFFFF]"
        title="Próximo mês"
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
