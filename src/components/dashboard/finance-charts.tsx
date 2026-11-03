"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrencyBRL, fromCents, toCents } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

interface FinanceChartsProps {
  transactions: TransactionRecord[];
}

export function FinanceCharts({ transactions }: FinanceChartsProps) {
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
        name: "Entradas",
        valor: fromCents(incomeCents),
        color: "#16a34a",
      },
      {
        name: "Saídas",
        valor: fromCents(expenseCents),
        color: "#dc2626",
      },
    ];
  }, [transactions]);

  if (transactions.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Gráficos e Análises Financeiras"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
    >
      {/* Gráfico 1: Comparativo Entradas vs Saídas (Recharts) */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3
                  className="h-4 w-4 text-rose-600"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                Fluxo de Caixa Consolidado
              </CardTitle>
              <CardDescription>
                Comparativo visual entre receitas e despesas confirmadas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-56 w-full" data-testid="cashflow-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cashflowChartData}
                margin={{ top: 12, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(v: number) => `R$ ${v}`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrencyBRL(value),
                    "Total",
                  ]}
                  contentStyle={{
                    borderRadius: "0.625rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {cashflowChartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico 2: Distribuição de Despesas por Categoria */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <PieChartIcon
              className="h-4 w-4 text-violet-600"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            Despesas por Categoria
          </CardTitle>
          <CardDescription>
            Principais centros de custo identificados no seu orçamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-3">
          {categoryBreakdown.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">
              Nenhuma despesa registrada até o momento.
            </p>
          ) : (
            categoryBreakdown.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-zinc-200">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="text-slate-400">{item.percentage}%</span>
                    <span className="font-semibold text-slate-900 dark:text-zinc-100">
                      {formatCurrencyBRL(item.amount)}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-violet-600 transition-all duration-300"
                    style={{ width: `${Math.max(item.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
