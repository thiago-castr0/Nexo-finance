"use client";

import * as React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyBRL } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

export interface CategoryEnvelopesProps {
  transactions: TransactionRecord[];
  totalIncome: number;
  totalExpenses: number;
}

const DEFAULT_CATEGORY_BUDGETS: Record<string, number> = {
  Moradia: 2800,
  Alimentação: 1200,
  "Assinaturas & Software": 350,
  Transporte: 600,
  "Saúde & Farmácia": 500,
  "Lazer & Outros": 600,
};

export function CategoryEnvelopes({
  transactions,
  totalIncome,
  totalExpenses,
}: CategoryEnvelopesProps) {
  const categoryBreakdown = React.useMemo(() => {
    const map = new Map<string, number>();

    transactions
      .filter((tx) => tx.type === "EXPENSE")
      .forEach((tx) => {
        const current = map.get(tx.category) ?? 0;
        map.set(tx.category, Math.round((current + tx.amount) * 100) / 100);
      });

    return Array.from(map.entries())
      .map(([category, spent]) => {
        const budget = DEFAULT_CATEGORY_BUDGETS[category] ?? Math.max(800, Math.round(spent * 1.3));
        const percent = Math.min(100, Math.round((spent / budget) * 100));
        return {
          category,
          spent,
          budget,
          percent,
        };
      })
      .sort((a, b) => b.spent - a.spent);
  }, [transactions]);

  const incomeVsExpenseRatio =
    totalIncome > 0
      ? Math.min(100, Math.round((totalExpenses / totalIncome) * 100))
      : 0;

  return (
    <div className="rounded-3xl border border-[#E4E4E7] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#27272A] dark:bg-[#141418] space-y-5">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E4E4E7] pb-4 dark:border-[#27272A]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DEC5EF]/45 text-[#692296] dark:bg-[#692296]/20 dark:text-[#C59BE3]">
            <PieChart className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
              Envelopes de Gastos
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Limites mensais por categoria
            </p>
          </div>
        </div>

        <Badge
          variant={incomeVsExpenseRatio > 80 ? "warning" : "income"}
          icon={incomeVsExpenseRatio > 80 ? AlertTriangle : CheckCircle2}
        >
          {incomeVsExpenseRatio}% da Renda
        </Badge>
      </div>

      {/* Termômetro Geral Entradas vs Saídas */}
      <div className="rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] p-4 dark:border-[#27272A] dark:bg-[#0D0D11]">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-[#3F3F46] dark:text-[#D4D4D8] flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#0CB853]" />
            Balanço do Mês
          </span>
          <span className="tabular-nums text-[#18181B] dark:text-[#FFFFFF]">
            {formatCurrencyBRL(totalExpenses)} / {formatCurrencyBRL(totalIncome)}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E4E4E7] dark:bg-[#27272A]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              incomeVsExpenseRatio > 85
                ? "bg-[#DF2929]"
                : incomeVsExpenseRatio > 65
                  ? "bg-[#EA920F]"
                  : "bg-[#0CB853]"
            }`}
            style={{ width: `${incomeVsExpenseRatio}%` }}
          />
        </div>
      </div>

      {/* Lista de Envelopes por Categoria */}
      {categoryBreakdown.length === 0 ? (
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] text-center py-4">
          Nenhuma despesa registrada neste mês.
        </p>
      ) : (
        <div className="space-y-3.5">
          {categoryBreakdown.map((item) => {
            const isWarning = item.percent >= 80 && item.percent < 100;
            const isOver = item.percent >= 100;

            return (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#18181B] dark:text-[#FFFFFF]">
                    {item.category}
                  </span>
                  <span className="tabular-nums font-semibold text-[#3F3F46] dark:text-[#D4D4D8]">
                    <strong className="text-[#18181B] dark:text-[#FFFFFF]">
                      {formatCurrencyBRL(item.spent)}
                    </strong>{" "}
                    <span className="text-[#71717A]">
                      / {formatCurrencyBRL(item.budget)}
                    </span>
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F4F4F5] dark:bg-[#27272A]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver
                        ? "bg-[#DF2929]"
                        : isWarning
                          ? "bg-[#EA920F]"
                          : "bg-gradient-to-r from-[#692296] to-[#DC2626]"
                    }`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
