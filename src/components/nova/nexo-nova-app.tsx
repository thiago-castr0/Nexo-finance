"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Flame,
  LayoutDashboard,
  ListOrdered,
  Palette,
  PieChart,
  Plus,
  ScanLine,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitch } from "@/components/ui/switch";
import { NotificationBanner } from "@/components/ui/toast-banner";
import { WalletHeroCard } from "@/components/nova-ui/wallet-hero-card";
import { TimelineFeed } from "@/components/nova-ui/timeline-feed";
import { CategoryEnvelopes } from "@/components/nova-ui/category-envelopes";
import { QuickAiScanner } from "@/components/nova-ui/quick-ai-scanner";
import { DraftReviewPanel } from "@/components/dashboard/draft-review-panel";
import { ManualEntryModal } from "@/components/dashboard/manual-entry-modal";
import { FinanceCharts } from "@/components/dashboard/finance-charts";
import {
  approveDraftTransactionsAction,
  createManualTransactionAction,
  processSmartInputAction,
} from "@/app/actions/transactions";
import { calculateFinancialSummary } from "@/lib/finance";
import type {
  TransactionInput,
  TransactionRecord,
} from "@/lib/schemas/transaction";

const INITIAL_NOVA_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "tx-nova-1",
    description: "Salário Mensal 2TP",
    amount: 9200.0,
    type: "INCOME",
    category: "Salário & Renda",
    transactionDate: "2026-11-01",
    status: "COMPLETED",
    source: "MANUAL",
    createdAt: "2026-11-01T09:00:00.000Z",
  },
  {
    id: "tx-nova-2",
    description: "Aluguel & Condomínio",
    amount: 2450.0,
    type: "EXPENSE",
    category: "Moradia",
    transactionDate: "2026-11-02",
    status: "COMPLETED",
    source: "AI_OCR",
    createdAt: "2026-11-02T10:30:00.000Z",
  },
  {
    id: "tx-nova-3",
    description: "Supermercado Semanal",
    amount: 684.5,
    type: "EXPENSE",
    category: "Alimentação",
    transactionDate: "2026-11-03",
    status: "COMPLETED",
    source: "AI_OCR",
    createdAt: "2026-11-03T11:15:00.000Z",
  },
  {
    id: "tx-nova-4",
    description: "Internet Fibra & Streaming",
    amount: 169.9,
    type: "EXPENSE",
    category: "Assinaturas & Software",
    transactionDate: "2026-11-03",
    status: "COMPLETED",
    source: "MANUAL",
    createdAt: "2026-11-03T12:00:00.000Z",
  },
  {
    id: "tx-nova-5",
    description: "Combustível & Estacionamento",
    amount: 260.0,
    type: "EXPENSE",
    category: "Transporte",
    transactionDate: "2026-11-04",
    status: "COMPLETED",
    source: "AI_OCR",
    createdAt: "2026-11-04T08:40:00.000Z",
  },
];

type WorkspaceTab = "OVERVIEW" | "TIMELINE" | "SCANNER" | "ENVELOPES";

