import {
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  return (
    <section
      aria-label="Resumo Financeiro"
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      {/* Card 1: Saldo Total (Maior Hierarquia Visual - skill_ui_fundamentals.md) */}
      <Card className="relative overflow-hidden border-slate-200/90 dark:border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Saldo Total
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50/60 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400">
              <Wallet className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <p
              data-testid="total-balance"
              className={`text-3xl font-bold tracking-tight tabular-nums ${
                isPositiveBalance
                  ? "text-slate-900 dark:text-zinc-50"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrencyBRL(summary.totalBalance)}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>{summary.transactionCount} lançamentos confirmados</span>
            {pendingDraftCount > 0 ? (
              <Badge variant="purple" icon={Sparkles}>
                {pendingDraftCount} em rascunho
              </Badge>
            ) : (
              <Badge variant={isPositiveBalance ? "income" : "expense"}>
                {isPositiveBalance ? "Saldo Positivo" : "Atenção ao Saldo"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Receitas / Entradas (Verde Semântico) */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Entradas (Receitas)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50/60 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ArrowUpRight
                className="h-4 w-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          </div>

          <p
            data-testid="total-income"
            className="mt-3 text-2xl font-semibold tracking-tight text-emerald-600 tabular-nums dark:text-emerald-400"
          >
            {formatCurrencyBRL(summary.totalIncome)}
          </p>

          <p className="mt-4 text-xs text-slate-500 dark:text-zinc-400">
            Receitas consolidadas no período atual
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Despesas / Saídas (Vermelho Semântico) */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Saídas (Despesas)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50/60 text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
              <ArrowDownRight
                className="h-4 w-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          </div>

          <p
            data-testid="total-expense"
            className="mt-3 text-2xl font-semibold tracking-tight text-red-600 tabular-nums dark:text-red-400"
          >
            {formatCurrencyBRL(summary.totalExpense)}
          </p>

          <p className="mt-4 text-xs text-slate-500 dark:text-zinc-400">
            Despesas categorizadas pela IA e manuais
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
