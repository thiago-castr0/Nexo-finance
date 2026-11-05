"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Cpu,
  FileSpreadsheet,
  Home,
  Layers,
  PlusCircle,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  UploadCloud,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import {
  FilterChipGroup,
  type FilterChipOption,
} from "@/components/ui/filter-chips";
import { formatCurrencyBRL } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

interface TransactionsTableProps {
  transactions: TransactionRecord[];
  onDeleteTransaction: (id: string) => void;
  onOpenManualEntry: () => void;
  onTriggerUpload: () => void;
}

type FilterMode = "ALL" | "INCOME" | "EXPENSE" | "AI_OCR";

function getCategoryVisual(category: string, isIncome: boolean) {
  const lower = category.toLowerCase();
  if (isIncome || lower.includes("salário") || lower.includes("renda")) {
    return {
      icon: Briefcase,
      bg: "bg-[#0CB853]/12 text-[#0CB853] dark:bg-[#0CB853]/20 dark:text-[#46C87D]",
    };
  }
  if (lower.includes("moradia") || lower.includes("aluguel")) {
    return {
      icon: Home,
      bg: "bg-[#DC2626]/12 text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#F59B92]",
    };
  }
  if (lower.includes("alimenta") || lower.includes("mercado")) {
    return {
      icon: ShoppingBag,
      bg: "bg-[#692296]/12 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]",
    };
  }
  if (
    lower.includes("assinatura") ||
    lower.includes("software") ||
    lower.includes("cloud")
  ) {
    return {
      icon: Cpu,
      bg: "bg-[#2572CE]/12 text-[#2572CE] dark:bg-[#2572CE]/20 dark:text-[#8CB9EB]",
    };
  }
  return {
    icon: Wallet,
    bg: "bg-[#EA920F]/12 text-[#EA920F] dark:bg-[#EA920F]/20 dark:text-[#ECD54A]",
  };
}

