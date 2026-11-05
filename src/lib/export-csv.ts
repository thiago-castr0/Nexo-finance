import type { TransactionRecord } from "@/lib/schemas/transaction";

/**
 * Generates and triggers download of a CSV file from transaction records.
 * Uses semicolon ';' delimiter and UTF-8 BOM so Microsoft Excel in Portuguese/BR opens cleanly.
 */
export function exportTransactionsToCSV(transactions: TransactionRecord[], filename = "extrato-nexo-finance.csv") {
  const headers = ["Data", "Descrição", "Categoria", "Tipo", "Valor (R$)", "Origem", "ID"];

  const rows = transactions.map((tx) => [
    tx.transactionDate,
    `"${(tx.description || "").replace(/"/g, '""')}"`,
    `"${(tx.category || "").replace(/"/g, '""')}"`,
    tx.type === "INCOME" ? "Entrada" : "Saída",
    tx.amount.toFixed(2).replace(".", ","),
    tx.source === "AI_OCR" ? "Importado por IA" : "Lançamento Manual",
    tx.id,
  ]);

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
