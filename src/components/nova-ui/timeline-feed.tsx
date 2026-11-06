"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Car,
  CreditCard,
  HeartPulse,
  Home,
  LayoutList,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Utensils,
  Download,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrencyBRL } from "@/lib/finance";
import { exportTransactionsToCSV } from "@/lib/export-csv";
import type { TransactionRecord } from "@/lib/schemas/transaction";

function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}`;
}

export interface TimelineFeedProps {
  transactions: TransactionRecord[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction?: (transaction: TransactionRecord) => void;
}

type QuickFilter = "ALL" | "INCOME" | "EXPENSE";

function getCategoryIcon(category: string, type: "INCOME" | "EXPENSE") {
  const lower = category.toLowerCase();
  if (type === "INCOME" || lower.includes("salário") || lower.includes("renda")) {
    return Briefcase;
  }
  if (lower.includes("moradia") || lower.includes("aluguel")) {
    return Home;
  }
  if (lower.includes("alimenta") || lower.includes("mercado")) {
    return Utensils;
  }
  if (lower.includes("transporte") || lower.includes("combustível")) {
    return Car;
  }
  if (lower.includes("saúde") || lower.includes("farmácia")) {
    return HeartPulse;
  }
  if (lower.includes("assinatura") || lower.includes("software")) {
    return CreditCard;
  }
  return ShoppingBag;
}

export function TimelineFeed({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
}: TimelineFeedProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<QuickFilter>("ALL");

  const filtered = React.useMemo(() => {
    return transactions.filter((tx) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesText =
        !q ||
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q);

      const matchesFilter =
        activeFilter === "ALL" ||
        (activeFilter === "INCOME" && tx.type === "INCOME") ||
        (activeFilter === "EXPENSE" && tx.type === "EXPENSE");

      return matchesText && matchesFilter;
    });
  }, [transactions, searchQuery, activeFilter]);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 sm:p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5]">
      {/* Topo enxuto: Título + Filtros + Busca */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
          Lançamentos
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeFilter === "ALL" ? "primary" : "neutral"}
            icon={LayoutList}
            onClick={() => setActiveFilter("ALL")}
          >
            Todos
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activeFilter === "INCOME" ? "income" : "neutral"}
            icon={ArrowUpRight}
            onClick={() => setActiveFilter("INCOME")}
          >
            Entradas
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activeFilter === "EXPENSE" ? "expense" : "neutral"}
            icon={ArrowDownRight}
            onClick={() => setActiveFilter("EXPENSE")}
          >
            Saídas
          </Button>
          <Button
            type="button"
            size="sm"
            variant="neutral"
            icon={Download}
            onClick={() => exportTransactionsToCSV(filtered)}
            title="Baixar extrato filtrado em CSV"
          >
            CSV
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <Input
          type="search"
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar lançamento..."
          aria-label="Buscar lançamento"
        />
      </div>

      {/* Lista Clean com Alto Contraste WCAG AA */}
      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[#D4D4D8] bg-[#F8FAFC] p-8 text-center dark:border-[#3F3F46] dark:bg-[#121216]">
          <p className="text-xs font-semibold text-[#3F3F46] dark:text-[#D4D4D8]">
            Nenhum lançamento encontrado.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex-1 flex flex-col justify-between divide-y divide-[#E4E4E7] dark:divide-[#27272A]">
          {filtered.map((tx) => {
            const isIncome = tx.type === "INCOME";
            const CategoryIcon = getCategoryIcon(tx.category, tx.type);

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-3 py-3.5 transition-colors hover:bg-[#F4F4F5]/70 dark:hover:bg-[#27272A]/50 px-2 rounded-2xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      isIncome
                        ? "bg-[#BCE5CB]/60 text-[#0CB853] dark:bg-[#0CB853]/20 dark:text-[#46C87D]"
                        : "bg-[#F4F4F5] text-[#18181B] dark:bg-[#27272A] dark:text-[#E4E4E7]"
                    }`}
                  >
                    <CategoryIcon className="h-4 w-4" strokeWidth={1.75} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-bold text-[#18181B] dark:text-[#FFFFFF]">
                        {tx.description}
                      </p>
                      {tx.source === "AI_OCR" && (
                        <Sparkles
                          className="h-3.5 w-3.5 shrink-0 text-[#692296] dark:text-[#C59BE3]"
                          aria-label="Lido por IA"
                        />
                      )}
                      {tx.isRecurring && (
                        <span className="rounded-md bg-[#DEC5EF]/40 px-1.5 py-0.5 text-[9px] font-extrabold text-[#692296] dark:bg-[#692296]/30 dark:text-[#DEC5EF]">
                          Fixa
                        </span>
                      )}
                      {tx.totalInstallments && tx.totalInstallments > 1 && (
                        <span className="rounded-md bg-[#BCD6F2]/40 px-1.5 py-0.5 text-[9px] font-extrabold text-[#2572CE] dark:bg-[#2572CE]/20 dark:text-[#BCD6F2]">
                          {tx.installmentNumber}/{tx.totalInstallments}x
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-[#3F3F46] dark:text-[#A1A1AA]">
                      {tx.category} • {formatDateBR(tx.transactionDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-sm font-extrabold tabular-nums whitespace-nowrap ${
                      isIncome
                        ? "text-[#0CB853] dark:text-[#46C87D]"
                        : "text-[#DF2929] dark:text-[#EC6862]"
                    }`}
                  >
                    {isIncome ? "+" : "-"} {formatCurrencyBRL(tx.amount)}
                  </span>

                  <div className="flex items-center gap-1">
                    {onEditTransaction && (
                      <button
                        type="button"
                        onClick={() => onEditTransaction(tx)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[#3F3F46] transition hover:bg-[#DEC5EF]/40 hover:text-[#692296] dark:text-[#A1A1AA] dark:hover:bg-[#692296]/20 dark:hover:text-[#DEC5EF] cursor-pointer"
                        title="Editar lançamento"
                        aria-label={`Editar ${tx.description}`}
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[#3F3F46] transition hover:bg-[#F9C5BD]/50 hover:text-[#DF2929] dark:text-[#A1A1AA] dark:hover:bg-[#DF2929]/20 cursor-pointer"
                      title="Excluir lançamento"
                      aria-label={`Excluir ${tx.description}`}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
