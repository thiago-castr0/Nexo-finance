import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Layers,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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

  const savingsRate =
    summary.totalIncome > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              ((summary.totalIncome - summary.totalExpense) /
                summary.totalIncome) *
                100
            )
          )
        )
      : 0;

  const commitmentRate =
    summary.totalIncome > 0
      ? Math.min(
          100,
          Math.round((summary.totalExpense / summary.totalIncome) * 100)
        )
      : 0;

  const monthlyBudgetGoal = 4500;
  const budgetGoalPercent = Math.min(
    100,
    Math.round((summary.totalExpense / monthlyBudgetGoal) * 100)
  );

  return (
    <Card className="nexo-card-hover relative flex h-full flex-col justify-between overflow-hidden border-[#E4E4E7] bg-[#FFFFFF] p-6 hover:border-[#F59B92] dark:border-[#3F3F46] dark:bg-[#18181B] dark:hover:border-[#7E32B5]">
      {/* Faixa Superior de Identidade da Marca (RED #DC2626 -> PURPLE #692296) */}
      <div
        className="pointer-events-none absolute top-0 right-0 left-0 h-1.5"
        style={{
          background:
            "linear-gradient(90deg, #DC2626 0%, #E85950 35%, #7E32B5 70%, #692296 100%)",
        }}
      />

      {/* Glow Ambiental Sutil da Marca */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#FACBC2]/30 blur-3xl dark:bg-[#DC2626]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#DEC5EF]/30 blur-3xl dark:bg-[#692296]/10"
      />

      {/* Topo do Hero Patrimonial */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E4E7] pb-4 dark:border-[#3F3F46]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#F59B92] bg-[#FACBC2]/45 text-[#DC2626] dark:border-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#FACBC2]">
            <Wallet className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#DC2626] dark:text-[#F59B92]">
              Cockpit Patrimonial • Nexo Metrics
            </span>
            <span className="text-xs text-[#71717A] dark:text-[#D4D4D8]">
              Consolidado em tempo real com motor de precisão em centavos
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pendingDraftCount > 0 ? (
            <Badge variant="purple" icon={Sparkles}>
              {pendingDraftCount} em rascunho IA
            </Badge>
          ) : (
            <Badge
              variant={isPositiveBalance ? "income" : "expense"}
              icon={TrendingUp}
            >
              {isPositiveBalance
                ? `Liquidez: +${savingsRate}%`
                : "Atenção ao Caixa"}
            </Badge>
          )}
          <Badge variant="brand" icon={Activity}>
            Ativo
          </Badge>
          <Badge variant="neutral" icon={Layers}>
            {summary.transactionCount} registros
          </Badge>
        </div>
      </div>

      {/* Bloco Central: Saldo Líquido + Indicadores de Meta e Preservação */}
      <div className="relative z-10 my-6 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        <div className="space-y-2.5 lg:col-span-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717A] dark:text-[#D4D4D8]">
            Saldo Líquido Disponível
          </span>
          <p
            data-testid="total-balance"
            className={`text-4xl font-bold tracking-tight tabular-nums sm:text-5xl ${
              isPositiveBalance
                ? "text-[#18181B] dark:text-[#FFFFFF]"
                : "text-[#DF2929] dark:text-[#F4948C]"
            }`}
          >
            {formatCurrencyBRL(summary.totalBalance)}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[#71717A] dark:text-[#D4D4D8]">
            <ShieldCheck
              className="h-4 w-4 shrink-0 text-[#0CB853]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span>Isolamento RLS & Zero Trust • Ecossistema 2TP</span>
          </p>
        </div>

        {/* Painel Duplo de Saúde do Orçamento & Meta de Gastos */}
        <div className="space-y-4 rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5]/75 p-4 lg:col-span-6 dark:border-[#3F3F46] dark:bg-[#09090B]/70">
          <ProgressBar
            label="Preservação da Receita Mensal"
            valueLabel={`${savingsRate}% livre`}
            value={savingsRate}
            variant="success"
            size="md"
          />

          <ProgressBar
            label={`Teto de Gastos (${formatCurrencyBRL(monthlyBudgetGoal)})`}
            valueLabel={`${budgetGoalPercent}% utilizado`}
            value={budgetGoalPercent}
            variant={budgetGoalPercent > 85 ? "danger" : "gradient"}
            size="md"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#71717A] dark:text-[#D4D4D8]">
            <span className="inline-flex items-center gap-1.5">
              <Target
                className="h-3.5 w-3.5 text-[#692296] dark:text-[#C59BE3]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              Margem disponível no teto:{" "}
              <strong className="text-[#18181B] tabular-nums dark:text-[#FFFFFF]">
                {formatCurrencyBRL(
                  Math.max(0, monthlyBudgetGoal - summary.totalExpense)
                )}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Cards Semânticos Interativos: Entradas (#0CB853) e Saídas (#DF2929) */}
      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Card Entradas */}
        <div className="group flex items-center justify-between rounded-2xl border border-[#7BD6A0] bg-[#BCE5CB]/25 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0CB853] hover:bg-[#BCE5CB]/40 dark:border-[#13BD5B]/50 dark:bg-[#0CB853]/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F3F46] dark:text-[#D4D4D8]">
                Entradas (Receitas)
              </span>
              <Badge variant="income" icon={ArrowUpRight}>
                +100%
              </Badge>
            </div>
            <p
              data-testid="total-income"
              className="text-2xl font-bold tracking-tight text-[#0CB853] tabular-nums sm:text-3xl dark:text-[#46C87D]"
            >
              + {formatCurrencyBRL(summary.totalIncome)}
            </p>
            <span className="block text-[11px] text-[#71717A] dark:text-[#D4D4D8]">
              Salários, PIX recebidos e rendimentos
            </span>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#7BD6A0] bg-[#FFFFFF] text-[#0CB853] transition-transform duration-200 group-hover:scale-105 dark:border-[#13BD5B] dark:bg-[#18181B]">
            <ArrowUpRight
              className="h-5 w-5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Card Saídas */}
        <div className="group flex items-center justify-between rounded-2xl border border-[#F4948C] bg-[#F9C5BD]/25 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DF2929] hover:bg-[#F9C5BD]/40 dark:border-[#E54541]/50 dark:bg-[#DF2929]/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F3F46] dark:text-[#D4D4D8]">
                Saídas (Despesas)
              </span>
              <Badge variant="expense" icon={ArrowDownRight}>
                {commitmentRate}% da renda
              </Badge>
            </div>
            <p
              data-testid="total-expense"
              className="text-2xl font-bold tracking-tight text-[#DF2929] tabular-nums sm:text-3xl dark:text-[#EC6862]"
            >
              - {formatCurrencyBRL(summary.totalExpense)}
            </p>
            <span className="block text-[11px] text-[#71717A] dark:text-[#D4D4D8]">
              Despesas lidas por IA OCR e manuais
            </span>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#F4948C] bg-[#FFFFFF] text-[#DF2929] transition-transform duration-200 group-hover:scale-105 dark:border-[#E54541] dark:bg-[#18181B]">
            <ArrowDownRight
              className="h-5 w-5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
