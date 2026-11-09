"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowUpDown,
  Briefcase,
  Car,
  CreditCard as CreditCardIcon,
  Download,
  Filter,
  HeartPulse,
  Home,
  LayoutList,
  Pencil,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrencyBRL } from "@/lib/finance";
import { exportTransactionsToCSV } from "@/lib/export-csv";
import { CATEGORIES } from "@/lib/schemas/transaction";
import type { TransactionRecord } from "@/lib/schemas/transaction";
import type { CreditCard } from "@/lib/schemas/credit-card";

function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}`;
}

export type SortOption =
  | "DATE_DESC"
  | "DATE_ASC"
  | "AMOUNT_DESC"
  | "AMOUNT_ASC"
  | "DESC_AZ";

export interface TimelineFeedProps {
  transactions: TransactionRecord[];
  creditCards?: CreditCard[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction?: (transaction: TransactionRecord) => void;
}

type QuickFilter = "ALL" | "INCOME" | "EXPENSE";
type SpecialFilter = "ALL" | "AI_OCR" | "RECURRING" | "INSTALLMENT";

function getCategoryIcon(category: string, type: "INCOME" | "EXPENSE") {
  const lower = category.toLowerCase();
  if (type === "INCOME" || lower.includes("salário") || lower.includes("renda")) {
    return Briefcase;
  }
  if (lower.includes("moradia") || lower.includes("aluguel")) {
    return Home;
  }
  if (lower.includes("alimenta") || lower.includes("mercado")) {
    return Utensils;
  }
  if (lower.includes("transporte") || lower.includes("combustível")) {
    return Car;
  }
  if (lower.includes("saúde") || lower.includes("farmácia")) {
    return HeartPulse;
  }
  if (lower.includes("assinatura") || lower.includes("software")) {
    return CreditCardIcon;
  }
  return ShoppingBag;
}

export function TimelineFeed({
  transactions,
  creditCards = [],
  onDeleteTransaction,
  onEditTransaction,
}: TimelineFeedProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<QuickFilter>("ALL");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [selectedCard, setSelectedCard] = React.useState<string>("ALL");
  const [selectedSpecial, setSelectedSpecial] = React.useState<SpecialFilter>("ALL");
  const [sortBy, setSortBy] = React.useState<SortOption>("DATE_DESC");
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Lista dinâmica e única de categorias
  const availableCategories = React.useMemo(() => {
    const fromTxs = transactions.map((t) => t.category);
    const combined = Array.from(new Set([...CATEGORIES, ...fromTxs]));
    return combined.sort((a, b) => a.localeCompare(b));
  }, [transactions]);

  // Mapa de cartões para busca rápida do nome
  const cardMap = React.useMemo(() => {
    const map = new Map<string, CreditCard>();
    for (const c of creditCards) {
      if (c.id) {
        map.set(c.id, c);
      }
    }
    return map;
  }, [creditCards]);

  // Filtragem e ordenação
  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return transactions
      .filter((tx) => {
        // 1. Busca textual
        const matchesText =
          !q ||
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.amount.toString().includes(q);

        // 2. Tipo (Todos / Entradas / Saídas)
        const matchesType =
          activeFilter === "ALL" ||
          (activeFilter === "INCOME" && tx.type === "INCOME") ||
          (activeFilter === "EXPENSE" && tx.type === "EXPENSE");

        // 3. Categoria
        const matchesCategory =
          selectedCategory === "ALL" || tx.category === selectedCategory;

        // 4. Cartão / Meio de pagamento
        const matchesCard =
          selectedCard === "ALL" ||
          (selectedCard === "ACCOUNT" && !tx.creditCardId) ||
          tx.creditCardId === selectedCard;

        // 5. Filtro especial (IA, Fixa, Parcelada)
        const matchesSpecial =
          selectedSpecial === "ALL" ||
          (selectedSpecial === "AI_OCR" && tx.source === "AI_OCR") ||
          (selectedSpecial === "RECURRING" && Boolean(tx.isRecurring)) ||
          (selectedSpecial === "INSTALLMENT" &&
            Boolean(tx.totalInstallments && tx.totalInstallments > 1));

        return (
          matchesText &&
          matchesType &&
          matchesCategory &&
          matchesCard &&
          matchesSpecial
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "DATE_ASC":
            return a.transactionDate.localeCompare(b.transactionDate);
          case "AMOUNT_DESC":
            return b.amount - a.amount;
          case "AMOUNT_ASC":
            return a.amount - b.amount;
          case "DESC_AZ":
            return a.description.localeCompare(b.description);
          case "DATE_DESC":
          default:
            return b.transactionDate.localeCompare(a.transactionDate);
        }
      });
  }, [
    transactions,
    searchQuery,
    activeFilter,
    selectedCategory,
    selectedCard,
    selectedSpecial,
    sortBy,
  ]);

  // Métricas do extrato filtrado
  const metrics = React.useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const tx of filtered) {
      if (tx.type === "INCOME") {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    }
    return {
      income,
      expense,
      balance: income - expense,
      count: filtered.length,
      totalCount: transactions.length,
    };
  }, [filtered, transactions.length]);

  // Contagem de filtros ativos
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (activeFilter !== "ALL") count++;
    if (selectedCategory !== "ALL") count++;
    if (selectedCard !== "ALL") count++;
    if (selectedSpecial !== "ALL") count++;
    if (sortBy !== "DATE_DESC") count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [
    activeFilter,
    selectedCategory,
    selectedCard,
    selectedSpecial,
    sortBy,
    searchQuery,
  ]);

  function handleResetAllFilters() {
    setSearchQuery("");
    setActiveFilter("ALL");
    setSelectedCategory("ALL");
    setSelectedCard("ALL");
    setSelectedSpecial("ALL");
    setSortBy("DATE_DESC");
  }

  return (
    <div className="flex h-full flex-col rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 sm:p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5]">
      {/* ====================================================================
          TOPO: Título + Badges + Botões Rápidos + Toggle de Filtros
          ==================================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
            Lançamentos
          </h2>
          <span className="rounded-full bg-[#DEC5EF]/40 px-2.5 py-0.5 text-xs font-bold text-[#692296] dark:bg-[#692296]/30 dark:text-[#DEC5EF]">
            {filtered.length}
            {filtered.length !== transactions.length && ` de ${transactions.length}`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtros de Tipo */}
          <Button
            type="button"
            size="sm"
            variant={activeFilter === "ALL" ? "primary" : "neutral"}
            icon={LayoutList}
            onClick={() => setActiveFilter("ALL")}
          >
            Todos
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activeFilter === "INCOME" ? "income" : "neutral"}
            icon={ArrowUpRight}
            onClick={() => setActiveFilter("INCOME")}
          >
            Entradas
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activeFilter === "EXPENSE" ? "expense" : "neutral"}
            icon={ArrowDownRight}
            onClick={() => setActiveFilter("EXPENSE")}
          >
            Saídas
          </Button>

          {/* Botão de Filtros Avançados */}
          <Button
            type="button"
            size="sm"
            variant={showAdvanced || activeFiltersCount > 0 ? "secondary" : "neutral"}
            icon={SlidersHorizontal}
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="relative"
            title="Abrir filtros avançados"
          >
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#692296] px-1 text-[10px] font-extrabold text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {/* Exportação CSV */}
          <Button
            type="button"
            size="sm"
            variant="neutral"
            icon={Download}
            onClick={() => exportTransactionsToCSV(filtered)}
            title="Baixar extrato filtrado em formato Excel BR / CSV"
          >
            CSV
          </Button>
        </div>
      </div>

      {/* ====================================================================
          BARRA DE BUSCA EM TEMPO REAL
          ==================================================================== */}
      <div className="relative mt-3">
        <Input
          type="search"
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por descrição, estabelecimento ou valor..."
          aria-label="Buscar lançamentos"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:bg-[#27272A] cursor-pointer"
            title="Limpar busca"
            aria-label="Limpar busca"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ====================================================================
          PAINEL EXPANSÍVEL DE FILTROS AVANÇADOS
          ==================================================================== */}
      {showAdvanced && (
        <div className="mt-3 rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5]/60 p-3.5 dark:border-[#27272A] dark:bg-[#18181B]/60 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* 1. Seletor de Categoria */}
            <div>
              <label
                htmlFor="filter-category"
                className="block text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA] mb-1"
              >
                Categoria
              </label>
              <div className="relative">
                <select
                  id="filter-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E4E4E7] bg-white px-3 py-2 text-xs font-semibold text-[#18181B] shadow-xs focus:border-[#692296] focus:outline-none focus:ring-2 focus:ring-[#692296]/20 dark:border-[#27272A] dark:bg-[#121216] dark:text-[#F4F4F5]"
                >
                  <option value="ALL">Todas as categorias</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Tag className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
              </div>
            </div>

            {/* 2. Seletor de Cartão / Conta */}
            <div>
              <label
                htmlFor="filter-card"
                className="block text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA] mb-1"
              >
                Forma de Pagamento
              </label>
              <div className="relative">
                <select
                  id="filter-card"
                  value={selectedCard}
                  onChange={(e) => setSelectedCard(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E4E4E7] bg-white px-3 py-2 text-xs font-semibold text-[#18181B] shadow-xs focus:border-[#692296] focus:outline-none focus:ring-2 focus:ring-[#692296]/20 dark:border-[#27272A] dark:bg-[#121216] dark:text-[#F4F4F5]"
                >
                  <option value="ALL">Todas as formas</option>
                  <option value="ACCOUNT">Conta Corrente / Dinheiro</option>
                  {creditCards.map((card) => (
                    <option key={card.id || card.name} value={card.id || ""}>
                      Cartão {card.name} (•••• {card.lastDigits})
                    </option>
                  ))}
                </select>
                <CreditCardIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
              </div>
            </div>

            {/* 3. Seletor de Origem / Especial */}
            <div>
              <label
                htmlFor="filter-special"
                className="block text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA] mb-1"
              >
                Origem & Recorrência
              </label>
              <div className="relative">
                <select
                  id="filter-special"
                  value={selectedSpecial}
                  onChange={(e) => setSelectedSpecial(e.target.value as SpecialFilter)}
                  className="w-full appearance-none rounded-xl border border-[#E4E4E7] bg-white px-3 py-2 text-xs font-semibold text-[#18181B] shadow-xs focus:border-[#692296] focus:outline-none focus:ring-2 focus:ring-[#692296]/20 dark:border-[#27272A] dark:bg-[#121216] dark:text-[#F4F4F5]"
                >
                  <option value="ALL">Todos os lançamentos</option>
                  <option value="AI_OCR">✨ Extraídos por IA (OCR)</option>
                  <option value="RECURRING">🔄 Despesas/Rendas Fixas</option>
                  <option value="INSTALLMENT">💳 Compras Parceladas</option>
                </select>
                <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
              </div>
            </div>

            {/* 4. Ordenação */}
            <div>
              <label
                htmlFor="filter-sort"
                className="block text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA] mb-1"
              >
                Ordenação
              </label>
              <div className="relative">
                <select
                  id="filter-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full appearance-none rounded-xl border border-[#E4E4E7] bg-white px-3 py-2 text-xs font-semibold text-[#18181B] shadow-xs focus:border-[#692296] focus:outline-none focus:ring-2 focus:ring-[#692296]/20 dark:border-[#27272A] dark:bg-[#121216] dark:text-[#F4F4F5]"
                >
                  <option value="DATE_DESC">Data: Mais recente primeiro</option>
                  <option value="DATE_ASC">Data: Mais antigo primeiro</option>
                  <option value="AMOUNT_DESC">Valor: Maior primeiro</option>
                  <option value="AMOUNT_ASC">Valor: Menor primeiro</option>
                  <option value="DESC_AZ">Nome: A - Z</option>
                </select>
                <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          CHIPS DE FILTROS ATIVOS + BOTÃO LIMPAR
          ==================================================================== */}
      {activeFiltersCount > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA] mr-1">
            Filtros ativos:
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#DEC5EF]/40 px-2 py-1 text-[11px] font-bold text-[#692296] dark:bg-[#692296]/20 dark:text-[#DEC5EF]">
              Busca: &ldquo;{searchQuery}&rdquo;
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="hover:opacity-75 cursor-pointer"
                title="Remover busca"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeFilter !== "ALL" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#DEC5EF]/40 px-2 py-1 text-[11px] font-bold text-[#692296] dark:bg-[#692296]/20 dark:text-[#DEC5EF]">
              Tipo: {activeFilter === "INCOME" ? "Entradas" : "Saídas"}
              <button
                type="button"
                onClick={() => setActiveFilter("ALL")}
                className="hover:opacity-75 cursor-pointer"
                title="Remover filtro de tipo"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedCategory !== "ALL" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#BCD6F2]/40 px-2 py-1 text-[11px] font-bold text-[#2572CE] dark:bg-[#2572CE]/20 dark:text-[#BCD6F2]">
              Categoria: {selectedCategory}
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className="hover:opacity-75 cursor-pointer"
                title="Remover filtro de categoria"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedCard !== "ALL" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#BCE5CB]/50 px-2 py-1 text-[11px] font-bold text-[#0CB853] dark:bg-[#0CB853]/20 dark:text-[#BCE5CB]">
              {selectedCard === "ACCOUNT"
                ? "Conta / Dinheiro"
                : `Cartão: ${cardMap.get(selectedCard)?.name || "Selecionado"}`}
              <button
                type="button"
                onClick={() => setSelectedCard("ALL")}
                className="hover:opacity-75 cursor-pointer"
                title="Remover filtro de forma de pagamento"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedSpecial !== "ALL" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#FACBC2]/50 px-2 py-1 text-[11px] font-bold text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#FACBC2]">
              {selectedSpecial === "AI_OCR" && "✨ Lido por IA"}
              {selectedSpecial === "RECURRING" && "🔄 Fixas / Recorrentes"}
              {selectedSpecial === "INSTALLMENT" && "💳 Parceladas"}
              <button
                type="button"
                onClick={() => setSelectedSpecial("ALL")}
                className="hover:opacity-75 cursor-pointer"
                title="Remover filtro especial"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {sortBy !== "DATE_DESC" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#F4F4F5] px-2 py-1 text-[11px] font-bold text-[#3F3F46] dark:bg-[#27272A] dark:text-[#D4D4D8]">
              {sortBy === "DATE_ASC" && "Mais antigo"}
              {sortBy === "AMOUNT_DESC" && "Maior valor"}
              {sortBy === "AMOUNT_ASC" && "Menor valor"}
              {sortBy === "DESC_AZ" && "Nome A-Z"}
              <button
                type="button"
                onClick={() => setSortBy("DATE_DESC")}
                className="hover:opacity-75 cursor-pointer"
                title="Voltar à ordenação padrão"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetAllFilters}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DF2929] hover:underline cursor-pointer ml-1"
            title="Limpar todos os filtros"
          >
            <RotateCcw className="h-3 w-3" />
            Limpar tudo
          </button>
        </div>
      )}

      {/* ====================================================================
          MINI RESUMO DOS VALORES FILTRADOS
          ==================================================================== */}
      {activeFiltersCount > 0 && filtered.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-[#692296]/5 via-white to-[#DC2626]/5 px-3 py-1.5 text-xs font-semibold border border-[#E4E4E7]/60 dark:border-[#27272A]/60 dark:from-[#692296]/10 dark:to-[#DC2626]/10">
          <span className="text-[#3F3F46] dark:text-[#A1A1AA]">
            Total filtrado:{" "}
            <strong className="text-[#18181B] dark:text-white">
              {metrics.count} {metrics.count === 1 ? "item" : "itens"}
            </strong>
          </span>
          <div className="flex items-center gap-3">
            {metrics.income > 0 && (
              <span className="text-[#0CB853] font-bold">
                +{formatCurrencyBRL(metrics.income)}
              </span>
            )}
            {metrics.expense > 0 && (
              <span className="text-[#DF2929] font-bold">
                -{formatCurrencyBRL(metrics.expense)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          LISTA CLEAN DE LANÇAMENTOS (WCAG AA)
          ==================================================================== */}
      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D4D4D8] bg-[#F8FAFC] p-8 text-center dark:border-[#3F3F46] dark:bg-[#121216]">
          <p className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
            Nenhum lançamento encontrado para os filtros selecionados.
          </p>
          <p className="mt-1 text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
            Tente ajustar os termos de busca ou remover alguns filtros aplicados.
          </p>
          {activeFiltersCount > 0 && (
            <Button
              type="button"
              size="sm"
              variant="neutral"
              icon={RotateCcw}
              onClick={handleResetAllFilters}
              className="mt-3"
            >
              Restaurar todos os lançamentos
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-4 flex-1 flex flex-col justify-between divide-y divide-[#E4E4E7] dark:divide-[#27272A]">
          {filtered.map((tx) => {
            const isIncome = tx.type === "INCOME";
            const CategoryIcon = getCategoryIcon(tx.category, tx.type);
            const card = tx.creditCardId ? cardMap.get(tx.creditCardId) : null;

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-3 py-3.5 transition-colors hover:bg-[#F4F4F5]/70 dark:hover:bg-[#27272A]/50 px-2 rounded-2xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      isIncome
                        ? "bg-[#BCE5CB]/60 text-[#0CB853] dark:bg-[#0CB853]/20 dark:text-[#46C87D]"
                        : "bg-[#F4F4F5] text-[#18181B] dark:bg-[#27272A] dark:text-[#E4E4E7]"
                    }`}
                  >
                    <CategoryIcon className="h-4 w-4" strokeWidth={1.75} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-sm font-bold text-[#18181B] dark:text-[#FFFFFF]">
                        {tx.description}
                      </p>
                      {tx.source === "AI_OCR" && (
                        <span
                          className="inline-flex items-center gap-1 rounded-md bg-[#DEC5EF]/40 px-1.5 py-0.5 text-[9px] font-extrabold text-[#692296] dark:bg-[#692296]/30 dark:text-[#DEC5EF]"
                          title="Lançamento extraído automaticamente por IA"
                        >
                          <Sparkles className="h-2.5 w-2.5" />
                          IA
                        </span>
                      )}
                      {tx.isRecurring && (
                        <span className="rounded-md bg-[#DEC5EF]/40 px-1.5 py-0.5 text-[9px] font-extrabold text-[#692296] dark:bg-[#692296]/30 dark:text-[#DEC5EF]">
                          Fixa
                        </span>
                      )}
                      {tx.totalInstallments && tx.totalInstallments > 1 && (
                        <span className="rounded-md bg-[#BCD6F2]/40 px-1.5 py-0.5 text-[9px] font-extrabold text-[#2572CE] dark:bg-[#2572CE]/20 dark:text-[#BCD6F2]">
                          {tx.installmentNumber}/{tx.totalInstallments}x
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{formatDateBR(tx.transactionDate)}</span>
                      {card && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#692296] dark:text-[#DEC5EF]">
                            <CreditCardIcon className="h-3 w-3" />
                            {card.name} (•••• {card.lastDigits})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-sm font-extrabold tabular-nums whitespace-nowrap ${
                      isIncome
                        ? "text-[#0CB853] dark:text-[#46C87D]"
                        : "text-[#DF2929] dark:text-[#EC6862]"
                    }`}
                  >
                    {isIncome ? "+" : "-"} {formatCurrencyBRL(tx.amount)}
                  </span>

                  <div className="flex items-center gap-1">
                    {onEditTransaction && (
                      <button
                        type="button"
                        onClick={() => onEditTransaction(tx)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[#71717A] transition hover:bg-[#DEC5EF]/40 hover:text-[#692296] dark:text-[#A1A1AA] dark:hover:bg-[#692296]/20 dark:hover:text-[#DEC5EF] cursor-pointer"
                        title="Editar lançamento"
                        aria-label={`Editar ${tx.description}`}
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[#71717A] transition hover:bg-[#F9C5BD]/50 hover:text-[#DF2929] dark:text-[#A1A1AA] dark:hover:bg-[#DF2929]/20 cursor-pointer"
                      title="Excluir lançamento"
                      aria-label={`Excluir ${tx.description}`}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
