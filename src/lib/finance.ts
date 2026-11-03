import type { TransactionInput, TransactionRecord } from "./schemas/transaction.ts";

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
}

/**
 * Converte valor em reais para centavos inteiros para evitar erros IEEE 754 (ex: 0.1 + 0.2)
 */
export function toCents(amount: number): number {
  if (!Number.isFinite(amount)) {
    return 0;
  }
  return Math.round(amount * 100);
}

/**
 * Converte centavos inteiros de volta para valor decimal com 2 casas precisas
 */
export function fromCents(cents: number): number {
  return Number((cents / 100).toFixed(2));
}

/**
 * Calcula Saldo Total, Receitas e Despesas com aritmética exata em centavos (Skill QAE-002)
 */
export function calculateFinancialSummary(
  transactions: ReadonlyArray<Pick<TransactionInput | TransactionRecord, "amount" | "type">>
): FinancialSummary {
  let incomeCents = 0;
  let expenseCents = 0;

  for (const tx of transactions) {
    const cents = toCents(tx.amount);
    if (tx.type === "INCOME") {
      incomeCents += cents;
    } else {
      expenseCents += cents;
    }
  }

  const balanceCents = incomeCents - expenseCents;

  return {
    totalBalance: fromCents(balanceCents),
    totalIncome: fromCents(incomeCents),
    totalExpense: fromCents(expenseCents),
    transactionCount: transactions.length,
  };
}

/**
 * Formata valores monetários no padrão brasileiro (BRL)
 */
export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
