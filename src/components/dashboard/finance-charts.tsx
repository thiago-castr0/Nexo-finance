"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { RadialGauge } from "@/components/ui/radial-gauge";
import {
  calculateFinancialSummary,
  formatCurrencyBRL,
  fromCents,
  toCents,
} from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

interface FinanceChartsProps {
  transactions: TransactionRecord[];
}

const CATEGORY_PALETTE = [
  "#DC2626", // RED 500
  "#692296", // PURPLE 500
  "#2572CE", // INFO 500
  "#EA920F", // ALERT 500
  "#0CB853", // SUCCESS 500
] as const;

/**
 * Linha 3 Clean: 3 Boxes Alinhados do Mesmo Tamanho (lg:grid-cols-3):
 * 1. Saúde do Orçamento (Score simples + economia do mês)
 * 2. Gastos por Categoria
 * 3. Evolução do Mês
 */
export function FinanceCharts({ transactions }: FinanceChartsProps) {
  const [chartMode, setChartMode] = React.useState<"BAR" | "AREA">("AREA");

  const summary = React.useMemo(
    () => calculateFinancialSummary(transactions),
    [transactions]
  );

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

  const categoryBreakdown = React.useMemo(() => {
    const map = new Map<string, number>();
    let totalExpenseCents = 0;

    for (const tx of transactions) {
      if (tx.type === "EXPENSE") {
        const cents = toCents(tx.amount);
        totalExpenseCents += cents;
        map.set(tx.category, (map.get(tx.category) ?? 0) + cents);
      }
    }

    return Array.from(map.entries())
      .map(([category, cents]) => ({
        category,
        amount: fromCents(cents),
        percentage:
          totalExpenseCents > 0
            ? Math.round((cents / totalExpenseCents) * 100)
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [transactions]);

  const cashflowChartData = React.useMemo(() => {
    let incomeCents = 0;
    let expenseCents = 0;

    for (const tx of transactions) {
      if (tx.type === "INCOME") {
        incomeCents += toCents(tx.amount);
      } else {
        expenseCents += toCents(tx.amount);
      }
    }

    return [
      {
        name: "Entradas",
        valor: fromCents(incomeCents),
        color: "#0CB853",
      },
      {
        name: "Saídas",
        valor: fromCents(expenseCents),
        color: "#DF2929",
      },
    ];
  }, [transactions]);

  const evolutionData = React.useMemo(() => {
    return [
      { ciclo: "Sem 1", entradas: 4200, saidas: 1200 },
      { ciclo: "Sem 2", entradas: 6100, saidas: 1950 },
      { ciclo: "Sem 3", entradas: 7400, saidas: 2680 },
      {
        ciclo: "Atual",
        entradas: cashflowChartData[0]?.valor ?? 8500,
        saidas: cashflowChartData[1]?.valor ?? 3195.8,
      },
    ];
  }, [cashflowChartData]);

  if (transactions.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Análises do Mês"
      className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3"
    >
      {/* BOX 1 (1/3): SAÚDE DO ORÇAMENTO (Clean, direto e fácil de entender) */}
      <GlassPanel
        intent="ai"
        blur="xl"
        topBeam
        className="flex h-full flex-col justify-between p-5 sm:p-6"
      >
        <div className="flex items-center gap-2.5 pb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#692296]/10 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
            <Activity className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#18181B] dark:text-[#FFFFFF]">
              Saúde do Mês
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Quanto da sua renda está livre
            </p>
          </div>
        </div>

        <div className="my-2 flex flex-1 flex-col items-center justify-center rounded-2xl border border-[#E4E4E7] bg-white p-4 dark:border-white/10 dark:bg-[#1C1C22]">
          <RadialGauge
            value={savingsRate}
            size={112}
            strokeWidth={9}
            variant={savingsRate >= 20 ? "income" : "warning"}
            label={`${savingsRate}% da renda livre`}
            sublabel={
              savingsRate >= 20
                ? "Ótimo controle no mês"
                : "Atenção aos gastos"
            }
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#71717A] dark:text-[#A1A1AA]">
          <span>Economia acumulada</span>
          <strong className="font-bold text-[#0CB853] tabular-nums dark:text-[#46C87D]">
            {formatCurrencyBRL(Math.max(0, summary.totalBalance))}
          </strong>
        </div>
      </GlassPanel>

      {/* BOX 2 (1/3): GASTOS POR CATEGORIA */}
      <GlassPanel
        intent="brand"
        blur="xl"
        topBeam
        className="flex h-full flex-col justify-between p-5 sm:p-6"
      >
        <div className="flex items-center gap-2.5 pb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#DC2626]/10 text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#F59B92]">
            <PieChartIcon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#18181B] dark:text-[#FFFFFF]">
              Gastos por Categoria
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Para onde está indo seu dinheiro
            </p>
          </div>
        </div>

        <div className="my-2 flex-1 flex flex-col justify-center space-y-3 rounded-2xl border border-[#E4E4E7] bg-white p-4 dark:border-white/10 dark:bg-[#1C1C22]">
          {categoryBreakdown.length === 0 ? (
            <p className="py-6 text-center text-xs text-[#71717A]">
              Sem despesas registradas.
            </p>
          ) : (
            categoryBreakdown.map((item, idx) => {
              const barColor =
                CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];

              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-semibold text-[#18181B] dark:text-[#FFFFFF]">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: barColor }}
                      />
                      {item.category}
                    </span>
                    <span className="font-bold text-[#18181B] tabular-nums dark:text-[#FFFFFF]">
                      {formatCurrencyBRL(item.amount)}{" "}
                      <span className="font-normal text-[#71717A]">
                        ({item.percentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F4F4F5] dark:bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(item.percentage, 6)}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#71717A] dark:text-[#A1A1AA]">
          <span>Total de saídas</span>
          <strong className="font-bold text-[#DF2929] tabular-nums dark:text-[#F4948C]">
            {formatCurrencyBRL(summary.totalExpense)}
          </strong>
        </div>
      </GlassPanel>

      {/* BOX 3 (1/3): EVOLUÇÃO DO FLUXO DE CAIXA */}
      <GlassPanel
        intent="income"
        blur="xl"
        topBeam
        className="flex h-full flex-col justify-between p-5 sm:p-6"
      >
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0CB853]/10 text-[#0CB853] dark:bg-[#0CB853]/20 dark:text-[#46C87D]">
              <BarChart3 className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#18181B] dark:text-[#FFFFFF]">
                Fluxo de Caixa
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Entradas vs Saídas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={chartMode === "AREA" ? "income" : "neutral"}
              icon={TrendingUp}
              onClick={() => setChartMode("AREA")}
            >
              Linha
            </Button>
            <Button
              type="button"
              size="sm"
              variant={chartMode === "BAR" ? "secondary" : "neutral"}
              icon={BarChart3}
              onClick={() => setChartMode("BAR")}
            >
              Barras
            </Button>
          </div>
        </div>

        <div className="my-2 flex-1 rounded-2xl border border-[#E4E4E7] bg-white p-3 dark:border-white/10 dark:bg-[#1C1C22]">
          <div className="h-48 w-full" data-testid="cashflow-chart">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === "AREA" ? (
                <AreaChart
                  data={evolutionData}
                  margin={{ top: 8, right: 8, left: -14, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="incomeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0CB853" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0CB853" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="expenseGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E4E4E7"
                  />
                  <XAxis
                    dataKey="ciclo"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#71717A" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#71717A" }}
                    tickFormatter={(v: number) => `R$${v}`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatCurrencyBRL(value),
                      name === "entradas" ? "Entradas" : "Saídas",
                    ]}
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid #E4E4E7",
                      fontSize: "12px",
                      backgroundColor: "#FFFFFF",
                      color: "#18181B",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="entradas"
                    stroke="#0CB853"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#incomeGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="saidas"
                    stroke="#DC2626"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#expenseGradient)"
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={cashflowChartData}
                  margin={{ top: 8, right: 8, left: -14, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E4E4E7"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#71717A" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#71717A" }}
                    tickFormatter={(v: number) => `R$${v}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrencyBRL(value),
                      "Total",
                    ]}
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid #E4E4E7",
                      fontSize: "12px",
                      backgroundColor: "#FFFFFF",
                      color: "#18181B",
                    }}
                  />
                  <Bar dataKey="valor" radius={[10, 10, 0, 0]} maxBarSize={56}>
                    {cashflowChartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#71717A] dark:text-[#A1A1AA]">
          <span className="font-semibold text-[#0CB853] tabular-nums">
            + {formatCurrencyBRL(summary.totalIncome)}
          </span>
          <span className="font-semibold text-[#DF2929] tabular-nums">
            - {formatCurrencyBRL(summary.totalExpense)}
          </span>
        </div>
      </GlassPanel>
    </section>
  );
}
