"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CreditCard as CreditCardIcon,
  DollarSign,
  FileText,
  PlusCircle,
  Wallet,
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
  type TransactionRecord,
  type TransactionType,
} from "@/lib/schemas/transaction";
import type { CreditCard } from "@/lib/schemas/credit-card";
import { formatCurrencyBRL } from "@/lib/finance";

interface ManualEntryModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionInput) => void;
  initialData?: TransactionRecord | null;
  creditCards?: CreditCard[];
}

const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 24];

export function ManualEntryModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
  initialData,
  creditCards = [],
}: ManualEntryModalProps) {
  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [type, setType] = React.useState<TransactionType>(initialData?.type || "EXPENSE");
  const [description, setDescription] = React.useState(initialData?.description || "");
  const [amountStr, setAmountStr] = React.useState(initialData ? String(initialData.amount) : "");
  const [transactionDate, setTransactionDate] = React.useState(initialData?.transactionDate || today);
  const [category, setCategory] = React.useState<CategoryName>((initialData?.category as CategoryName) || "Alimentação");
  const [isRecurring, setIsRecurring] = React.useState(Boolean(initialData?.isRecurring));

  // Cartão e Parcelamento
  const [paymentMethod, setPaymentMethod] = React.useState<"ACCOUNT" | "CREDIT_CARD">(
    initialData?.creditCardId ? "CREDIT_CARD" : "ACCOUNT"
  );
  const [selectedCardId, setSelectedCardId] = React.useState<string>(
    initialData?.creditCardId || (creditCards.length > 0 ? creditCards[0].id || "" : "")
  );
  const [installments, setInstallments] = React.useState<number>(
    initialData?.totalInstallments || 1
  );

  const [fieldErrors, setFieldErrors] = React.useState<{
    description?: string;
    amount?: string;
    transactionDate?: string;
  }>({});

  if (!isOpen) {
    return null;
  }

  const numericAmount = parseFloat(amountStr.replace(",", ".")) || 0;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const parsedAmount = Number(amountStr.replace(",", "."));
    const isCreditCard = type === "EXPENSE" && paymentMethod === "CREDIT_CARD" && Boolean(selectedCardId);

    const candidate: TransactionInput = {
      description,
      amount: parsedAmount,
      type,
      category,
      transactionDate,
      isRecurring: isCreditCard ? false : isRecurring,
      creditCardId: isCreditCard ? selectedCardId : null,
      installmentNumber: isCreditCard && installments > 1 ? 1 : null,
      totalInstallments: isCreditCard && installments > 1 ? installments : null,
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
    setIsRecurring(false);
    setInstallments(1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-entry-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090B]/50 p-4 backdrop-blur-xs"
    >
      <Card className="w-full max-w-lg overflow-hidden border-[#E4E4E7] bg-[#FFFFFF] dark:border-[#3F3F46] dark:bg-[#18181B] max-h-[90vh] flex flex-col">
        <div
          className="h-1.5 w-full shrink-0"
          style={{
            background: "linear-gradient(90deg, #DC2626 0%, #692296 100%)",
          }}
        />
        <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b border-[#E4E4E7] pb-4 dark:border-[#3F3F46] shrink-0">
          <div>
            <CardTitle id="manual-entry-title" className="text-base">
              {initialData ? "Editar Lançamento" : "Novo Lançamento Manual"}
            </CardTitle>
            <CardDescription>
              {initialData
                ? "Atualize os dados e confirme para sincronizar com sua carteira"
                : "Formulário otimizado para navegação rápida via teclado (Tab)"}
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

        <CardContent className="pt-5 overflow-y-auto flex-1 pr-4">
          <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
            {/* Seletor rápido de Tipo */}
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
                onClick={() => {
                  setType("INCOME");
                  setPaymentMethod("ACCOUNT");
                }}
                data-testid="manual-type-income"
              >
                Entrada (Receita)
              </Button>
            </div>

            {/* Forma de Pagamento (Apenas para despesas) */}
            {type === "EXPENSE" && creditCards.length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
                  Forma de Pagamento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ACCOUNT")}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition ${
                      paymentMethod === "ACCOUNT"
                        ? "border-[#692296] bg-[#DEC5EF]/20 text-[#692296] dark:border-[#DEC5EF] dark:text-[#DEC5EF]"
                        : "border-[#E4E4E7] text-[#71717A] hover:bg-black/5 dark:border-[#27272A] dark:text-[#A1A1AA]"
                    }`}
                  >
                    <Wallet className="h-3.5 w-3.5" />
                    <span>Conta / PIX</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("CREDIT_CARD")}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition ${
                      paymentMethod === "CREDIT_CARD"
                        ? "border-[#692296] bg-[#DEC5EF]/20 text-[#692296] dark:border-[#DEC5EF] dark:text-[#DEC5EF]"
                        : "border-[#E4E4E7] text-[#71717A] hover:bg-black/5 dark:border-[#27272A] dark:text-[#A1A1AA]"
                    }`}
                  >
                    <CreditCardIcon className="h-3.5 w-3.5" />
                    <span>Cartão de Crédito</span>
                  </button>
                </div>
              </div>
            )}

            {/* Opções de Cartão de Crédito & Parcelamento */}
            {type === "EXPENSE" && paymentMethod === "CREDIT_CARD" && creditCards.length > 0 && (
              <div className="rounded-2xl border border-[#DEC5EF]/60 bg-[#F5ECFB]/40 p-3.5 dark:border-[#692296]/30 dark:bg-[#18181B]/80 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
                    Qual Cartão?
                  </label>
                  <select
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    className="flex h-9 w-full rounded-xl border border-[#E4E4E7] bg-white px-3 text-xs font-semibold text-[#18181B] outline-none dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FFFFFF]"
                  >
                    {creditCards.map((card) => (
                      <option key={card.id || card.lastDigits} value={card.id}>
                        {card.name} (•••• {card.lastDigits})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
                    Número de Parcelas
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="flex h-9 w-full rounded-xl border border-[#E4E4E7] bg-white px-3 text-xs font-semibold text-[#18181B] outline-none dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#FFFFFF]"
                  >
                    {INSTALLMENT_OPTIONS.map((count) => {
                      const parcelValue = numericAmount > 0 ? numericAmount / count : 0;
                      return (
                        <option key={count} value={count}>
                          {count === 1
                            ? `1x à vista (${formatCurrencyBRL(numericAmount)})`
                            : `${count}x de ${formatCurrencyBRL(parcelValue)} (Total: ${formatCurrencyBRL(numericAmount)})`}
                        </option>
                      );
                    })}
                  </select>
                  {installments > 1 && (
                    <p className="mt-1 text-[11px] text-[#692296] dark:text-[#DEC5EF] font-medium">
                      💡 Cada parcela será projetada automaticamente nos meses subsequentes até o término.
                    </p>
                  )}
                </div>
              </div>
            )}

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
                label="Valor Total (R$)"
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
                label="Data da 1ª Parcela"
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

            {/* Opção de Despesa Recorrente (Não aplicável a parcelamentos) */}
            {paymentMethod !== "CREDIT_CARD" && (
              <label className="flex items-center gap-2.5 cursor-pointer select-none rounded-xl border border-[#E4E4E7] p-3 hover:bg-black/5 dark:border-[#3F3F46] dark:hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#692296]"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
                    Despesa / Receita Recorrente
                  </span>
                  <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
                    Repete mensalmente para previsibilidade financeira
                  </span>
                </div>
              </label>
            )}

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
                {initialData ? "Salvar Alterações" : "Salvar Lançamento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
