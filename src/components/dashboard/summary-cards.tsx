import {
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  Wallet,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrencyBRL, type FinancialSummary } from "@/lib/finance";

interface SummaryCardsProps {
  summary: FinancialSummary;
  pendingDraftCount: number;
}

export function SummaryCards({
  summary,
  pendingDraftCount,
}: SummaryCardsProps) {
  const isPositiveBalance = summary.totalBalance >= 0;

  const monthlyBudgetGoal = 4500;
  const budgetGoalPercent = Math.min(
    100,
    Math.round((summary.totalExpense / monthlyBudgetGoal) * 100)
  );

  return (
    <GlassPanel
      intent="brand"
      blur="xl"
      topBeam
      className="flex h-full flex-col justify-between p-5 sm:p-6"
    >
      {/* Topo Clean e Direto */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#DC2626]/10 text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#F59B92]">
            <Wallet className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#18181B] dark:text-[#FFFFFF]">
              Resumo do Mês
            </h2>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Novembro 2026
            </p>
          </div>
        </div>

        {pendingDraftCount > 0 ? (
          <Badge variant="purple" icon={Sparkles}>
            {pendingDraftCount} pendente(s)
          </Badge>
        ) : null}
      </div>

      {/* 3 Métricas Essenciais (Saldo, Entradas e Saídas) — Limpo para Mobile e Desktop */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 my-2">
        {/* 1. Saldo Atual */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#1C1C22]">
          <span className="text-xs font-medium text-[#71717A] dark:text-[#A1A1AA]">
            Saldo Disponível
          </span>
          <p
            data-testid="total-balance"
            className={`mt-1.5 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl ${
              isPositiveBalance
                ? "text-[#18181B] dark:text-[#FFFFFF]"
                : "text-[#DF2929]"
            }`}
          >
            {formatCurrencyBRL(summary.totalBalance)}
          </p>
        </div>

        {/* 2. Entradas */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#1C1C22]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#71717A] dark:text-[#A1A1AA]">
              Entradas
            </span>
            <ArrowUpRight
              className="h-4 w-4 text-[#0CB853]"
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <p
            data-testid="total-income"
            className="mt-1.5 text-2xl font-bold tracking-tight text-[#0CB853] tabular-nums sm:text-3xl dark:text-[#46C87D]"
          >
            + {formatCurrencyBRL(summary.totalIncome)}
          </p>
        </div>

        {/* 3. Saídas */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#1C1C22]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#71717A] dark:text-[#A1A1AA]">
              Saídas
            </span>
            <ArrowDownRight
              className="h-4 w-4 text-[#DF2929]"
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <p
            data-testid="total-expense"
            className="mt-1.5 text-2xl font-bold tracking-tight text-[#DF2929] tabular-nums sm:text-3xl dark:text-[#F4948C]"
          >
            - {formatCurrencyBRL(summary.totalExpense)}
          </p>
        </div>
      </div>

      {/* 1 Única Barra Simples de Meta Mensal */}
      <div className="mt-4 pt-3 border-t border-[#E4E4E7]/80 dark:border-white/10">
        <ProgressBar
          label={`Meta de gastos do mês (${formatCurrencyBRL(monthlyBudgetGoal)})`}
          valueLabel={`${budgetGoalPercent}% usado`}
          value={budgetGoalPercent}
          variant={budgetGoalPercent > 85 ? "danger" : "gradient"}
          size="md"
        />
      </div>
    </GlassPanel>
  );
}
