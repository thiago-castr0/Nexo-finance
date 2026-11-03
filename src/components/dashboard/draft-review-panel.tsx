"use client";

import * as React from "react";
import {
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
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
import { calculateFinancialSummary, formatCurrencyBRL } from "@/lib/finance";
import {
  CATEGORIES,
  type CategoryName,
  type TransactionInput,
  type TransactionType,
} from "@/lib/schemas/transaction";

interface DraftReviewPanelProps {
  initialItems: TransactionInput[];
  sourceFileName: string;
  extractionMode?: "GEMINI_API" | "SMART_SIMULATION";
  isApproving: boolean;
  onApproveAll: (items: TransactionInput[]) => void;
  onDiscardDraft: () => void;
}

export function DraftReviewPanel({
  initialItems,
  sourceFileName,
  extractionMode,
  isApproving,
  onApproveAll,
  onDiscardDraft,
}: DraftReviewPanelProps) {
  const [items, setItems] = React.useState<TransactionInput[]>(initialItems);

  const draftSummary = React.useMemo(
    () => calculateFinancialSummary(items),
    [items]
  );

  const handleFieldChange = <K extends keyof TransactionInput>(
    index: number,
    field: K,
    value: TransactionInput[K]
  ) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemoveRow = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleResetToOriginal = () => {
    setItems(initialItems);
  };

  return (
    <Card
      data-testid="draft-review-panel"
      className="border-violet-300 bg-white dark:border-violet-900/70 dark:bg-zinc-900"
    >
      <CardHeader className="border-b border-slate-100 pb-4 dark:border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" icon={Sparkles}>
                Modo Rascunho (Draft)
              </Badge>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                Arquivo: <strong>{sourceFileName}</strong>
              </span>
              {extractionMode === "SMART_SIMULATION" ? (
                <Badge variant="info">Simulação Contextual Local</Badge>
              ) : null}
            </div>
            <CardTitle className="text-lg">
              Comprovante Lido com Sucesso — Revise antes de aprovar
            </CardTitle>
            <CardDescription>
              Confira ou altere descrições, categorias sugeridas pela IA e
              valores. Nenhum lançamento altera seu saldo até sua aprovação.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="neutral"
              icon={RotateCcw}
              onClick={handleResetToOriginal}
              title="Restaurar leitura original da IA"
            >
              Desfazer Edições
            </Button>
            <Button
              type="button"
              size="sm"
              variant="expense"
              icon={X}
              onClick={onDiscardDraft}
            >
              Descartar Rascunho
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-500">
              Todos os itens do rascunho foram removidos.
            </p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              icon={RotateCcw}
              className="mt-3"
              onClick={handleResetToOriginal}
            >
              Restaurar itens extraídos
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={`draft-row-${idx}`}
                data-testid={`draft-row-${idx}`}
                className="grid grid-cols-1 items-end gap-3 rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 md:grid-cols-12 dark:border-zinc-800 dark:bg-zinc-950/40"
              >
                {/* Descrição */}
                <div className="md:col-span-4">
                  <Input
                    label="Descrição"
                    value={item.description}
                    data-testid={`draft-description-${idx}`}
                    onChange={(e) =>
                      handleFieldChange(idx, "description", e.target.value)
                    }
                  />
                </div>

                {/* Categoria Sugerida pela IA */}
                <div className="md:col-span-3">
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-zinc-300">
                    Categoria Sugerida (IA)
                  </label>
                  <select
                    aria-label={`Categoria do item ${idx + 1}`}
                    value={item.category}
                    onChange={(e) =>
                      handleFieldChange(
                        idx,
                        "category",
                        e.target.value as CategoryName
                      )
                    }
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo (Entrada / Saída) */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-zinc-300">
                    Natureza
                  </label>
                  <select
                    aria-label={`Natureza do item ${idx + 1}`}
                    value={item.type}
                    onChange={(e) =>
                      handleFieldChange(
                        idx,
                        "type",
                        e.target.value as TransactionType
                      )
                    }
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    <option value="EXPENSE">Saída (-)</option>
                    <option value="INCOME">Entrada (+)</option>
                  </select>
                </div>

                {/* Valor Financeiro (tabular-nums) */}
                <div className="md:col-span-2">
                  <Input
                    label="Valor (R$)"
                    type="number"
                    step="0.01"
                    min="0.01"
                    tabularNums
                    data-testid={`draft-amount-${idx}`}
                    value={item.amount}
                    onChange={(e) =>
                      handleFieldChange(
                        idx,
                        "amount",
                        Number(e.target.value) || 0
                      )
                    }
                  />
                </div>

                {/* Remover linha */}
                <div className="flex justify-end md:col-span-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="expense"
                    aria-label={`Remover lançamento ${item.description}`}
                    onClick={() => handleRemoveRow(idx)}
                  >
                    <Trash2
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rodapé de Resumo do Rascunho + Botão de Aprovação */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-950/60">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div>
              <span className="text-slate-500">Entradas no rascunho: </span>
              <strong className="text-emerald-600 tabular-nums">
                {formatCurrencyBRL(draftSummary.totalIncome)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">Saídas no rascunho: </span>
              <strong className="text-red-600 tabular-nums">
                {formatCurrencyBRL(draftSummary.totalExpense)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">Impacto líquido: </span>
              <strong className="text-slate-900 tabular-nums dark:text-zinc-100">
                {formatCurrencyBRL(draftSummary.totalBalance)}
              </strong>
            </div>
          </div>

          <Button
            type="button"
            variant="income"
            icon={CheckCircle2}
            isLoading={isApproving}
            loadingText="Salvando lançamentos..."
            disabled={items.length === 0}
            data-testid="approve-draft-btn"
            onClick={() => onApproveAll(items)}
          >
            Aprovar e Salvar ({items.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
