"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Wallet,
} from "lucide-react";
import { formatCurrencyBRL } from "@/lib/finance";

export interface WalletHeroCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount?: number;
  onOpenManualEntry?: () => void;
  onTriggerAiSimulation?: () => void;
  isSimulatingAi?: boolean;
}

export function WalletHeroCard({
  totalBalance,
  totalIncome,
  totalExpenses,
}: WalletHeroCardProps) {
  const [hideValues, setHideValues] = React.useState(false);

  const maskValue = (val: number) =>
    hideValues ? "R$ ••••••" : formatCurrencyBRL(val);

  return (
    <section
      aria-label="Resumo do Mês"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {/* 1. Saldo Atual (Vidro Branco Nítido + Contraste WCAG AAA) */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#DC2626] to-[#692296]"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DEC5EF]/60 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
              <Wallet className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="text-xs font-bold text-[#3F3F46] dark:text-[#D4D4D8]">
              Saldo Atual
            </span>
          </div>

          <button
            type="button"
            onClick={() => setHideValues((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[#3F3F46] transition hover:bg-[#F4F4F5] dark:text-[#D4D4D8] dark:hover:bg-[#27272A] cursor-pointer"
            aria-label={hideValues ? "Mostrar valores" : "Ocultar valores"}
          >
            {hideValues ? (
              <Eye className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <EyeOff className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </div>

        <p
          className={`mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${
            totalBalance < 0
              ? "text-[#DF2929] dark:text-[#EC6862]"
              : "text-[#18181B] dark:text-[#FFFFFF]"
          }`}
        >
          {maskValue(totalBalance)}
        </p>
      </div>

      {/* 2. Entradas */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#0CB853]"
        />
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#BCE5CB]/60 text-[#0CB853] dark:bg-[#0CB853]/20 dark:text-[#46C87D]">
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="text-xs font-bold text-[#3F3F46] dark:text-[#D4D4D8]">
            Entradas
          </span>
        </div>

        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0CB853] dark:text-[#46C87D] tabular-nums">
          + {maskValue(totalIncome)}
        </p>
      </div>

      {/* 3. Saídas */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#DF2929]"
        />
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F9C5BD]/60 text-[#DF2929] dark:bg-[#DF2929]/20 dark:text-[#EC6862]">
            <ArrowDownRight className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="text-xs font-bold text-[#3F3F46] dark:text-[#D4D4D8]">
            Saídas
          </span>
        </div>

        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#DF2929] dark:text-[#EC6862] tabular-nums">
          - {maskValue(totalExpenses)}
        </p>
      </div>
    </section>
  );
}
