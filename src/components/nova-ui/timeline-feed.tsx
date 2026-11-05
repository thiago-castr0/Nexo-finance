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
  Table2,
  Trash2,
  UserCheck,
  Utensils,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyBRL } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export interface TimelineFeedProps {
  transactions: TransactionRecord[];
  onDeleteTransaction: (id: string) => void;
}

type QuickFilter = "ALL" | "INCOME" | "EXPENSE" | "AI_OCR";
type ViewMode = "TIMELINE" | "TABLE";

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
}: TimelineFeedProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<QuickFilter>("ALL");
  const [viewMode, setViewMode] = React.useState<ViewMode>("TIMELINE");

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
        (activeFilter === "EXPENSE" && tx.type === "EXPENSE") ||
        (activeFilter === "AI_OCR" && tx.source === "AI_OCR");

      return matchesText && matchesFilter;
    });
  }, [transactions, searchQuery, activeFilter]);

  const filterButtons: {
    id: QuickFilter;
    label: string;
    icon: typeof LayoutList;
    variant: "primary" | "income" | "expense" | "secondary" | "neutral";
  }[] = [
    { id: "ALL", label: "Todos", icon: LayoutList, variant: "primary" },
    { id: "INCOME", label: "Entradas", icon: ArrowUpRight, variant: "income" },
    { id: "EXPENSE", label: "Saídas", icon: ArrowDownRight, variant: "expense" },
    { id: "AI_OCR", label: "Lidos por IA", icon: Sparkles, variant: "secondary" },
  ];

  return (
    <div className="rounded-3xl border border-[#E4E4E7] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#27272A] dark:bg-[#141418]">
      {/* Cabeçalho do Extrato */}
      <div className="flex flex-col gap-4 border-b border-[#E4E4E7] pb-4 dark:border-[#27272A] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
              Extrato de Movimentações
            </h2>
            <span className="rounded-full bg-[#F4F4F5] px-2.5 py-0.5 text-xs font-bold text-[#3F3F46] dark:bg-[#27272A] dark:text-[#D4D4D8] tabular-nums">
              {filtered.length}
            </span>
          </div>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            Acompanhe entradas e despesas em lista estilo app ou tabela compacta
          </p>
        </div>

        {/* Alternador de Visualização (Lista App vs Tabela) */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Button
            type="button"
            size="sm"
            variant={viewMode === "TIMELINE" ? "primary" : "neutral"}
            icon={LayoutList}
            onClick={() => setViewMode("TIMELINE")}
          >
            Lista App
          </Button>
          <Button
            type="button"
            size="sm"
            variant={viewMode === "TABLE" ? "primary" : "neutral"}
            icon={Table2}
            onClick={() => setViewMode("TABLE")}
          >
            Tabela
          </Button>
        </div>
      </div>

      {/* Barra de Busca e Filtros Rápidos */}
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterButtons.map((btn) => (
            <Button
              key={btn.id}
              type="button"
              size="sm"
              variant={activeFilter === btn.id ? btn.variant : "neutral"}
              icon={btn.icon}
              onClick={() => setActiveFilter(btn.id)}
            >
              {btn.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-72">
          <div className="flex-1">
            <Input
              type="search"
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar descrição ou categoria..."
              aria-label="Buscar lançamentos"
            />
          </div>
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={X}
              onClick={() => setSearchQuery("")}
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Estado Vazio */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#D4D4D8] bg-[#F8FAFC] p-10 text-center dark:border-[#3F3F46] dark:bg-[#0D0D11]">
          <p className="text-sm font-bold text-[#18181B] dark:text-[#FFFFFF]">
            Nenhuma movimentação encontrada
          </p>
          <p className="mt-1 text-xs text-[#71717A] dark:text-[#A1A1AA]">
            Tente outro termo na busca ou adicione um novo lançamento.
          </p>
        </div>
      ) : viewMode === "TIMELINE" ? (
        /* MODO 1: LISTA ESTILO APP BANCÁRIO MODERNO */
        <div className="mt-5 divide-y divide-[#E4E4E7]/80 dark:divide-[#27272A]">
          {filtered.map((tx) => {
            const isIncome = tx.type === "INCOME";
            const CategoryIcon = getCategoryIcon(tx.category, tx.type);

            return (
              <div
                key={tx.id}
                className="group flex items-center justify-between gap-3 py-3.5 transition-colors hover:bg-[#F8FAFC] dark:hover:bg-[#1C1C22]/60 px-2 rounded-2xl"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Ícone da Categoria */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                      isIncome
                        ? "border-[#7BD6A0] bg-[#BCE5CB]/35 text-[#0CB853] dark:border-[#0CB853]/30 dark:bg-[#0CB853]/15 dark:text-[#46C87D]"
                        : "border-[#E4E4E7] bg-[#F4F4F5] text-[#3F3F46] dark:border-[#27272A] dark:bg-[#1E1E24] dark:text-[#D4D4D8]"
                    }`}
                  >
                    <CategoryIcon className="h-5 w-5" strokeWidth={1.75} />
                  </div>

                  {/* Título e Metadados Limpos */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-[#18181B] dark:text-[#FFFFFF]">
                        {tx.description}
                      </p>
                      {tx.source === "AI_OCR" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#DEC5EF]/50 px-1.5 py-0.5 text-[10px] font-bold text-[#692296] dark:bg-[#692296]/25 dark:text-[#C59BE3] whitespace-nowrap">
                          <Sparkles className="h-2.5 w-2.5 shrink-0" />
                          IA
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span className="tabular-nums">
                        {formatDateBR(tx.transactionDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Valor + Ação Excluir */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p
                      className={`text-sm sm:text-base font-extrabold tabular-nums whitespace-nowrap ${
                        isIncome
                          ? "text-[#0CB853] dark:text-[#46C87D]"
                          : "text-[#18181B] dark:text-[#FFFFFF]"
                      }`}
                    >
                      {isIncome ? "+" : "-"} {formatCurrencyBRL(tx.amount)}
                    </p>
                    <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA] hidden sm:block">
                      {isIncome ? "Entrada" : "Despesa"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-[#71717A] transition hover:border-[#F4948C] hover:bg-[#F9C5BD]/30 hover:text-[#DF2929] dark:text-[#A1A1AA] dark:hover:bg-[#DF2929]/20 dark:hover:text-[#EC6862] cursor-pointer"
                    aria-label={`Excluir ${tx.description}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MODO 2: TABELA COMPACTA DE PONTA A PONTA */
        <div className="mt-5 overflow-x-auto rounded-2xl border border-[#E4E4E7] dark:border-[#27272A]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E4E7] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#71717A] dark:border-[#27272A] dark:bg-[#0D0D11] dark:text-[#A1A1AA]">
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Origem</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7] text-sm dark:divide-[#27272A]">
              {filtered.map((tx) => {
                const isIncome = tx.type === "INCOME";
                return (
                  <tr
                    key={tx.id}
                    className="transition-colors hover:bg-[#F8FAFC] dark:hover:bg-[#1C1C22]/50"
                  >
                    <td className="py-3 px-4 font-bold text-[#18181B] dark:text-[#FFFFFF]">
                      {tx.description}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#3F3F46] dark:text-[#D4D4D8]">
                      {tx.category}
                    </td>
                    <td className="py-3 px-4">
                      {tx.source === "AI_OCR" ? (
                        <Badge variant="purple" icon={Sparkles}>
                          IA OCR
                        </Badge>
                      ) : (
                        <Badge variant="neutral" icon={UserCheck}>
                          Manual
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#71717A] dark:text-[#A1A1AA] tabular-nums whitespace-nowrap">
                      {formatDateBR(tx.transactionDate)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-extrabold tabular-nums whitespace-nowrap ${
                        isIncome
                          ? "text-[#0CB853] dark:text-[#46C87D]"
                          : "text-[#DF2929] dark:text-[#EC6862]"
                      }`}
                    >
                      {isIncome ? "+" : "-"} {formatCurrencyBRL(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        type="button"
                        variant="expense"
                        size="sm"
                        icon={Trash2}
                        onClick={() => onDeleteTransaction(tx.id)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
