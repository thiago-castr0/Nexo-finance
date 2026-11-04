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
      className="overflow-hidden border-[#A466D1] bg-[#FFFFFF] dark:border-[#7E32B5] dark:bg-[#18181B]"
    >
      <div
        className="h-1.5 w-full"
        style={{
          background: "linear-gradient(90deg, #692296 0%, #DC2626 100%)",
        }}
      />
      <CardHeader className="border-b border-[#E4E4E7] pb-4 dark:border-[#3F3F46]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="purple" icon={Sparkles}>
                Modo Rascunho (Draft)
              </Badge>
              <span className="text-xs text-[#71717A] dark:text-[#D4D4D8]">
                Documento: <strong>{sourceFileName}</strong>
              </span>
              {extractionMode === "SMART_SIMULATION" ? (
                <Badge variant="info">Simulação Contextual Local</Badge>
              ) : null}
            </div>
            <CardTitle className="text-lg">
              Comprovante Lido com Sucesso — Revise antes de aprovar
            </CardTitle>
            <CardDescription>
              Edite descrições, categorias sugeridas pela IA ou valores. Nenhum
              lançamento altera seu saldo até sua aprovação.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
            <p className="text-sm text-[#71717A]">
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
              Restaurar Itens Extraídos
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={`draft-row-${idx}`}
                data-testid={`draft-row-${idx}`}
                className="grid grid-cols-1 items-end gap-3 rounded-xl border border-[#E4E4E7] bg-[#F4F4F5]/60 p-3.5 md:grid-cols-12 dark:border-[#3F3F46] dark:bg-[#09090B]/50"
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
                  <label className="mb-1.5 block text-xs font-medium text-[#3F3F46] dark:text-[#D4D4D8]">
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
                    className="flex h-10 w-full rounded-lg border border-[#E4E4E7] bg-[#FFFFFF] px-3 py-2 text-sm text-[#18181B] focus-visible:border-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACBC2]/70 dark:border-[#3F3F46] dark:bg-[#18181B] dark:text-[#F4F4F5]"
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
                  <label className="mb-1.5 block text-xs font-medium text-[#3F3F46] dark:text-[#D4D4D8]">
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
                    className="flex h-10 w-full rounded-lg border border-[#E4E4E7] bg-[#FFFFFF] px-3 py-2 text-sm text-[#18181B] focus-visible:border-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACBC2]/70 dark:border-[#3F3F46] dark:bg-[#18181B] dark:text-[#F4F4F5]"
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

                {/* Remover linha (Ícone Lucide + Texto em linha única) */}
                <div className="flex justify-end md:col-span-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="expense"
                    icon={Trash2}
                    aria-label={`Remover lançamento ${item.description}`}
                    onClick={() => handleRemoveRow(idx)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rodapé de Resumo do Rascunho + Botão de Aprovação */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 sm:flex-row sm:items-center dark:border-[#3F3F46] dark:bg-[#09090B]">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div>
              <span className="text-[#71717A]">Entradas no rascunho: </span>
              <strong className="text-[#0CB853] tabular-nums">
                + {formatCurrencyBRL(draftSummary.totalIncome)}
              </strong>
            </div>
            <div>
              <span className="text-[#71717A]">Saídas no rascunho: </span>
              <strong className="text-[#DF2929] tabular-nums">
                - {formatCurrencyBRL(draftSummary.totalExpense)}
              </strong>
            </div>
            <div>
              <span className="text-[#71717A]">Impacto líquido: </span>
              <strong className="text-[#18181B] tabular-nums dark:text-[#FFFFFF]">
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
