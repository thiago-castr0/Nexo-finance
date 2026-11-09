"use client";

import * as React from "react";
import {
  PieChart,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  X,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrencyBRL } from "@/lib/finance";
import { saveCategoryBudgetsAction } from "@/app/actions/budgets";
import type { TransactionRecord } from "@/lib/schemas/transaction";

export interface CategoryEnvelopesProps {
  transactions: TransactionRecord[];
  initialBudgets?: Record<string, number>;
  onBudgetsChange?: (budgets: Record<string, number>) => void;
  totalIncome?: number;
  totalExpenses?: number;
}

const DEFAULT_CATEGORY_BUDGETS: Record<string, number> = {
  Moradia: 0,
  Alimentação: 0,
  "Assinaturas & Software": 0,
  Transporte: 0,
  "Saúde & Farmácia": 0,
  "Lazer & Outros": 0,
};

const STORAGE_KEY = "nexo_category_budgets_v2_clean";

export function CategoryEnvelopes({
  transactions,
  initialBudgets,
  onBudgetsChange,
}: CategoryEnvelopesProps) {
  const [budgets, setBudgets] = React.useState<Record<string, number>>(() => {
    if (initialBudgets && Object.keys(initialBudgets).length > 0) {
      return { ...DEFAULT_CATEGORY_BUDGETS, ...initialBudgets };
    }
    if (typeof window === "undefined") return DEFAULT_CATEGORY_BUDGETS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CATEGORY_BUDGETS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback para valores padrão
    }
    return DEFAULT_CATEGORY_BUDGETS;
  });
  const [isEditingBudgets, setIsEditingBudgets] = React.useState(false);
  const [draftBudgets, setDraftBudgets] = React.useState<Record<string, number>>(budgets);
  const [isSaving, startSavingTransition] = React.useTransition();

  const openBudgetEditor = () => {
    setDraftBudgets({ ...budgets });
    setIsEditingBudgets(true);
  };

  const saveBudgetEditor = () => {
    startSavingTransition(async () => {
      setBudgets(draftBudgets);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draftBudgets));
      } catch {
        // Fallback
      }
      await saveCategoryBudgetsAction(draftBudgets);
      if (onBudgetsChange) {
        onBudgetsChange(draftBudgets);
      }
      setIsEditingBudgets(false);
    });
  };

  const resetToDefaults = () => {
    setDraftBudgets(DEFAULT_CATEGORY_BUDGETS);
  };

  const categoryBreakdown = React.useMemo(() => {
    const map = new Map<string, number>();

    transactions
      .filter((tx) => tx.type === "EXPENSE")
      .forEach((tx) => {
        const current = map.get(tx.category) ?? 0;
        map.set(tx.category, Math.round((current + tx.amount) * 100) / 100);
      });

    // Make sure categories present in budgets are also listed if desired
    const allCategories = new Set([...Array.from(map.keys()), ...Object.keys(budgets)]);

    return Array.from(allCategories)
      .map((category) => {
        const spent = map.get(category) ?? 0;
        const budget = budgets[category] ?? 1000;
        const percent = budget > 0 ? Math.round((spent / budget) * 100) : 100;
        const remaining = Math.round((budget - spent) * 100) / 100;
        return {
          category,
          spent,
          budget,
          percent,
          remaining,
        };
      })
      .filter((item) => item.spent > 0 || budgets[item.category])
      .sort((a, b) => b.spent - a.spent);
  }, [transactions, budgets]);

  const totalSpent = categoryBreakdown.reduce((acc, curr) => acc + curr.spent, 0);
  const totalBudgeted = categoryBreakdown.reduce((acc, curr) => acc + curr.budget, 0);
  const overallPercent = totalBudgeted > 0 ? Math.min(100, Math.round((totalSpent / totalBudgeted) * 100)) : 0;

  return (
    <div className="flex h-full flex-1 flex-col justify-between rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 sm:p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] space-y-4">
      {/* Topo com Título + Botão de Configuração de Tetos */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DEC5EF]/60 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
            <PieChart className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
              Envelopes de Orçamento
            </h3>
            <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
              {formatCurrencyBRL(totalSpent)} gastos de {formatCurrencyBRL(totalBudgeted)} orçados ({overallPercent}%)
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="neutral"
          icon={SlidersHorizontal}
          onClick={openBudgetEditor}
          title="Personalizar limites de gastos por categoria"
        >
          Ajustar Metas
        </Button>
      </div>

      {categoryBreakdown.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 rounded-2xl border border-dashed border-[#D4D4D8] bg-[#F8FAFC]/50 dark:border-[#3F3F46] dark:bg-[#121216]/50">
          <p className="text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
            Nenhum envelope configurado ainda
          </p>
          <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
            Defina seus limites mensais por categoria para manter suas finanças sob controle.
          </p>
          <Button
            type="button"
            size="sm"
            variant="primary"
            icon={SlidersHorizontal}
            onClick={openBudgetEditor}
          >
            Configurar Tetos de Gastos
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {categoryBreakdown.map((item) => {
            const isWarning = item.percent >= 80 && item.percent < 100;
            const isOver = item.percent >= 100;

            return (
              <div key={item.category} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#18181B] dark:text-[#FFFFFF]">
                      {item.category}
                    </span>
                    {isOver && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#DF2929]/10 px-1.5 py-0.5 text-[10px] font-extrabold text-[#DF2929] dark:bg-[#DF2929]/20">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        Estouro ({item.percent}%)
                      </span>
                    )}
                    {isWarning && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#EA920F]/10 px-1.5 py-0.5 text-[10px] font-extrabold text-[#EA920F] dark:bg-[#EA920F]/20">
                        Atenção ({item.percent}%)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] tabular-nums">
                    <span className="font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                      {formatCurrencyBRL(item.spent)}
                    </span>
                    <span className="text-[#A1A1AA]">/</span>
                    <span className="font-medium text-[#71717A] dark:text-[#A1A1AA]">
                      {formatCurrencyBRL(item.budget)}
                    </span>
                  </div>
                </div>

                {/* Barra de Progresso com Glow e Cores Estratégicas */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E4E4E7] dark:bg-[#27272A]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver
                        ? "bg-[#DF2929]"
                        : isWarning
                          ? "bg-[#EA920F]"
                          : "bg-gradient-to-r from-[#692296] to-[#DC2626]"
                    }`}
                    style={{ width: `${Math.min(100, item.percent)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
                  <span>
                    {item.remaining >= 0
                      ? `Resta ${formatCurrencyBRL(item.remaining)} no envelope`
                      : `Excedeu em ${formatCurrencyBRL(Math.abs(item.remaining))}`}
                  </span>
                  <span className="tabular-nums font-semibold">
                    {item.percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          MODAL DE PERSONALIZAÇÃO DE LIMITES / METAS DE ORÇAMENTO
          ==================================================================== */}
      {isEditingBudgets && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#E4E4E7] bg-white/95 p-6 text-[#18181B] shadow-2xl backdrop-blur-2xl dark:border-[#27272A] dark:bg-[#18181B]/95 dark:text-[#F4F4F5] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7] dark:border-[#27272A]">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DEC5EF]/60 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                  Metas de Gastos Mensais
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingBudgets(false)}
                className="rounded-lg p-1 text-[#71717A] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Defina o teto máximo desejado para cada envelope. Alertas automáticos serão disparados ao atingir 80% e 100%.
            </p>

            <div className="my-4 max-h-[50vh] space-y-3 overflow-y-auto pr-1">
              {Object.keys(draftBudgets).map((category) => (
                <div key={category} className="flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold text-[#18181B] dark:text-[#FFFFFF] truncate">
                    {category}
                  </label>
                  <div className="w-36">
                    <Input
                      type="number"
                      step="50"
                      min="0"
                      value={draftBudgets[category] ?? 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setDraftBudgets((prev) => ({ ...prev, [category]: val }));
                      }}
                      className="text-right tabular-nums text-xs font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E4E4E7] dark:border-[#27272A]">
              <Button
                type="button"
                size="sm"
                variant="neutral"
                icon={RotateCcw}
                onClick={resetToDefaults}
                title="Voltar para valores padrões sugeridos"
              >
                Padrão
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="neutral"
                  onClick={() => setIsEditingBudgets(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  icon={CheckCircle2}
                  disabled={isSaving}
                  onClick={saveBudgetEditor}
                >
                  {isSaving ? "Salvando..." : "Salvar Metas"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
