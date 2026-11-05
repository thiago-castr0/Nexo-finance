"use client";

import * as React from "react";
import { PieChart } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

export interface CategoryEnvelopesProps {
  transactions: TransactionRecord[];
  totalIncome?: number;
  totalExpenses?: number;
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
        const budget =
          DEFAULT_CATEGORY_BUDGETS[category] ??
          Math.max(800, Math.round(spent * 1.3));
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

  return (
    <div className="flex h-full flex-1 flex-col justify-between rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 sm:p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DEC5EF]/60 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
          <PieChart className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
          Gastos por Categoria
        </h3>
      </div>

      {categoryBreakdown.length === 0 ? (
        <p className="text-xs font-medium text-[#3F3F46] dark:text-[#D4D4D8] text-center py-4">
          Nenhuma despesa registrada.
        </p>
      ) : (
        <div className="space-y-3">
          {categoryBreakdown.map((item) => {
            const isWarning = item.percent >= 80 && item.percent < 100;
            const isOver = item.percent >= 100;

            return (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#18181B] dark:text-[#FFFFFF]">
                    {item.category}
                  </span>
                  <span className="tabular-nums font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                    {formatCurrencyBRL(item.spent)}
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E4E4E7] dark:bg-[#27272A]">
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
