"use client";

import * as React from "react";
import {
  FileText,
  Receipt,
  Download,
  ExternalLink,
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrencyBRL } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

export interface ReceiptPreviewModalProps {
  transaction: TransactionRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptPreviewModal({
  transaction,
  isOpen,
  onClose,
}: ReceiptPreviewModalProps) {
  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === "INCOME";
  const hasAttachment = Boolean(transaction.attachmentUrl);
  const isImage =
    hasAttachment &&
    /\.(png|jpe?g|webp|gif)$/i.test(transaction.attachmentUrl || "");

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#E4E4E7] bg-white text-[#18181B] shadow-2xl dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#F4F4F5]">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between border-b border-[#E4E4E7] px-6 py-4 dark:border-[#27272A]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#692296] to-[#DC2626] text-white shadow-xs">
              <Receipt className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                Comprovante do Lançamento
              </h3>
              <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
                {transaction.source === "AI_OCR"
                  ? "Auditado por IA Gemini 2.5 Flash"
                  : "Registro Financeiro Nexo"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#71717A] transition hover:bg-[#F4F4F5] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:bg-[#27272A] cursor-pointer"
            title="Fechar"
            aria-label="Fechar comprovante"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Corpo do Comprovante */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Card Resumo do Pagamento */}
          <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5]/70 p-4 text-center dark:border-[#27272A] dark:bg-[#121216]">
            <span className="text-xs font-bold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
              {isIncome ? "Valor Recebido" : "Valor Pago"}
            </span>
            <div
              className={`mt-1 text-2xl font-black tabular-nums ${
                isIncome
                  ? "text-[#0CB853] dark:text-[#46C87D]"
                  : "text-[#18181B] dark:text-white"
              }`}
            >
              {formatCurrencyBRL(transaction.amount)}
            </div>
            <p className="mt-1 text-xs font-bold text-[#18181B] dark:text-white">
              {transaction.description}
            </p>
          </div>

          {/* Imagem / Documento Anexado (se houver) */}
          {hasAttachment && (
            <div className="overflow-hidden rounded-2xl border border-[#E4E4E7] dark:border-[#27272A]">
              {isImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={transaction.attachmentUrl!}
                  alt={`Comprovante de ${transaction.description}`}
                  className="max-h-72 w-full object-contain bg-[#18181B]/5 p-2 dark:bg-[#18181B]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-[#F8FAFC] dark:bg-[#121216]">
                  <FileText className="h-10 w-10 text-[#692296] mb-2" />
                  <p className="text-xs font-bold text-[#18181B] dark:text-white">
                    Documento PDF / Arquivo Anexo
                  </p>
                  <a
                    href={transaction.attachmentUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#2572CE] hover:underline"
                  >
                    <span>Abrir arquivo original</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Cupom Digital Estruturado */}
          <div className="rounded-2xl border border-dashed border-[#D4D4D8] bg-white p-4 dark:border-[#3F3F46] dark:bg-[#121216] space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E4E4E7] dark:border-[#27272A]">
              <span className="flex items-center gap-1.5 font-bold text-[#71717A] dark:text-[#A1A1AA]">
                <Calendar className="h-3.5 w-3.5" />
                Data da Operação
              </span>
              <span className="font-extrabold text-[#18181B] dark:text-white tabular-nums">
                {transaction.transactionDate}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E4E4E7] dark:border-[#27272A]">
              <span className="flex items-center gap-1.5 font-bold text-[#71717A] dark:text-[#A1A1AA]">
                <Building className="h-3.5 w-3.5" />
                Categoria
              </span>
              <span className="font-extrabold text-[#18181B] dark:text-white">
                {transaction.category}
              </span>
            </div>

            {transaction.totalInstallments && transaction.totalInstallments > 1 && (
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E4E4E7] dark:border-[#27272A]">
                <span className="flex items-center gap-1.5 font-bold text-[#71717A] dark:text-[#A1A1AA]">
                  <CreditCard className="h-3.5 w-3.5" />
                  Parcelamento
                </span>
                <span className="font-extrabold text-[#2572CE] tabular-nums">
                  Parcela {transaction.installmentNumber} de{" "}
                  {transaction.totalInstallments}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="flex items-center gap-1.5 font-bold text-[#71717A] dark:text-[#A1A1AA]">
                <Sparkles className="h-3.5 w-3.5 text-[#692296]" />
                Origem do Registro
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#DEC5EF]/40 px-2 py-0.5 text-[10px] font-extrabold text-[#692296] dark:bg-[#692296]/30 dark:text-[#DEC5EF]">
                <CheckCircle2 className="h-2.5 w-2.5" />
                {transaction.source === "AI_OCR" ? "Extrator IA OCR" : "Manual"}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="flex items-center justify-between border-t border-[#E4E4E7] px-6 py-4 dark:border-[#27272A]">
          {hasAttachment ? (
            <a
              href={transaction.attachmentUrl!}
              download={`comprovante-${transaction.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button type="button" size="sm" variant="neutral" icon={Download}>
                Baixar Anexo
              </Button>
            </a>
          ) : (
            <span className="text-[11px] font-semibold text-[#71717A] dark:text-[#A1A1AA]">
              Comprovante digital autenticado
            </span>
          )}

          <Button type="button" size="sm" variant="primary" onClick={onClose}>
            Concluir
          </Button>
        </div>
      </div>
    </div>
  );
}
