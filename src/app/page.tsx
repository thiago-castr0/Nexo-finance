import { NexoNovaApp } from "@/components/nova/nexo-nova-app";
import { fetchTransactionsAction } from "@/app/actions/transactions";
import { fetchCreditCardsAction } from "@/app/actions/cards";
import { fetchSavingsGoalsAction } from "@/app/actions/goals";

export default async function HomePage() {
  const [txRes, cardsRes, goalsRes] = await Promise.all([
    fetchTransactionsAction(),
    fetchCreditCardsAction(),
    fetchSavingsGoalsAction(),
  ]);

  return (
    <NexoNovaApp
      initialTransactions={txRes.data}
      initialCards={cardsRes.data}
      initialGoals={goalsRes.data}
    />
  );
}

