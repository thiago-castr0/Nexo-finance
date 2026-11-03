"use client";

import * as React from "react";
import {
  CheckCircle2,
  Flame,
  PlusCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { FinanceCharts } from "@/components/dashboard/finance-charts";
import { SmartInputDropzone } from "@/components/dashboard/smart-input-dropzone";
import { DraftReviewPanel } from "@/components/dashboard/draft-review-panel";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { ManualEntryModal } from "@/components/dashboard/manual-entry-modal";
import {
  approveDraftTransactionsAction,
  createManualTransactionAction,
} from "@/app/actions/transactions";
import { calculateFinancialSummary } from "@/lib/finance";
import type {
  TransactionInput,
  TransactionRecord,
} from "@/lib/schemas/transaction";

const INITIAL_DEMO_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "tx-initial-1",
    description: "Salário Mensal - Tecnologia",
    amount: 8500.0,
    type: "INCOME",
    category: "Salário & Renda",
    transactionDate: "2026-11-01",
    status: "COMPLETED",
    source: "MANUAL",
    createdAt: "2026-11-01T09:00:00.000Z",
  },
  {
    id: "tx-initial-2",
    description: "Aluguel & Condomínio Residencial",
    amount: 2400.0,
    type: "EXPENSE",
    category: "Moradia",
    transactionDate: "2026-11-02",
    status: "COMPLETED",
    source: "AI_OCR",
    createdAt: "2026-11-02T10:30:00.000Z",
  },
  {
    id: "tx-initial-3",
    description: "Supermercado Hortifruti Semanal",
    amount: 645.9,
    type: "EXPENSE",
    category: "Alimentação",
    transactionDate: "2026-11-03",
    status: "COMPLETED",
    source: "AI_OCR",
    createdAt: "2026-11-03T11:15:00.000Z",
  },
  {
    id: "tx-initial-4",
    description: "Assinaturas Cloud & IA",
    amount: 149.9,
    type: "EXPENSE",
    category: "Assinaturas & Software",
    transactionDate: "2026-11-03",
    status: "COMPLETED",
    source: "MANUAL",
    createdAt: "2026-11-03T12:00:00.000Z",
  },
];

export function NexoDashboard() {
  const [transactions, setTransactions] = React.useState<TransactionRecord[]>(
    INITIAL_DEMO_TRANSACTIONS
  );
  const [draftItems, setDraftItems] = React.useState<TransactionInput[] | null>(
    null
  );
  const [draftFileName, setDraftFileName] = React.useState<string>("");
  const [draftMode, setDraftMode] = React.useState<
    "GEMINI_API" | "SMART_SIMULATION" | undefined
  >(undefined);
  const [isManualModalOpen, setIsManualModalOpen] = React.useState(false);
  const [feedbackBanner, setFeedbackBanner] = React.useState<string | null>(
    null
  );

  const [isApprovingDraft, startApproveTransition] = React.useTransition();
  const [isSubmittingManual, startManualTransition] = React.useTransition();

  const summary = React.useMemo(
    () => calculateFinancialSummary(transactions),
    [transactions]
  );

  const handleDraftExtracted = React.useCallback(
    (
      items: TransactionInput[],
      fileName: string,
      mode?: "GEMINI_API" | "SMART_SIMULATION"
    ) => {
      setDraftItems(items);
      setDraftFileName(fileName);
      setDraftMode(mode);
      setFeedbackBanner(null);
    },
    []
  );

  const handleApproveDraft = (approvedItems: TransactionInput[]) => {
    startApproveTransition(async () => {
      const response = await approveDraftTransactionsAction(approvedItems);
      if (response.success && response.data) {
        setTransactions((prev) => [...response.data!, ...prev]);
        setDraftItems(null);
        setDraftFileName("");
        setFeedbackBanner(
          `${response.data.length} lançamentos do rascunho foram aprovados e adicionados ao seu saldo!`
        );
      }
    });
  };

  const handleManualSubmit = (input: TransactionInput) => {
    startManualTransition(async () => {
      const response = await createManualTransactionAction(input);
      if (response.success && response.data) {
        setTransactions((prev) => [response.data!, ...prev]);
        setIsManualModalOpen(false);
        setFeedbackBanner(
          `Lançamento "${response.data.description}" registrado com sucesso.`
        );
      }
    });
  };

  // Atualização Otimista ao remover uma transação (Skill FTE-002)
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFocusSmartInput = () => {
    const fileInput = document.querySelector<HTMLInputElement>(
      '[data-testid="smart-input-file"]'
    );
    fileInput?.click();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-zinc-950">
      {/* Cabeçalho Minimalista (1px solid border, Brand Red/Purple) */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50/80 text-rose-600 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-400">
              <Flame className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                  Nexo Finance
                </h1>
                <Badge variant="brand">MVP Beta</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Controle financeiro inteligente com OCR e revisão assistida
              </p>
            </div>
          </div>

          <nav
            aria-label="Ações rápidas"
            className="flex flex-wrap items-center gap-2.5"
          >
            <Badge variant="purple" icon={ShieldCheck}>
              Zero Trust & RLS
            </Badge>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              icon={Sparkles}
              onClick={handleFocusSmartInput}
            >
              Importar Extrato (IA)
            </Button>
            <Button
              type="button"
              size="sm"
              variant="primary"
              icon={PlusCircle}
              onClick={() => setIsManualModalOpen(true)}
            >
              Novo Lançamento
            </Button>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {feedbackBanner ? (
          <div
            role="status"
            data-testid="feedback-banner"
            className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-emerald-600"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span>{feedbackBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="text-xs underline hover:text-emerald-950"
            >
              Fechar
            </button>
          </div>
        ) : null}

        {/* 1. Cards de Resumo (Saldo Total, Receitas, Despesas com tabular-nums) */}
        <SummaryCards
          summary={summary}
          pendingDraftCount={draftItems?.length ?? 0}
        />

        {/* 2. Zona de Smart Input (Upload de PDF / Prints com IA) */}
        <SmartInputDropzone
          onDraftExtracted={handleDraftExtracted}
          onOpenManualFallback={() => setIsManualModalOpen(true)}
        />

        {/* 3. Tela de Rascunho (Draft Review) — Visível quando a IA extrai lançamentos */}
        {draftItems ? (
          <DraftReviewPanel
            key={draftFileName || "draft"}
            initialItems={draftItems}
            sourceFileName={draftFileName}
            extractionMode={draftMode}
            isApproving={isApprovingDraft}
            onApproveAll={handleApproveDraft}
            onDiscardDraft={() => {
              setDraftItems(null);
              setDraftFileName("");
            }}
          />
        ) : null}

        {/* 4. Gráficos Financeiros (Recharts) */}
        <FinanceCharts transactions={transactions} />

        {/* 5. Tabela de Transações (ou Zero State se vazia) */}
        <TransactionsTable
          transactions={transactions}
          onDeleteTransaction={handleDeleteTransaction}
          onOpenManualEntry={() => setIsManualModalOpen(true)}
          onTriggerUpload={handleFocusSmartInput}
        />
      </main>

      {/* Modal de Lançamento Manual (Keyboard-First) */}
      <ManualEntryModal
        isOpen={isManualModalOpen}
        isSubmitting={isSubmittingManual}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={handleManualSubmit}
      />
    </div>
  );
}
