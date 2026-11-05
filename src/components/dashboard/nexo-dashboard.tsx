"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Flame,
  Palette,
  PlusCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/switch";
import { NotificationBanner } from "@/components/ui/toast-banner";
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
    description: "Salário Mensal",
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
    description: "Aluguel & Condomínio",
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
    description: "Supermercado da Semana",
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
    description: "Assinaturas & Internet",
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
  const [darkMode, setDarkMode] = React.useState(false);
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

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

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
          `${response.data.length} lançamentos foram adicionados ao seu saldo!`
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
          `Lançamento "${response.data.description}" adicionado!`
        );
      }
    });
  };

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
    <div className={darkMode ? "dark" : ""}>
      <div
        className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${
          darkMode
            ? "bg-[#0B0B10] text-[#F4F4F5]"
            : "bg-[#F6F7FB] text-[#18181B]"
        }`}
      >
        {/* Luzes Ambientais Suaves Roxo & Vermelho (Dão o efeito de vidro iOS sem poluir) */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <div className=" absolute -top-32 left-1/6 h-[420px] w-[420px] rounded-full bg-[#692296]/12 blur-[120px] dark:bg-[#692296]/22" />
          <div className=" absolute top-1/3 right-1/6 h-[420px] w-[420px] rounded-full bg-[#DC2626]/10 blur-[120px] dark:bg-[#DC2626]/18" />
        </div>

        {/* Faixa Fina da Marca no Topo */}
        <div className="relative z-30 h-1 w-full bg-gradient-to-r from-[#DC2626] via-[#692296] to-[#0CB853]" />

        {/* HEADER CLEAN & DIRETO (Perfeito para Mobile e Desktop) */}
        <header className="sticky top-0 z-30 border-b border-[#E4E4E7]/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#121218]/85">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            {/* Logo + Nome */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DC2626] to-[#692296] text-white shadow-xs">
                <Flame
                  className="h-4 w-4"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                  Nexo Finance
                </h1>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] hidden sm:block">
                  Controle financeiro pessoal inteligente
                </p>
              </div>
            </div>

            {/* Ações Diretas (Sem poluição visual) */}
            <div className="flex items-center gap-2">
              <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />

              <Link href="/design-system">
                <Button
                  type="button"
                  size="sm"
                  variant="neutral"
                  icon={Palette}
                >
                  Design System
                </Button>
              </Link>

              <Button
                type="button"
                size="sm"
                variant="primary"
                icon={PlusCircle}
                data-testid="open-manual-modal-btn"
                onClick={() => setIsManualModalOpen(true)}
              >
                Novo Lançamento
              </Button>
            </div>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL EM 3 LINHAS LIMPAS E ORGANIZADAS */}
        <main className="relative z-10 mx-auto w-full max-w-[1440px] space-y-5 px-4 py-5 sm:px-6">
          {feedbackBanner ? (
            <NotificationBanner
              title="Pronto!"
              description={feedbackBanner}
              icon={CheckCircle2}
              intent="income"
              actionLabel="Fechar"
              actionIcon={X}
              onAction={() => setFeedbackBanner(null)}
            />
          ) : null}

          {/* Tela de Revisão de Rascunho (Quando o usuário envia PDF/Foto) */}
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

          {/* LINHA 1: Resumo do Mês (8 cols) + Importar com IA (4 cols) */}
          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SummaryCards
                summary={summary}
                pendingDraftCount={draftItems?.length ?? 0}
              />
            </div>
            <div className="lg:col-span-4">
              <SmartInputDropzone
                onDraftExtracted={handleDraftExtracted}
                onOpenManualFallback={() => setIsManualModalOpen(true)}
              />
            </div>
          </div>

          {/* LINHA 2: Tabela de Lançamentos de Ponta a Ponta */}
          <TransactionsTable
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenManualEntry={() => setIsManualModalOpen(true)}
            onTriggerUpload={handleFocusSmartInput}
          />

          {/* LINHA 3: 3 Boxes Alinhados do Mesmo Tamanho (Saúde do Mês + Categorias + Fluxo) */}
          <FinanceCharts transactions={transactions} />
        </main>

        {/* Modal de Lançamento Manual */}
        <ManualEntryModal
          isOpen={isManualModalOpen}
          isSubmitting={isSubmittingManual}
          onClose={() => setIsManualModalOpen(false)}
          onSubmit={handleManualSubmit}
        />
      </div>
    </div>
  );
}