export function TransactionsTable({
  transactions,
  onDeleteTransaction,
  onOpenManualEntry,
  onTriggerUpload,
}: TransactionsTableProps) {
  const [filterMode, setFilterMode] = React.useState<FilterMode>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  const counts = React.useMemo(() => {
    let income = 0;
    let expense = 0;
    let ai = 0;
    for (const tx of transactions) {
      if (tx.type === "INCOME") income++;
      if (tx.type === "EXPENSE") expense++;
      if (tx.source === "AI_OCR") ai++;
    }
    return { all: transactions.length, income, expense, ai };
  }, [transactions]);

  const filterChips: FilterChipOption<FilterMode>[] = [
    {
      id: "ALL",
      label: "Todos",
      icon: Layers,
      count: counts.all,
      intent: "brand",
    },
    {
      id: "INCOME",
      label: "Entradas",
      icon: ArrowUpRight,
      count: counts.income,
      intent: "income",
    },
    {
      id: "EXPENSE",
      label: "Saídas",
      icon: ArrowDownRight,
      count: counts.expense,
      intent: "expense",
    },
    {
      id: "AI_OCR",
      label: "IA",
      icon: Sparkles,
      count: counts.ai,
      intent: "ai",
    },
  ];

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((tx) => {
      if (filterMode === "INCOME" && tx.type !== "INCOME") return false;
      if (filterMode === "EXPENSE" && tx.type !== "EXPENSE") return false;
      if (filterMode === "AI_OCR" && tx.source !== "AI_OCR") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDesc = tx.description.toLowerCase().includes(q);
        const matchCat = tx.category.toLowerCase().includes(q);
        return matchDesc || matchCat;
      }

      return true;
    });
  }, [transactions, filterMode, searchQuery]);

  return (
    <GlassPanel intent="neutral" blur="xl" topBeam className="p-5 sm:p-6 space-y-4">
      {/* Topo Clean: Título + Filtros + Busca na mesma linha */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-[#18181B] dark:text-[#FFFFFF]">
            Meus Lançamentos ({filteredTransactions.length})
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            Histórico de receitas e despesas do mês
          </p>
        </div>

        {transactions.length > 0 ? (
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <FilterChipGroup
              options={filterChips}
              value={filterMode}
              onChange={setFilterMode}
            />

            <div className="w-full sm:w-64">
              <Input
                placeholder="Buscar lançamento..."
                icon={Search}
                value={searchQuery}
                aria-label="Buscar lançamentos por descrição ou categoria"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Container Clean das Linhas */}
      <div className="overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white dark:border-white/10 dark:bg-[#1C1C22]">
        {transactions.length === 0 ? (
          <div
            data-testid="empty-state"
            className="flex flex-col items-center justify-center px-6 py-12 text-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#692296]/10 text-[#692296]">
              <FileSpreadsheet
                className="h-5 w-5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </div>
            <h4 className="mt-3 text-sm font-bold text-[#18181B] dark:text-[#FFFFFF]">
              Nenhum lançamento registrado
            </h4>
            <p className="mt-1 max-w-sm text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Importe uma fatura com IA ou adicione um gasto manualmente.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                icon={UploadCloud}
                onClick={onTriggerUpload}
              >
                Importar com IA
              </Button>
              <Button
                type="button"
                size="sm"
                variant="primary"
                icon={PlusCircle}
                onClick={onOpenManualEntry}
              >
                Novo Lançamento
              </Button>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#71717A] dark:text-[#A1A1AA]">
            Nenhum lançamento encontrado para este filtro.
          </div>
        ) : (
          <>
            {/* Visão Mobile Clean (< md): Cartões Diretos de 1 Olhar */}
            <div className="divide-y divide-[#E4E4E7] md:hidden dark:divide-white/10">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === "INCOME";
                const visual = getCategoryVisual(tx.category, isIncome);
                const CatIcon = visual.icon;
                return (
                  <div
                    key={`mobile-${tx.id}`}
                    className="flex items-center justify-between gap-3 p-3.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${visual.bg}`}
                      >
                        <CatIcon className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#18181B] dark:text-[#FFFFFF]">
                          {tx.description}
                        </p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                          {tx.category} •{" "}
                          {tx.transactionDate.split("-").reverse().join("/")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-sm font-bold whitespace-nowrap tabular-nums ${
                          isIncome
                            ? "text-[#0CB853] dark:text-[#46C87D]"
                            : "text-[#DF2929] dark:text-[#F4948C]"
                        }`}
                      >
                        {isIncome ? "+ " : "- "}
                        {formatCurrencyBRL(tx.amount)}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        icon={Trash2}
                        aria-label={`Excluir transação ${tx.description}`}
                        onClick={() => onDeleteTransaction(tx.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visão Desktop Clean de Ponta a Ponta (>= md): Apenas o Essencial */}
            <div className="hidden overflow-x-auto md:block">
              <table
                data-testid="transactions-table"
                className="w-full border-collapse text-left text-sm"
              >
                <thead>
                  <tr className="border-b border-[#E4E4E7] bg-[#F8FAFC] text-xs font-semibold text-[#71717A] dark:border-white/10 dark:bg-white/5 dark:text-[#A1A1AA]">
                    <th className="px-5 py-3">Descrição</th>
                    <th className="px-5 py-3">Categoria</th>
                    <th className="px-5 py-3">Data</th>
                    <th className="px-5 py-3 text-right">Valor</th>
                    <th className="px-5 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7] dark:divide-white/10">
                  {filteredTransactions.map((tx) => {
                    const isIncome = tx.type === "INCOME";
                    const visual = getCategoryVisual(tx.category, isIncome);
                    const CatIcon = visual.icon;

                    return (
                      <tr
                        key={tx.id}
                        data-testid="transaction-row"
                        className="transition-colors hover:bg-[#F8FAFC] dark:hover:bg-white/5"
                      >
                        {/* 1. Descrição + Ícone */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${visual.bg}`}
                            >
                              <CatIcon className="h-4 w-4" strokeWidth={1.75} />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#18181B] dark:text-[#FFFFFF]">
                                {tx.description}
                              </span>
                              {tx.source === "AI_OCR" ? (
                                <Badge variant="purple" icon={Sparkles}>
                                  IA
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        {/* 2. Categoria */}
                        <td className="px-5 py-3.5">
                          <span className="inline-flex rounded-lg border border-[#E4E4E7] bg-[#F4F4F5]/70 px-2.5 py-1 text-xs font-medium text-[#3F3F46] dark:border-white/10 dark:bg-white/5 dark:text-[#D4D4D8]">
                            {tx.category}
                          </span>
                        </td>

                        {/* 3. Data */}
                        <td className="px-5 py-3.5 text-xs text-[#71717A] tabular-nums dark:text-[#A1A1AA]">
                          {tx.transactionDate.split("-").reverse().join("/")}
                        </td>

                        {/* 4. Valor */}
                        <td
                          className={`px-5 py-3.5 text-right text-sm font-bold whitespace-nowrap tabular-nums ${
                            isIncome
                              ? "text-[#0CB853] dark:text-[#46C87D]"
                              : "text-[#DF2929] dark:text-[#F4948C]"
                          }`}
                        >
                          {isIncome ? "+ " : "- "}
                          {formatCurrencyBRL(tx.amount)}
                        </td>

                        {/* 5. Ação */}
                        <td className="px-5 py-3.5 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            icon={Trash2}
                            aria-label={`Excluir transação ${tx.description}`}
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
          </>
        )}
      </div>
    </GlassPanel>
  );
}
