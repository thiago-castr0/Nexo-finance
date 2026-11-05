"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  PiggyBank,
  Plus,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrencyBRL } from "@/lib/finance";

export interface WalletHeroCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  onOpenManualEntry: () => void;
  onTriggerAiSimulation: () => void;
  isSimulatingAi?: boolean;
}

export function WalletHeroCard({
  totalBalance,
  totalIncome,
  totalExpenses,
  transactionCount,
  onOpenManualEntry,
  onTriggerAiSimulation,
  isSimulatingAi = false,
}: WalletHeroCardProps) {
  const [hideValues, setHideValues] = React.useState(false);

  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))
      : 0;

  const commitmentRate =
    totalIncome > 0
      ? Math.min(100, Math.round((totalExpenses / totalIncome) * 100))
      : 0;

  const maskValue = (val: number) =>
    hideValues ? "R$ ••••••" : formatCurrencyBRL(val);

  return (
    <section
      aria-label="Carteira Principal e Resumo Rápido"
      className="grid grid-cols-1 gap-4 xl:grid-cols-12"
    >
      {/* Cartão Principal Estilo Digital Wallet (7 Colunas no Desktop) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18181B] via-[#2A123D] to-[#692296] p-6 text-white shadow-[0_18px_40px_-15px_rgba(105,34,150,0.45)] xl:col-span-7 flex flex-col justify-between min-h-[220px]">
        {/* Detalhe luminoso sutil da marca 2TP */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#DC2626]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#A466D1]/20 blur-3xl"
        />

        {/* Topo do Cartão */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20">
              <Wallet className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                Saldo Disponível • Conta Pessoal
              </p>
              <p className="text-xs text-white/80">
                {transactionCount} lançamentos registrados neste mês
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHideValues((prev) => !prev)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white/10 px-3 text-xs font-semibold text-white/90 ring-1 ring-white/15 transition hover:bg-white/20 whitespace-nowrap cursor-pointer"
            aria-label={hideValues ? "Mostrar valores" : "Ocultar valores"}
          >
            {hideValues ? (
              <>
                <Eye className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                <span>Mostrar</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                <span>Ocultar</span>
              </>
            )}
          </button>
        </div>

        {/* Valor Central em Destaque */}
        <div className="relative z-10 my-5">
          <p
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
              totalBalance < 0 ? "text-[#FACBC2]" : "text-white"
            }`}
          >
            {maskValue(totalBalance)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0CB853]/25 px-2.5 py-0.5 text-xs font-semibold text-[#BCE5CB] ring-1 ring-[#0CB853]/40 whitespace-nowrap">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              <span>{savingsRate}% da renda livre</span>
            </span>
            <span className="text-xs text-white/75">
              Comprometimento atual: <strong className="text-white tabular-nums">{commitmentRate}%</strong>
            </span>
          </div>
        </div>

        {/* Rodapé do Cartão: Ações Rápidas Single-Line */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={onOpenManualEntry}
              className="bg-[#DC2626] text-white border-[#DC2626] hover:bg-[#E85950] dark:bg-[#DC2626] dark:text-white"
            >
              Novo Lançamento
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Sparkles}
              isLoading={isSimulatingAi}
              onClick={onTriggerAiSimulation}
              className="bg-white text-[#692296] border-white hover:bg-[#F4F4F5] dark:bg-white dark:text-[#692296]"
            >
              Simular Comprovante IA
            </Button>
          </div>

          <span className="text-[11px] font-medium text-white/70 hidden sm:inline">
            2TP Nexo • Precisão Centavos
          </span>
        </div>
      </div>

      {/* 3 Cards Minimalistas de Fluxo & Reserva (5 Colunas no Desktop) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 xl:col-span-5 xl:grid-cols-1">
        {/* Card Entradas */}
        <div className="flex items-center justify-between rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-2xs transition hover:border-[#7BD6A0] dark:border-[#27272A] dark:bg-[#141418]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#BCE5CB]/45 text-[#0CB853] dark:bg-[#0CB853]/15 dark:text-[#46C87D]">
              <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA]">
                Entradas do Mês
              </p>
              <p className="text-lg font-extrabold tracking-tight text-[#0CB853] dark:text-[#46C87D] tabular-nums">
                + {maskValue(totalIncome)}
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-[#BCE5CB]/40 px-2 py-1 text-[11px] font-bold text-[#0CB853] dark:bg-[#0CB853]/15 dark:text-[#46C87D] whitespace-nowrap">
            Receitas
          </span>
        </div>

        {/* Card Saídas */}
        <div className="flex items-center justify-between rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-2xs transition hover:border-[#F4948C] dark:border-[#27272A] dark:bg-[#141418]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F9C5BD]/45 text-[#DF2929] dark:bg-[#DF2929]/15 dark:text-[#EC6862]">
              <ArrowDownRight className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA]">
                Saídas do Mês
              </p>
              <p className="text-lg font-extrabold tracking-tight text-[#DF2929] dark:text-[#EC6862] tabular-nums">
                - {maskValue(totalExpenses)}
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-[#F9C5BD]/40 px-2 py-1 text-[11px] font-bold text-[#DF2929] dark:bg-[#DF2929]/15 dark:text-[#EC6862] whitespace-nowrap">
            Despesas
          </span>
        </div>

        {/* Card Economia / Margem Livre */}
        <div className="flex items-center justify-between rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-2xs transition hover:border-[#C59BE3] dark:border-[#27272A] dark:bg-[#141418]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#DEC5EF]/45 text-[#692296] dark:bg-[#692296]/20 dark:text-[#C59BE3]">
              <PiggyBank className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA]">
                Economia Livre ({savingsRate}%)
              </p>
              <p className="text-lg font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF] tabular-nums">
                {maskValue(Math.max(0, totalIncome - totalExpenses))}
              </p>
            </div>
          </div>
          <div className="w-20">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F4F4F5] dark:bg-[#27272A]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#692296] to-[#0CB853] transition-all duration-300"
                style={{ width: `${Math.min(100, savingsRate)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
