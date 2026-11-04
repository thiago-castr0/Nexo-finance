"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  FileSpreadsheet,
  Layers,
  PenLine,
  PlusCircle,
  Search,
  Sparkles,
  Tag,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyBRL } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

interface TransactionsTableProps {
  transactions: TransactionRecord[];
  onDeleteTransaction: (id: string) => void;
  onOpenManualEntry: () => void;
  onTriggerUpload: () => void;
}

type FilterMode = "ALL" | "INCOME" | "EXPENSE" | "AI_OCR";

export function TransactionsTable({
  transactions,
  onDeleteTransaction,
  onOpenManualEntry,
  onTriggerUpload,
}: TransactionsTableProps) {
  const [filterMode, setFilterMode] = React.useState<FilterMode>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

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
    <Card className="nexo-card-hover">
      <CardHeader className="space-y-4 border-b border-[#E4E4E7] pb-4 dark:border-[#3F3F46]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              Livro-Razão de Lançamentos ({filteredTransactions.length})
            </CardTitle>
            <CardDescription>
              Alinhamento em numerais tabulares, categorização inteligente e
              filtragem instantânea
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            variant="primary"
            icon={PlusCircle}
            data-testid="open-manual-modal-btn"
            onClick={onOpenManualEntry}
          >
            Adicionar Lançamento
          </Button>
        </div>

        {/* Barra de Filtros Rápidos (Sempre Ícone Lucide + Texto em linha única) */}
        {transactions.length > 0 ? (
          <div className="flex flex-col justify-between gap-3 pt-1 lg:flex-row lg:items-center">
            <div
              role="group"
              aria-label="Filtrar lançamentos"
              className="flex flex-wrap items-center gap-2"
            >
              <Button
                type="button"
                size="sm"
                icon={Layers}
                variant={filterMode === "ALL" ? "primary" : "neutral"}
                onClick={() => setFilterMode("ALL")}
              >
                Todos ({transactions.length})
              </Button>
              <Button
                type="button"
                size="sm"
                icon={ArrowUpRight}
                variant={filterMode === "INCOME" ? "income" : "neutral"}
                onClick={() => setFilterMode("INCOME")}
              >
                Entradas (+)
              </Button>
              <Button
                type="button"
                size="sm"
                icon={ArrowDownRight}
                variant={filterMode === "EXPENSE" ? "expense" : "neutral"}
                onClick={() => setFilterMode("EXPENSE")}
              >
                Saídas (-)
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filterMode === "AI_OCR" ? "secondary" : "neutral"}
                icon={Sparkles}
                onClick={() => setFilterMode("AI_OCR")}
              >
                Lidos por IA
              </Button>
            </div>

            <div className="w-full lg:w-72">
              <Input
                placeholder="Buscar descrição ou categoria..."
                icon={Search}
                value={searchQuery}
                aria-label="Buscar lançamentos por descrição ou categoria"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="p-0">
        {transactions.length === 0 ? (
          /* Onboarding Silencioso (Zero State) */
          <div
            data-testid="empty-state"
            className="flex flex-col items-center justify-center px-6 py-14 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C59BE3] bg-[#DEC5EF]/45 text-[#692296]">
              <FileSpreadsheet
                className="h-6 w-6"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h4 className="mt-4 text-base font-semibold text-[#18181B] dark:text-[#F4F4F5]">
              Seu controle financeiro começa aqui
            </h4>
            <p className="mt-1 max-w-md text-xs text-[#71717A] dark:text-[#D4D4D8]">
              Faça o upload do seu primeiro extrato PDF ou print de comprovante
              para a IA categorizar automaticamente, ou adicione um lançamento
              manual.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                variant="secondary"
                icon={UploadCloud}
                onClick={onTriggerUpload}
              >
                Importar Extrato com IA
              </Button>
              <Button
                type="button"
                variant="neutral"
                icon={PlusCircle}
                onClick={onOpenManualEntry}
              >
                Adicionar Manualmente
              </Button>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#71717A]">
            Nenhum lançamento encontrado para o filtro selecionado.
          </div>
        ) : (
          <>
            {/* Visão Mobile-First em Cartões Compactos (< md) */}
            <div className="divide-y divide-[#E4E4E7] md:hidden dark:divide-[#3F3F46]">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === "INCOME";
                return (
                  <div
                    key={`mobile-${tx.id}`}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1.5">
                      <p className="truncate text-sm font-semibold text-[#18181B] dark:text-[#F4F4F5]">
                        {tx.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="neutral" icon={Tag}>
                          {tx.category}
                        </Badge>
                        {tx.source === "AI_OCR" ? (
                          <Badge variant="purple" icon={Sparkles}>
                            IA OCR
                          </Badge>
                        ) : (
                          <Badge variant="info" icon={PenLine}>
                            Manual
                          </Badge>
                        )}
                        <span className="text-[11px] text-[#71717A] tabular-nums">
                          {tx.transactionDate.split("-").reverse().join("/")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span
                        className={`text-sm font-bold whitespace-nowrap tabular-nums ${
                          isIncome ? "text-[#0CB853]" : "text-[#DF2929]"
                        }`}
                      >
                        {isIncome ? "+ " : "- "}
                        {formatCurrencyBRL(tx.amount)}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="expense"
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

            {/* Visão Desktop em Tabela Contábil (>= md) */}
            <div className="hidden overflow-x-auto md:block">
              <table
                data-testid="transactions-table"
                className="w-full border-collapse text-left text-sm"
              >
                <thead>
                  <tr className="border-b border-[#E4E4E7] bg-[#F4F4F5]/60 text-xs uppercase tracking-wider text-[#71717A] dark:border-[#3F3F46] dark:bg-[#09090B]/40 dark:text-[#D4D4D8]">
                    <th className="px-6 py-3.5 font-medium">Descrição</th>
                    <th className="px-6 py-3.5 font-medium">Categoria</th>
                    <th className="px-6 py-3.5 font-medium">Origem</th>
                    <th className="px-6 py-3.5 font-medium">Data</th>
                    <th className="px-6 py-3.5 text-right font-medium">
                      Valor
                    </th>
                    <th className="px-6 py-3.5 text-right font-medium">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7] dark:divide-[#3F3F46]">
                  {filteredTransactions.map((tx) => {
                    const isIncome = tx.type === "INCOME";
                    return (
                      <tr
                        key={tx.id}
                        data-testid="transaction-row"
                        className="transition-colors hover:bg-[#F4F4F5]/75 dark:hover:bg-[#3F3F46]/25"
                      >
                        <td className="px-6 py-4 font-medium text-[#18181B] dark:text-[#F4F4F5]">
                          {tx.description}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="neutral" icon={Tag}>
                            {tx.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {tx.source === "AI_OCR" ? (
                            <Badge variant="purple" icon={Sparkles}>
                              IA OCR
                            </Badge>
                          ) : (
                            <Badge variant="info" icon={PenLine}>
                              Manual
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-[#71717A] tabular-nums dark:text-[#D4D4D8]">
                          {tx.transactionDate.split("-").reverse().join("/")}
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-semibold whitespace-nowrap tabular-nums ${
                            isIncome
                              ? "text-[#0CB853] dark:text-[#46C87D]"
                              : "text-[#DF2929] dark:text-[#EC6862]"
                          }`}
                        >
                          {isIncome ? "+ " : "- "}
                          {formatCurrencyBRL(tx.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
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
      </CardContent>
    </Card>
  );
}
