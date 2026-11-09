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
  Target,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/switch";
import { NotificationBanner } from "@/components/ui/toast-banner";
import { WalletHeroCard } from "@/components/nova-ui/wallet-hero-card";
import { TimelineFeed } from "@/components/nova-ui/timeline-feed";
import { CategoryEnvelopes } from "@/components/nova-ui/category-envelopes";
import { CategoryDonutChart } from "@/components/nova-ui/category-donut-chart";
import { QuickAiScanner } from "@/components/nova-ui/quick-ai-scanner";
import { CreditCardManager } from "@/components/nova-ui/credit-card-manager";
import { SavingsGoalsManager } from "@/components/nova-ui/savings-goals-manager";
import { UserProfileModal } from "@/components/nova-ui/user-profile-modal";
import { MobileBottomNav } from "@/components/nova-ui/mobile-bottom-nav";
import { MonthSelector } from "@/components/nova-ui/month-selector";
import { FinancialInsightsScore } from "@/components/nova-ui/financial-insights-score";
import { CashFlowChart } from "@/components/nova-ui/cash-flow-chart";
import { DraftReviewPanel } from "@/components/dashboard/draft-review-panel";
import { ManualEntryModal } from "@/components/dashboard/manual-entry-modal";
import { logoutAction, type UserProfileData } from "@/app/actions/auth";
import type { CreditCard } from "@/lib/schemas/credit-card";
import type { SavingsGoal } from "@/lib/schemas/savings-goal";
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

export type WorkspaceTab =
  | "OVERVIEW"
  | "TIMELINE"
  | "CARDS"
  | "GOALS"
  | "SCANNER"
  | "ENVELOPES";

export interface NexoNovaAppProps {
  initialTransactions?: TransactionRecord[];
  initialCards?: CreditCard[];
  initialGoals?: SavingsGoal[];
  initialBudgets?: Record<string, number>;
  initialProfile?: UserProfileData;
}

