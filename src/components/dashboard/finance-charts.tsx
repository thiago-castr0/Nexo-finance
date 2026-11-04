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
  BarChart3,
  PieChart as PieChartIcon,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyBRL, fromCents, toCents } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

interface FinanceChartsProps {
  transactions: TransactionRecord[];
}

const CATEGORY_PALETTE = [
  "#DC2626", // RED 500
  "#692296", // PURPLE 500
  "#2572CE", // INFO 500
  "#EA920F", // ALERT 500
  "#7E32B5", // PURPLE 400
] as const;

export function FinanceCharts({ transactions }: FinanceChartsProps) {
  const [chartMode, setChartMode] = React.useState<"BAR" | "AREA">("AREA");
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null
  );

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
      .slice(0, 5);
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
        name: "Entradas (+)",
        valor: fromCents(incomeCents),
        color: "#0CB853",
      },
      {
        name: "Saídas (-)",
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

  const topCategory = categoryBreakdown[0];

  return (
    <section
      aria-label="Gráficos e Análises Financeiras"
      className="grid grid-cols-1 gap-5 lg:grid-cols-12"
    >
      {/* Gráfico 1: Evolução & Comparativo de Caixa (7 Colunas) */}
      <Card className="nexo-card-hover lg:col-span-7">
        <CardHeader className="flex flex-col justify-between gap-3 border-b border-[#E4E4E7] pb-4 sm:flex-row sm:items-center dark:border-[#3F3F46]">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3
                className="h-4 w-4 text-[#DC2626]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              Performance de Fluxo de Caixa
            </CardTitle>
            <CardDescription>
              Dinâmica entre entradas (<code>#0CB853</code>) e saídas (
              <code>#DF2929</code>)
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={chartMode === "AREA" ? "primary" : "neutral"}
              icon={TrendingUp}
              onClick={() => setChartMode("AREA")}
            >
              Curva de Evolução
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
        </CardHeader>

        <CardContent className="pt-5">
          <div className="h-64 w-full" data-testid="cashflow-chart">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === "AREA" ? (
                <AreaChart
                  data={evolutionData}
                  margin={{ top: 10, right: 16, left: 4, bottom: 0 }}
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
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.32} />
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
                    tick={{ fontSize: 12, fill: "#71717A" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#71717A" }}
                    tickFormatter={(v: number) => `R$ ${v}`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatCurrencyBRL(value),
                      name === "entradas" ? "Entradas (+)" : "Saídas (-)",
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
                  margin={{ top: 12, right: 16, left: 8, bottom: 4 }}
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
                    tick={{ fontSize: 12, fill: "#71717A" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#71717A" }}
                    tickFormatter={(v: number) => `R$ ${v}`}
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
                  <Bar dataKey="valor" radius={[10, 10, 0, 0]} maxBarSize={72}>
                    {cashflowChartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico 2: Distribuição de Despesas por Categoria Interativa (5 Colunas) */}
      <Card className="nexo-card-hover flex flex-col justify-between lg:col-span-5">
        <CardHeader className="border-b border-[#E4E4E7] pb-4 dark:border-[#3F3F46]">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChartIcon
                className="h-4 w-4 text-[#692296]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              Mapa de Centros de Custo
            </CardTitle>
            <Badge variant="purple" icon={Sparkles}>
              IA Insights
            </Badge>
          </div>
          <CardDescription>
            Passe o mouse sobre uma categoria para isolar seu impacto no
            orçamento
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          {categoryBreakdown.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#71717A]">
              Nenhuma despesa registrada até o momento.
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {categoryBreakdown.map((item, idx) => {
                  const barColor =
                    CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];
                  const isDimmed =
                    activeCategory !== null && activeCategory !== item.category;

                  return (
                    <div
                      key={item.category}
                      onMouseEnter={() => setActiveCategory(item.category)}
                      onMouseLeave={() => setActiveCategory(null)}
                      className={`cursor-pointer rounded-xl border border-transparent p-2 transition-all duration-200 hover:border-[#E4E4E7] hover:bg-[#F4F4F5]/70 dark:hover:border-[#3F3F46] dark:hover:bg-[#09090B]/50 ${
                        isDimmed ? "opacity-45" : "opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 font-semibold text-[#18181B] dark:text-[#F4F4F5]">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: barColor }}
                          />
                          {item.category}
                        </span>
                        <div className="flex items-center gap-2 tabular-nums">
                          <span className="rounded bg-[#F4F4F5] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#3F3F46] dark:bg-[#09090B] dark:text-[#D4D4D8]">
                            {item.percentage}%
                          </span>
                          <span className="font-bold text-[#18181B] dark:text-[#FFFFFF]">
                            {formatCurrencyBRL(item.amount)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F4F4F5] dark:bg-[#3F3F46]">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(item.percentage, 5)}%`,
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {topCategory ? (
                <div className="rounded-xl border border-[#C59BE3] bg-[#DEC5EF]/25 p-3 text-xs text-[#692296] dark:border-[#7E32B5] dark:bg-[#692296]/15 dark:text-[#DEC5EF]">
                  <span className="font-semibold">Diagnóstico Nexo IA:</span>{" "}
                  <strong>{topCategory.category}</strong> representa{" "}
                  <strong className="tabular-nums">
                    {topCategory.percentage}%
                  </strong>{" "}
                  das suas saídas confirmadas neste ciclo.
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
