"use client";

import * as React from "react";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Cpu,
  Flame,
  LayoutGrid,
  Palette,
  PlusCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitch } from "@/components/ui/switch";
import { SegmentedTabs } from "@/components/ui/tabs";
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
    description: "Salário Mensal — Engenharia & Produto (2TP)",
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
    description: "Assinaturas Cloud & Infraestrutura IA",
    amount: 149.9,
    type: "EXPENSE",
    category: "Assinaturas & Software",
    transactionDate: "2026-11-03",
    status: "COMPLETED",
    source: "MANUAL",
    createdAt: "2026-11-03T12:00:00.000Z",
  },
];

type WorkspaceView = "ALL" | "ANALYTICS";

export function NexoDashboard() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [activeView, setActiveView] = React.useState<WorkspaceView>("ALL");
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
          `${response.data.length} lançamentos do rascunho foram aprovados e integrados ao seu saldo!`
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
      <div className="min-h-screen bg-[#F4F4F5] text-[#18181B] transition-colors dark:bg-[#09090B] dark:text-[#F4F4F5]">
        {/* BARRA DE COMANDO PANORÂMICA (Sem menu lateral pesado e sem botões repetidos) */}
        <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-[#FFFFFF]/90 backdrop-blur-xl dark:border-[#3F3F46] dark:bg-[#18181B]/90">
          <div className="mx-auto flex max-w-[1520px] flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
            {/* Esquerda: Identidade Nexo Finance + Ecossistema 2TP Soluções em Tecnologia */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#F59B92] bg-gradient-to-br from-[#FACBC2]/70 to-[#DEC5EF]/70 text-[#DC2626] shadow-2xs dark:border-[#DC2626] dark:from-[#DC2626]/25 dark:to-[#692296]/25 dark:text-[#FACBC2]">
                <Flame
                  className="h-5 w-5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="whitespace-nowrap text-base font-bold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                    Nexo Finance
                  </h1>
                  <Badge variant="brand" icon={Cpu}>
                    2TP Soluções em Tecnologia
                  </Badge>
                </div>
                <p className="text-xs text-[#71717A] dark:text-[#D4D4D8]">
                  Ecossistema Nexo • Inteligência Contábil & Automação OCR
                </p>
              </div>
            </div>

            {/* Centro: Navegação Segmentada em Pílula (Ícone Lucide + Texto em linha única) */}
            <div className="flex flex-wrap items-center gap-2">
              <SegmentedTabs
                value={activeView}
                onChange={setActiveView}
                options={[
                  {
                    id: "ALL",
                    label: "Visão Completa",
                    icon: LayoutGrid,
                  },
                  {
                    id: "ANALYTICS",
                    label: "Foco em Gráficos",
                    icon: BarChart3,
                  },
                ]}
              />

              <Link href="/design-system">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  icon={Palette}
                >
                  Design System Studio
                </Button>
              </Link>
            </div>

            {/* Direita: Ciclo Contábil + Switch Dark/Light Mode + CTA Único de Lançamento */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge
                variant="neutral"
                icon={Calendar}
                className="hidden py-1.5 xl:inline-flex"
              >
                Novembro 2026
              </Badge>

              <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />

              <Button
                type="button"
                size="sm"
                variant="primary"
                icon={PlusCircle}
                onClick={() => setIsManualModalOpen(true)}
              >
                Novo Lançamento
              </Button>
            </div>
          </div>
        </header>

        {/* WORKSPACE PANORÂMICO EM BENTO GRID (Aproveitamento máximo da tela) */}
        <main className="mx-auto w-full max-w-[1520px] space-y-6 px-4 py-6 sm:px-8">
          {feedbackBanner ? (
            <div
              role="status"
              aria-live="polite"
              data-testid="feedback-banner"
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#7BD6A0] bg-[#BCE5CB]/45 px-4 py-3 text-xs font-medium text-[#18181B] dark:border-[#13BD5B] dark:bg-[#0CB853]/20 dark:text-[#BCE5CB]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-[#0CB853]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span>{feedbackBanner}</span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                icon={X}
                onClick={() => setFeedbackBanner(null)}
              >
                Fechar Aviso
              </Button>
            </div>
          ) : null}

          {/* LINHA 1 DO BENTO GRID: Balanço Patrimonial (8 Colunas) + Copiloto Smart Input IA (4 Colunas) */}
          {activeView === "ALL" ? (
            <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
              <div className="xl:col-span-8">
                <SummaryCards
                  summary={summary}
                  pendingDraftCount={draftItems?.length ?? 0}
                />
              </div>
              <div className="xl:col-span-4">
                <SmartInputDropzone
                  onDraftExtracted={handleDraftExtracted}
                  onOpenManualFallback={() => setIsManualModalOpen(true)}
                />
              </div>
            </div>
          ) : null}

          {/* LINHA 2: Tela de Rascunho Assistida por IA (Quando Ativa) */}
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

          {/* LINHA 3: Gráficos Analíticos Consolidados */}
          <FinanceCharts transactions={transactions} />

          {/* LINHA 4: Livro-Razão Interativo com Filtros Instantâneos */}
          {activeView === "ALL" ? (
            <TransactionsTable
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenManualEntry={() => setIsManualModalOpen(true)}
              onTriggerUpload={handleFocusSmartInput}
            />
          ) : null}
        </main>

        {/* Rodapé de Assinatura 2TP Soluções em Tecnologia */}
        <footer className="mt-10 border-t border-[#E4E4E7] bg-[#FFFFFF]/80 py-4 dark:border-[#3F3F46] dark:bg-[#18181B]/80">
          <div className="mx-auto flex max-w-[1520px] flex-wrap items-center justify-between gap-3 px-4 text-xs text-[#71717A] sm:px-8 dark:text-[#D4D4D8]">
            <div className="flex items-center gap-2">
              <Flame
                className="h-3.5 w-3.5 text-[#DC2626]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span>
                <strong>Nexo Finance</strong> • Desenvolvido sob o padrão visual{" "}
                <strong>2TP Soluções em Tecnologia</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="purple" icon={ShieldCheck}>
                Zero Trust & RLS
              </Badge>
              <span className="font-mono text-[11px]">
                Next.js App Router • Supabase • Gemini OCR
              </span>
            </div>
          </div>
        </footer>

        {/* Modal de Lançamento Manual (Keyboard-First) */}
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