export function NexoNovaApp() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<WorkspaceTab>("OVERVIEW");
  const [transactions, setTransactions] = React.useState<TransactionRecord[]>(
    INITIAL_NOVA_TRANSACTIONS
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
  const [isSimulatingHero, startHeroSimTransition] = React.useTransition();

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

  function handleQuickAiSimulationFromHero() {
    const pdfHeader = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37,
    ]);
    const mockFile = new File([pdfHeader], "comprovante-pix-ia.pdf", {
      type: "application/pdf",
    });
    const formData = new FormData();
    formData.append("file", mockFile);

    startHeroSimTransition(async () => {
      const result = await processSmartInputAction(formData);
      if (result.success && result.data) {
        handleDraftExtracted(result.data, mockFile.name, result.mode);
      }
    });
  }

  function handleApproveDraft(validatedItems: TransactionInput[]) {
    startApproveTransition(async () => {
      const result = await approveDraftTransactionsAction(validatedItems);
      if (result.success && result.data) {
        setTransactions((prev) => [...result.data!, ...prev]);
        setDraftItems(null);
        setDraftFileName("");
        setFeedbackBanner(
          `${result.data.length} lançamento(s) da IA confirmados na sua carteira!`
        );
      }
    });
  }

  function handleManualSubmit(input: TransactionInput) {
    startManualTransition(async () => {
      const result = await createManualTransactionAction(input);
      if (result.success && result.data) {
        setTransactions((prev) => [result.data!, ...prev]);
        setIsManualModalOpen(false);
        setFeedbackBanner("Novo lançamento salvo com sucesso!");
      }
    });
  }

  function handleDeleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  }

  const navItems: {
    id: WorkspaceTab;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: string;
  }[] = [
    { id: "OVERVIEW", label: "Visão Geral", icon: LayoutDashboard },
    {
      id: "TIMELINE",
      label: "Extrato & Fluxo",
      icon: ListOrdered,
      badge: String(transactions.length),
    },
    { id: "SCANNER", label: "Scanner IA", icon: ScanLine, badge: "OCR" },
    { id: "ENVELOPES", label: "Envelopes & Metas", icon: PieChart },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#09090B] text-[#F4F4F5]"
          : "bg-[#F8FAFC] text-[#18181B]"
      }`}
    >
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* ====================================================================
            SIDEBAR ESQUERDA FIXA (APP-SHELL DESKTOP)
            ==================================================================== */}
        <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:justify-between border-r border-[#E4E4E7] bg-white px-4 py-6 dark:border-[#27272A] dark:bg-[#121216]">
          <div className="space-y-6">
            {/* Identidade da Marca 2TP Nexo */}
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DC2626] to-[#692296] text-white shadow-sm">
                <Flame className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                    Nexo Finance
                  </span>
                  <span className="rounded-md bg-[#DEC5EF]/60 px-1.5 py-0.5 text-[10px] font-extrabold text-[#692296] dark:bg-[#692296]/30 dark:text-[#C59BE3]">
                    v5.0
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
                  2TP Personal Wallet
                </p>
              </div>
            </div>

            {/* Menu de Navegação Contextual */}
            <nav aria-label="Navegação Principal" className="space-y-1.5">
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                Menu da Carteira
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-[#DC2626] to-[#692296] text-white shadow-sm"
                        : "text-[#3F3F46] hover:bg-[#F4F4F5] dark:text-[#D4D4D8] dark:hover:bg-[#1E1E24]"
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold tabular-nums ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#F4F4F5] text-[#3F3F46] dark:bg-[#27272A] dark:text-[#D4D4D8]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Atalho Rápido para o Novo Design System v5 */}
            <div className="border-t border-[#E4E4E7] pt-5 dark:border-[#27272A] space-y-2">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                Sistema & Padrões
              </p>
              <Link href="/design-system" className="block">
                <Button
                  variant="secondary"
                  size="md"
                  icon={Palette}
                  className="w-full justify-start"
                >
                  Design System Studio
                </Button>
              </Link>
            </div>
          </div>

          {/* Rodapé da Sidebar */}
          <div className="space-y-3 border-t border-[#E4E4E7] pt-4 dark:border-[#27272A]">
            <div className="rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] p-3 dark:border-[#27272A] dark:bg-[#09090B]">
              <p className="text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
                Conta Pessoal 2TP
              </p>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                Sincronizado • Novembro 2026
              </p>
            </div>
          </div>
        </aside>

        {/* ====================================================================
            ÁREA CENTRAL DE TRABALHO (WORKSPACE)
            ==================================================================== */}
        <div className="flex flex-1 flex-col min-w-0 pb-20 lg:pb-0">
          {/* Topbar Minimalista e Limpa */}
          <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/90 backdrop-blur-md dark:border-[#27272A] dark:bg-[#121216]/90">
            <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                {/* Logo visível no mobile */}
                <div className="flex lg:hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DC2626] to-[#692296] text-white">
                  <Flame className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                      {activeTab === "OVERVIEW" && "Visão Geral da Carteira"}
                      {activeTab === "TIMELINE" && "Extrato & Fluxo de Caixa"}
                      {activeTab === "SCANNER" && "Scanner Inteligente de Comprovantes"}
                      {activeTab === "ENVELOPES" && "Envelopes & Metas por Categoria"}
                    </h1>
                    <Badge variant="purple" icon={Sparkles}>
                      Nova UI • 3001
                    </Badge>
                  </div>
                  <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] hidden sm:block">
                    Controle financeiro pessoal rápido, limpo e automatizado com IA
                  </p>
                </div>
              </div>

              {/* Ações de Topo Single-Line */}
              <div className="flex flex-wrap items-center gap-2">
                <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />

                <Link href="/design-system" className="lg:hidden">
                  <Button variant="secondary" size="sm" icon={Palette}>
                    Design System
                  </Button>
                </Link>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  icon={Plus}
                  onClick={() => setIsManualModalOpen(true)}
                >
                  Novo Lançamento
                </Button>
              </div>
            </div>
          </header>

          {/* Conteúdo Dinâmico */}
          <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-6">
            {/* Banner de Feedback */}
            {feedbackBanner && (
              <NotificationBanner
                title="Carteira Atualizada"
                description={feedbackBanner}
                icon={CheckCircle2}
                intent="income"
                actionLabel="Fechar"
                actionIcon={X}
                onAction={() => setFeedbackBanner(null)}
              />
            )}

            {/* Painel de Revisão de Rascunho IA (Sempre visível no topo quando houver extração pendente) */}
            {draftItems && draftItems.length > 0 && (
              <DraftReviewPanel
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
            )}

            {/* ================================================================
                ABA 1: VISÃO GERAL (COCKPIT COMPLETO E LIMPO)
                ================================================================ */}
            {activeTab === "OVERVIEW" && (
              <>
                {/* 1. Cartão Principal Digital Wallet + 3 Pílulas de Fluxo */}
                <WalletHeroCard
                  totalBalance={summary.totalBalance}
                  totalIncome={summary.totalIncome}
                  totalExpenses={summary.totalExpense}
                  transactionCount={summary.transactionCount}
                  onOpenManualEntry={() => setIsManualModalOpen(true)}
                  onTriggerAiSimulation={handleQuickAiSimulationFromHero}
                  isSimulatingAi={isSimulatingHero}
                />

                {/* 2. Split-View Inteligente: Extrato Timeline (7 col) + Scanner IA & Envelopes (5 col) */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
                  <div className="xl:col-span-7">
                    <TimelineFeed
                      transactions={transactions}
                      onDeleteTransaction={handleDeleteTransaction}
                    />
                  </div>

                  <div className="xl:col-span-5 space-y-6">
                    <QuickAiScanner
                      onDraftExtracted={handleDraftExtracted}
                      onOpenManualModal={() => setIsManualModalOpen(true)}
                    />

                    <CategoryEnvelopes
                      transactions={transactions}
                      totalIncome={summary.totalIncome}
                      totalExpenses={summary.totalExpense}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ================================================================
                ABA 2: EXTRATO & FLUXO
                ================================================================ */}
            {activeTab === "TIMELINE" && (
              <div className="space-y-6">
                <TimelineFeed
                  transactions={transactions}
                  onDeleteTransaction={handleDeleteTransaction}
                />
                <FinanceCharts transactions={transactions} />
              </div>
            )}

            {/* ================================================================
                ABA 3: SCANNER IA
                ================================================================ */}
            {activeTab === "SCANNER" && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
                <div className="xl:col-span-6">
                  <QuickAiScanner
                    onDraftExtracted={handleDraftExtracted}
                    onOpenManualModal={() => setIsManualModalOpen(true)}
                  />
                </div>
                <div className="xl:col-span-6">
                  <TimelineFeed
                    transactions={transactions.filter((t) => t.source === "AI_OCR")}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </div>
              </div>
            )}

            {/* ================================================================
                ABA 4: ENVELOPES & METAS
                ================================================================ */}
            {activeTab === "ENVELOPES" && (
              <div className="space-y-6">
                <CategoryEnvelopes
                  transactions={transactions}
                  totalIncome={summary.totalIncome}
                  totalExpenses={summary.totalExpense}
                />
                <FinanceCharts transactions={transactions} />
              </div>
            )}
          </main>
        </div>

        {/* ====================================================================
            BARRA DE NAVEGAÇÃO INFERIOR MOBILE (THUMB-ZONE >= 44x44px)
            ==================================================================== */}
        <nav
          aria-label="Navegação Mobile"
          className="fixed bottom-0 inset-x-0 z-40 flex lg:hidden items-center justify-around border-t border-[#E4E4E7] bg-white/95 px-2 py-2 backdrop-blur-md dark:border-[#27272A] dark:bg-[#121216]/95"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-1 text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "text-[#DC2626] dark:text-[#E85950]"
                    : "text-[#71717A] dark:text-[#A1A1AA]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Modal de Lançamento Manual */}
      <ManualEntryModal
        isOpen={isManualModalOpen}
        isSubmitting={isSubmittingManual}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={handleManualSubmit}
      />
    </div>
  );
}
