"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  CreditCard as CreditCardIcon,
  Flame,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Palette,
  PieChart,
  Plus,
  ScanLine,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/switch";
import { NotificationBanner } from "@/components/ui/toast-banner";
import { WalletHeroCard } from "@/components/nova-ui/wallet-hero-card";
import { TimelineFeed } from "@/components/nova-ui/timeline-feed";
import { CategoryEnvelopes } from "@/components/nova-ui/category-envelopes";
import { QuickAiScanner } from "@/components/nova-ui/quick-ai-scanner";
import { CreditCardManager } from "@/components/nova-ui/credit-card-manager";
import { MonthSelector } from "@/components/nova-ui/month-selector";
import { FinancialInsightsScore } from "@/components/nova-ui/financial-insights-score";
import { DraftReviewPanel } from "@/components/dashboard/draft-review-panel";
import { ManualEntryModal } from "@/components/dashboard/manual-entry-modal";
import { logoutAction } from "@/app/actions/auth";
import type { CreditCard } from "@/lib/schemas/credit-card";
import {
  approveDraftTransactionsAction,
  createManualTransactionAction,
  deleteTransactionAction,
  updateTransactionAction,
} from "@/app/actions/transactions";
import { calculateFinancialSummary } from "@/lib/finance";
import type {
  TransactionInput,
  TransactionRecord,
} from "@/lib/schemas/transaction";

const INITIAL_NOVA_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "tx-nova-1",
    description: "Salário Mensal",
    amount: 9200.0,
    type: "INCOME",
    category: "Salário & Renda",
    transactionDate: "2026-11-01",
    status: "COMPLETED",
    source: "MANUAL",
    isRecurring: true,
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
    isRecurring: true,
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
    description: "Internet & Streaming",
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
    description: "Combustível",
    amount: 260.0,
    type: "EXPENSE",
    category: "Transporte",
    transactionDate: "2026-11-04",
    status: "COMPLETED",
    source: "AI_OCR",
    createdAt: "2026-11-04T08:40:00.000Z",
  },
];

type WorkspaceTab = "OVERVIEW" | "TIMELINE" | "CARDS" | "SCANNER" | "ENVELOPES";

const INITIAL_DEMO_CARDS: CreditCard[] = [
  {
    id: "card-1",
    name: "Nubank Ultravioleta",
    lastDigits: "8842",
    brand: "Mastercard",
    color: "#692296",
    creditLimit: 12000,
    currentInvoice: 2650.4,
    closingDay: 18,
    dueDay: 25,
  },
  {
    id: "card-2",
    name: "Itaú Personnalité Black",
    lastDigits: "1093",
    brand: "Visa",
    color: "#DC2626",
    creditLimit: 25000,
    currentInvoice: 4120.0,
    closingDay: 5,
    dueDay: 12,
  },
];

export interface NexoNovaAppProps {
  initialTransactions?: TransactionRecord[];
  initialCards?: CreditCard[];
}