export function NexoNovaApp({
  initialTransactions,
  initialCards,
  initialGoals,
  initialBudgets,
  initialProfile,
}: NexoNovaAppProps = {}) {
  const [darkMode, setDarkMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<WorkspaceTab>("OVERVIEW");
  const [transactions, setTransactions] = React.useState<TransactionRecord[]>(
    initialTransactions ?? []
  );
  const [creditCards, setCreditCards] = React.useState<CreditCard[]>(
    initialCards ?? []
  );
  const [savingsGoals, setSavingsGoals] = React.useState<SavingsGoal[]>(
    initialGoals ?? []
  );
  const [categoryBudgets, setCategoryBudgets] = React.useState<
    Record<string, number> | undefined
  >(initialBudgets ?? {});
  const [userProfile, setUserProfile] = React.useState<
    UserProfileData | undefined
  >(initialProfile);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
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

  const dynamicCreditCards = React.useMemo(() => {
    return creditCards.map((card) => {
      const cardExpensesThisMonth = monthFilteredTransactions
        .filter((tx) => tx.type === "EXPENSE" && tx.creditCardId === card.id)
        .reduce((acc, tx) => acc + tx.amount, 0);

      const invoice = cardExpensesThisMonth > 0 ? cardExpensesThisMonth : card.currentInvoice;

      return {
        ...card,
        currentInvoice: invoice,
      };
    });
  }, [creditCards, monthFilteredTransactions]);

  const creditCardTotal = React.useMemo(() => {
    return dynamicCreditCards.reduce((acc, card) => acc + card.currentInvoice, 0);
  }, [dynamicCreditCards]);

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
          setTransactions((prev) => [...result.data!, ...prev]);
          setIsManualModalOpen(false);
          setFeedbackBanner(
            result.data.length > 1
              ? `${result.data.length} parcelas registradas com sucesso!`
              : "Lançamento salvo com sucesso!"
          );
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
    { id: "GOALS", label: "Metas", icon: Target },
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

          {/* Rodapé da Sidebar: Meu Perfil, Design System & Logout */}
          <div className="space-y-2 border-t border-[#E4E4E7] pt-4 dark:border-[#27272A]">
            <Button
              type="button"
              variant="neutral"
              size="sm"
              icon={User}
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full justify-start text-[#18181B] dark:text-[#E4E4E7]"
            >
              Meu Perfil
            </Button>

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
                {/* Avatar Mobile Clicável com Iniciais do Usuário */}
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex lg:hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DC2626] to-[#692296] text-white shadow-xs font-bold text-xs cursor-pointer active:scale-95 transition"
                  title="Abrir Meu Perfil"
                  aria-label="Abrir Meu Perfil"
                >
                  {userProfile?.fullName ? (
                    userProfile.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  ) : (
                    <Flame className="h-4 w-4" strokeWidth={1.75} />
                  )}
                </button>
                <div>
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                    {activeTab === "OVERVIEW" && "Minha Carteira"}
                    {activeTab === "TIMELINE" && "Extrato"}
                    {activeTab === "CARDS" && "Cartões de Crédito"}
                    {activeTab === "GOALS" && "Metas & Objetivos"}
                    {activeTab === "SCANNER" && "Importar com IA"}
                    {activeTab === "ENVELOPES" && "Gastos por Categoria"}
                  </h1>
                  {userProfile?.fullName && (
                    <p className="lg:hidden text-[10px] font-medium text-[#71717A] dark:text-[#A1A1AA] -mt-0.5">
                      Olá, {userProfile.fullName.split(" ")[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <MonthSelector currentDate={selectedDate} onChange={setSelectedDate} />
                <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />

                <Link href="/design-system" className="hidden sm:inline-flex lg:hidden">
                  <Button variant="secondary" size="sm" icon={Palette}>
                    Design
                  </Button>
                </Link>

                <Button
                  type="button"
                  variant="neutral"
                  size="sm"
                  icon={User}
                  onClick={() => setIsProfileModalOpen(true)}
                  title="Abrir meu perfil"
                  aria-label="Abrir meu perfil"
                  className="hidden lg:inline-flex"
                >
                  Perfil
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  className="hidden lg:inline-flex"
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

                <CashFlowChart
                  transactions={monthFilteredTransactions}
                  allTransactions={transactions}
                  selectedDate={selectedDate}
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
                      creditCards={dynamicCreditCards}
                      onDeleteTransaction={handleDeleteTransaction}
                      onEditTransaction={handleEditTransaction}
                    />
                  </div>

                  <div className="xl:col-span-5 flex flex-col gap-5">
                    <QuickAiScanner onDraftExtracted={handleDraftExtracted} />
                    <CategoryEnvelopes
                      transactions={monthFilteredTransactions}
                      initialBudgets={categoryBudgets}
                      onBudgetsChange={setCategoryBudgets}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ABA 2: EXTRATO */}
            {activeTab === "TIMELINE" && (
              <TimelineFeed
                transactions={monthFilteredTransactions}
                creditCards={dynamicCreditCards}
                onDeleteTransaction={handleDeleteTransaction}
                onEditTransaction={handleEditTransaction}
              />
            )}

            {/* ABA 3: CARTÕES DE CRÉDITO */}
            {activeTab === "CARDS" && (
              <CreditCardManager cards={dynamicCreditCards} onCardsChange={setCreditCards} />
            )}

            {/* ABA 4: METAS FINANCEIRAS & COFRINHOS */}
            {activeTab === "GOALS" && (
              <SavingsGoalsManager
                goals={savingsGoals}
                onGoalsChange={setSavingsGoals}
                monthlySavingsCapacity={Math.max(
                  0,
                  summary.totalIncome - summary.totalExpense
                )}
              />
            )}

            {/* ABA 5: IMPORTAR IA */}
            {activeTab === "SCANNER" && (
              <div className="mx-auto max-w-xl">
                <QuickAiScanner onDraftExtracted={handleDraftExtracted} />
              </div>
            )}

            {/* ABA 6: CATEGORIAS */}
            {activeTab === "ENVELOPES" && (
              <div className="space-y-5">
                <CategoryDonutChart transactions={monthFilteredTransactions} />
                <CategoryEnvelopes
                  transactions={monthFilteredTransactions}
                  initialBudgets={categoryBudgets}
                  onBudgetsChange={setCategoryBudgets}
                />
                <CashFlowChart
                  transactions={monthFilteredTransactions}
                  allTransactions={transactions}
                  selectedDate={selectedDate}
                />
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
            BARRA INFERIOR MOBILE 2.0 COM BOTÃO DE AÇÃO RÁPIDA (THUMB ZONE)
            ==================================================================== */}
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenManualEntry={() => {
            setEditingTransaction(null);
            setIsManualModalOpen(true);
          }}
          onOpenScanner={() => setActiveTab("SCANNER")}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
      </div>

      <ManualEntryModal
        key={editingTransaction ? editingTransaction.id : "new"}
        isOpen={isManualModalOpen}
        isSubmitting={isSubmittingManual}
        initialData={editingTransaction}
        creditCards={creditCards}
        onClose={() => {
          setIsManualModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleManualSubmit}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialProfile={userProfile}
        onProfileUpdate={setUserProfile}
      />
    </div>
  );
}
