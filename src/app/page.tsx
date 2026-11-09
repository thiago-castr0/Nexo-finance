import { NexoNovaApp } from "@/components/nova/nexo-nova-app";
import { fetchTransactionsAction } from "@/app/actions/transactions";
import { fetchCreditCardsAction } from "@/app/actions/cards";
import { fetchSavingsGoalsAction } from "@/app/actions/goals";
import { fetchCategoryBudgetsAction } from "@/app/actions/budgets";
import { getUserProfileAction } from "@/app/actions/auth";

export default async function HomePage() {
  const [txRes, cardsRes, goalsRes, budgetsRes, profileRes] = await Promise.all([
    fetchTransactionsAction(),
    fetchCreditCardsAction(),
    fetchSavingsGoalsAction(),
    fetchCategoryBudgetsAction(),
    getUserProfileAction(),
  ]);

  return (
    <NexoNovaApp
      initialTransactions={txRes.data}
      initialCards={cardsRes.data}
      initialGoals={goalsRes.data}
      initialBudgets={budgetsRes.data}
      initialProfile={profileRes.data}
    />
  );
}