export function NexoNovaApp({
  initialTransactions,
  initialCards,
}: NexoNovaAppProps = {}) {
  const [darkMode, setDarkMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<WorkspaceTab>("OVERVIEW");
  const [transactions, setTransactions] = React.useState<TransactionRecord[]>(
    initialTransactions && initialTransactions.length > 0
      ? initialTransactions
      : INITIAL_NOVA_TRANSACTIONS
  );
  const [creditCards, setCreditCards] = React.useState<CreditCard[]>(
    initialCards && initialCards.length > 0 ? initialCards : INITIAL_DEMO_CARDS
  );
  const [draftItems, setDraftItems] = React.useState<TransactionInput[] | null>(
    null
  );
  const [draftFileName, setDraftFileName] = React.useState<string>("");
  const [draftMode, setDraftMode] = React.useState<
    "GEMINI_API" | "SMART_SIMULATION" | undefined
  >(undefined);
  const [isManualModalOpen, setIsManualModalOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<TransactionRecord | null>(null);
  const [feedbackBanner, setFeedbackBanner] = React.useState<string | null>(
    null
  );

  const [isApprovingDraft, startApproveTransition] = React.useTransition();
  const [isSubmittingManual, startManualTransition] = React.useTransition();

  const [selectedDate, setSelectedDate] = React.useState<Date>(() => new Date());

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const monthFilteredTransactions = React.useMemo(() => {
    const targetYear = selectedDate.getFullYear();
    const targetMonth = selectedDate.getMonth() + 1;
    const prefix = `${targetYear}-${String(targetMonth).padStart(2, "0")}`;

    // 1. Transações reais registradas para este mês
    const realInMonth = transactions.filter((tx) =>
      tx.transactionDate.startsWith(prefix)
    );

    // 2. Transações recorrentes que devem ser projetadas para este mês
    const projectedRecurring: TransactionRecord[] = [];
    const recurringSources = transactions.filter((tx) => tx.isRecurring);

    for (const rec of recurringSources) {
      const alreadyHas = realInMonth.some(
        (tx) => tx.description.toLowerCase() === rec.description.toLowerCase()
      );
      if (!alreadyHas) {
        const originalDay = rec.transactionDate.split("-")[2] || "01";
        projectedRecurring.push({
          ...rec,
          id: `proj-${rec.id}-${prefix}`,
          transactionDate: `${prefix}-${originalDay}`,
          status: "COMPLETED",
        });
      }
    }

    const combined = [...realInMonth, ...projectedRecurring];
    if (combined.length === 0) {
      return transactions;
    }
    return combined.sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
  }, [transactions, selectedDate]);

  const creditCardTotal = React.useMemo(() => {
    return creditCards.reduce((acc, card) => acc + card.currentInvoice, 0);
  }, [creditCards]);

  const summary = React.useMemo(
    () => calculateFinancialSummary(monthFilteredTransactions),
    [monthFilteredTransactions]
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

  function handleApproveDraft(validatedItems: TransactionInput[]) {
    startApproveTransition(async () => {
      const result = await approveDraftTransactionsAction(validatedItems);
      if (result.success && result.data) {
        setTransactions((prev) => [...result.data!, ...prev]);
        setDraftItems(null);
        setDraftFileName("");
        setFeedbackBanner(
          `${result.data.length} lançamento(s) adicionados com sucesso!`
        );
      }
    });
  }

  function handleManualSubmit(input: TransactionInput) {
    startManualTransition(async () => {
      if (editingTransaction) {
        const result = await updateTransactionAction(editingTransaction.id, input);
        if (result.success && result.data) {
          setTransactions((prev) =>
            prev.map((item) => (item.id === editingTransaction.id ? result.data! : item))
          );
          setIsManualModalOpen(false);
          setEditingTransaction(null);
          setFeedbackBanner("Lançamento atualizado com sucesso!");
        } else {
          setFeedbackBanner(result.error || "Erro ao atualizar lançamento.");
        }
      } else {
        const result = await createManualTransactionAction(input);
        if (result.success && result.data) {
          setTransactions((prev) => [result.data!, ...prev]);
          setIsManualModalOpen(false);
          setFeedbackBanner("Lançamento salvo!");
        } else {
          setFeedbackBanner(result.error || "Erro ao salvar lançamento.");
        }
      }
    });
  }

  function handleEditTransaction(transaction: TransactionRecord) {
    setEditingTransaction(transaction);
    setIsManualModalOpen(true);
  }

  async function handleDeleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
    await deleteTransactionAction(id);
  }

  const navItems: {
    id: WorkspaceTab;
    label: string;
    icon: typeof LayoutDashboard;
  }[] = [
    { id: "OVERVIEW", label: "Início", icon: LayoutDashboard },
    { id: "TIMELINE", label: "Extrato", icon: ListOrdered },
    { id: "CARDS", label: "Cartões", icon: CreditCardIcon },
    { id: "SCANNER", label: "Importar IA", icon: ScanLine },
    { id: "ENVELOPES", label: "Categorias", icon: PieChart },
  ];

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#0F0A19] via-[#09090B] to-[#160A0D] text-[#F4F4F5]"
          : "bg-gradient-to-br from-[#F5ECFB] via-[#FFFFFF] to-[#FDECEC] text-[#18181B]"
      }`}
    >
      {/* Mistura Suave de Vermelho, Roxo e Branco no Fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className={`absolute -top-24 -left-16 h-[480px] w-[480px] rounded-full blur-[130px] ${
            darkMode ? "bg-[#692296]/25" : "bg-[#692296]/18"
          }`}
        />
        <div
          className={`absolute top-1/4 -right-16 h-[460px] w-[460px] rounded-full blur-[130px] ${
            darkMode ? "bg-[#DC2626]/20" : "bg-[#DC2626]/15"
          }`}
        />
        <div
          className={`absolute -bottom-24 left-1/3 h-[420px] w-[420px] rounded-full blur-[130px] ${
            darkMode ? "bg-[#A466D1]/15" : "bg-[#DEC5EF]/45"
          }`}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* ====================================================================
            SIDEBAR EM VIDRO BRANCO COM ALTO CONTRASTE (DESKTOP)
            ==================================================================== */}
        <aside className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:justify-between border-r border-[#E4E4E7] bg-white/88 backdrop-blur-2xl px-4 py-6 dark:border-[#27272A] dark:bg-[#18181B]/90">
          <div className="space-y-6">
            {/* Marca 2TP Nexo */}
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DC2626] to-[#692296] text-white shadow-xs">
                <Flame className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <span className="text-base font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                Nexo Finance
              </span>
            </div>

            {/* Navegação Enxuta */}
            <nav aria-label="Menu Principal" className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-[#DC2626] to-[#692296] text-white shadow-xs"
                        : "text-[#18181B] hover:bg-[#F4F4F5] dark:text-[#E4E4E7] dark:hover:bg-[#27272A]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Rodapé da Sidebar: Design System & Logout */}
          <div className="space-y-2 border-t border-[#E4E4E7] pt-4 dark:border-[#27272A]">
            <Link href="/design-system" className="block">
              <Button
                variant="secondary"
                size="sm"
                icon={Palette}
                className="w-full justify-start"
              >
                Design System
              </Button>
            </Link>

            <form action={logoutAction}>
              <Button
                type="submit"
                variant="neutral"
                size="sm"
                icon={LogOut}
                className="w-full justify-start text-[#DF2929] hover:bg-[#F9C5BD]/30 hover:border-[#F4948C] dark:text-[#EC6862]"
              >
                Sair da Conta
              </Button>
            </form>
          </div>
        </aside>

        {/* ====================================================================
            ÁREA PRINCIPAL CLEAN
            ==================================================================== */}
        <div className="flex flex-1 flex-col min-w-0 pb-20 lg:pb-0">
          {/* Header Clean em Vidro Branco com Texto Nítido */}
          <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/88 backdrop-blur-2xl dark:border-[#27272A] dark:bg-[#18181B]/90">
            <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2.5">
                <div className="flex lg:hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DC2626] to-[#692296] text-white">
                  <Flame className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                  {activeTab === "OVERVIEW" && "Minha Carteira"}
                  {activeTab === "TIMELINE" && "Extrato"}
                  {activeTab === "CARDS" && "Cartões de Crédito"}
                  {activeTab === "SCANNER" && "Importar com IA"}
                  {activeTab === "ENVELOPES" && "Gastos por Categoria"}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <MonthSelector currentDate={selectedDate} onChange={setSelectedDate} />
                <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />

                <Link href="/design-system" className="lg:hidden">
                  <Button variant="secondary" size="sm" icon={Palette}>
                    Design
                  </Button>
                </Link>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    setEditingTransaction(null);
                    setIsManualModalOpen(true);
                  }}
                >
                  Novo Gasto
                </Button>
              </div>
            </div>
          </header>

          {/* Conteúdo Central Enxuto */}
          <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-5">
            {feedbackBanner && (
              <NotificationBanner
                title="Pronto"
                description={feedbackBanner}
                icon={CheckCircle2}
                intent="income"
                actionLabel="Fechar"
                actionIcon={X}
                onAction={() => setFeedbackBanner(null)}
              />
            )}

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

            {/* ABA 1: INÍCIO (3 Números Limpos no Topo + Lançamentos + Lateral Enxuta) */}
            {activeTab === "OVERVIEW" && (
              <>
                <WalletHeroCard
                  totalBalance={summary.totalBalance}
                  totalIncome={summary.totalIncome}
                  totalExpenses={summary.totalExpense}
                />

                <FinancialInsightsScore
                  transactions={monthFilteredTransactions}
                  totalIncome={summary.totalIncome}
                  totalExpenses={summary.totalExpense}
                  creditCardTotal={creditCardTotal}
                />

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 items-stretch">
                  <div className="xl:col-span-7 flex flex-col">
                    <TimelineFeed
                      transactions={monthFilteredTransactions}
                      onDeleteTransaction={handleDeleteTransaction}
                      onEditTransaction={handleEditTransaction}
                    />
                  </div>

                  <div className="xl:col-span-5 flex flex-col gap-5">
                    <QuickAiScanner onDraftExtracted={handleDraftExtracted} />
                    <CategoryEnvelopes transactions={monthFilteredTransactions} />
                  </div>
                </div>
              </>
            )}

            {/* ABA 2: EXTRATO */}
            {activeTab === "TIMELINE" && (
              <TimelineFeed
                transactions={monthFilteredTransactions}
                onDeleteTransaction={handleDeleteTransaction}
                onEditTransaction={handleEditTransaction}
              />
            )}

            {/* ABA 3: CARTÕES DE CRÉDITO */}
            {activeTab === "CARDS" && (
              <CreditCardManager cards={creditCards} onCardsChange={setCreditCards} />
            )}

            {/* ABA 4: IMPORTAR IA */}
            {activeTab === "SCANNER" && (
              <div className="mx-auto max-w-xl">
                <QuickAiScanner onDraftExtracted={handleDraftExtracted} />
              </div>
            )}

            {/* ABA 5: CATEGORIAS */}
            {activeTab === "ENVELOPES" && (
              <div className="space-y-5">
                <CategoryEnvelopes transactions={monthFilteredTransactions} />
                <FinancialInsightsScore
                  transactions={monthFilteredTransactions}
                  totalIncome={summary.totalIncome}
                  totalExpenses={summary.totalExpense}
                  creditCardTotal={creditCardTotal}
                />
              </div>
            )}
          </main>
        </div>

        {/* ====================================================================
            BARRA INFERIOR MOBILE EM VIDRO BRANCO
            ==================================================================== */}
        <nav
          aria-label="Navegação Mobile"
          className="fixed bottom-0 inset-x-0 z-40 flex lg:hidden items-center justify-around border-t border-[#E4E4E7] bg-white/90 px-2 py-2 backdrop-blur-2xl dark:border-[#27272A] dark:bg-[#18181B]/95"
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
                    : "text-[#3F3F46] dark:text-[#D4D4D8]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <ManualEntryModal
        key={editingTransaction ? editingTransaction.id : "new"}
        isOpen={isManualModalOpen}
        isSubmitting={isSubmittingManual}
        initialData={editingTransaction}
        onClose={() => {
          setIsManualModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleManualSubmit}
      />
    </div>
  );
}
