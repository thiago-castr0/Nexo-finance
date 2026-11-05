import { NexoNovaApp } from "@/components/nova/nexo-nova-app";
import { fetchTransactionsAction } from "@/app/actions/transactions";
import { fetchCreditCardsAction } from "@/app/actions/cards";

export default async function HomePage() {
  const [txRes, cardsRes] = await Promise.all([
    fetchTransactionsAction(),
    fetchCreditCardsAction(),
  ]);

  return (
    <NexoNovaApp
      initialTransactions={txRes.data}
      initialCards={cardsRes.data}
    />
  );
}
