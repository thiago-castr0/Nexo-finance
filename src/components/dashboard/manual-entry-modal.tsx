"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  DollarSign,
  FileText,
  PlusCircle,
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
import {
  CATEGORIES,
  transactionInputSchema,
  type CategoryName,
  type TransactionInput,
  type TransactionType,
} from "@/lib/schemas/transaction";

interface ManualEntryModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionInput) => void;
}

export function ManualEntryModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: ManualEntryModalProps) {
  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [type, setType] = React.useState<TransactionType>("EXPENSE");
  const [description, setDescription] = React.useState("");
  const [amountStr, setAmountStr] = React.useState("");
  const [transactionDate, setTransactionDate] = React.useState(today);
  const [category, setCategory] = React.useState<CategoryName>("Alimentação");
  const [fieldErrors, setFieldErrors] = React.useState<{
    description?: string;
    amount?: string;
    transactionDate?: string;
  }>({});

  if (!isOpen) {
    return null;
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const parsedAmount = Number(amountStr.replace(",", "."));
    const candidate: TransactionInput = {
      description,
      amount: parsedAmount,
      type,
      category,
      transactionDate,
      source: "MANUAL",
    };

    const validation = transactionInputSchema.safeParse(candidate);
    if (!validation.success) {
      const nextErrors: {
        description?: string;
        amount?: string;
        transactionDate?: string;
      } = {};
      for (const issue of validation.error.issues) {
        const key = issue.path[0];
        if (
          key === "description" ||
          key === "amount" ||
          key === "transactionDate"
        ) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    onSubmit(validation.data);
    setDescription("");
    setAmountStr("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-entry-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090B]/50 p-4 backdrop-blur-xs"
    >
      <Card className="w-full max-w-lg overflow-hidden border-[#E4E4E7] bg-[#FFFFFF] dark:border-[#3F3F46] dark:bg-[#18181B]">
        <div
          className="h-1.5 w-full"
          style={{
            background: "linear-gradient(90deg, #DC2626 0%, #692296 100%)",
          }}
        />
        <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b border-[#E4E4E7] pb-4 dark:border-[#3F3F46]">
          <div>
            <CardTitle id="manual-entry-title" className="text-base">
              Novo Lançamento Manual
            </CardTitle>
            <CardDescription>
              Formulário otimizado para navegação rápida via teclado (Tab)
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            icon={X}
            aria-label="Fechar modal de lançamento manual"
            onClick={onClose}
          >
            Fechar
          </Button>
        </CardHeader>

        <CardContent className="pt-5">
          <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
            {/* Seletor rápido de Tipo (Ícone Lucide + Texto em linha única) */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                icon={ArrowDownRight}
                variant={type === "EXPENSE" ? "expense" : "neutral"}
                onClick={() => setType("EXPENSE")}
                data-testid="manual-type-expense"
              >
                Saída (Despesa)
              </Button>
              <Button
                type="button"
                icon={ArrowUpRight}
                variant={type === "INCOME" ? "income" : "neutral"}
                onClick={() => setType("INCOME")}
                data-testid="manual-type-income"
              >
                Entrada (Receita)
              </Button>
            </div>

            <Input
              label="Descrição do Lançamento"
              placeholder="Ex: Almoço executivo, Conta de luz, Salário..."
              icon={FileText}
              value={description}
              error={fieldErrors.description}
              data-testid="manual-description-input"
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Valor (R$)"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                icon={DollarSign}
                tabularNums
                value={amountStr}
                error={fieldErrors.amount}
                data-testid="manual-amount-input"
                onChange={(e) => setAmountStr(e.target.value)}
              />

              <Input
                label="Data"
                type="date"
                icon={Calendar}
                value={transactionDate}
                error={fieldErrors.transactionDate}
                data-testid="manual-date-input"
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="manual-category-select"
                className="mb-1.5 block text-xs font-medium text-[#3F3F46] dark:text-[#D4D4D8]"
              >
                Categoria
              </label>
              <select
                id="manual-category-select"
                value={category}
                data-testid="manual-category-select"
                onChange={(e) => setCategory(e.target.value as CategoryName)}
                className="flex h-10 w-full rounded-lg border border-[#E4E4E7] bg-[#FFFFFF] px-3 py-2 text-sm text-[#18181B] focus-visible:border-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACBC2]/70 dark:border-[#3F3F46] dark:bg-[#18181B] dark:text-[#F4F4F5]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="neutral"
                icon={X}
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={PlusCircle}
                isLoading={isSubmitting}
                loadingText="Salvando..."
                data-testid="manual-submit-btn"
              >
                Salvar Lançamento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
