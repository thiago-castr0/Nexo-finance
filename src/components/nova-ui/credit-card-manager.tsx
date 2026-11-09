"use client";

import * as React from "react";
import {
  CreditCard as CreditCardIcon,
  Plus,
  Calendar,
  Eye,
  EyeOff,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrencyBRL } from "@/lib/finance";
import type { CreditCard } from "@/lib/schemas/credit-card";
import { createCreditCardAction, deleteCreditCardAction } from "@/app/actions/cards";

export interface CreditCardManagerProps {
  cards: CreditCard[];
  onCardsChange?: (cards: CreditCard[]) => void;
}

const COLOR_PRESETS = [
  { label: "Roxo Nexo", hex: "#692296" },
  { label: "Vermelho 2TP", hex: "#DC2626" },
  { label: "Azul Visa", hex: "#2572CE" },
  { label: "Preto Black", hex: "#18181B" },
  { label: "Dourado Gold", hex: "#EA920F" },
  { label: "Verde Emerald", hex: "#0CB853" },
];

export function CreditCardManager({
  cards,
  onCardsChange,
}: CreditCardManagerProps) {
  const [hideCardValues, setHideCardValues] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [lastDigits, setLastDigits] = React.useState("");
  const [brand, setBrand] = React.useState<"Mastercard" | "Visa" | "Elo" | "Nubank" | "Amex" | "Outro">("Mastercard");
  const [creditLimit, setCreditLimit] = React.useState("");
  const [closingDay, setClosingDay] = React.useState("5");
  const [dueDay, setDueDay] = React.useState("12");
  const [color, setColor] = React.useState("#692296");

  const handleOpenModal = () => {
    setName("");
    setLastDigits("");
    setCreditLimit("");
    setClosingDay("5");
    setDueDay("12");
    setColor("#692296");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const limitNum = parseFloat(creditLimit.replace(/\./g, "").replace(",", "."));
    const closingNum = parseInt(closingDay, 10);
    const dueNum = parseInt(dueDay, 10);

    if (!name.trim()) {
      setFormError("Informe o nome do cartão.");
      return;
    }
    if (!/^\d{4}$/.test(lastDigits.trim())) {
      setFormError("Informe exatamente os 4 últimos dígitos.");
      return;
    }
    if (isNaN(limitNum) || limitNum <= 0) {
      setFormError("Informe um limite de crédito válido maior que zero.");
      return;
    }
    if (isNaN(closingNum) || closingNum < 1 || closingNum > 31) {
      setFormError("Dia de fechamento deve ser entre 1 e 31.");
      return;
    }
    if (isNaN(dueNum) || dueNum < 1 || dueNum > 31) {
      setFormError("Dia de vencimento deve ser entre 1 e 31.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createCreditCardAction({
        name: name.trim(),
        lastDigits: lastDigits.trim(),
        brand,
        creditLimit: limitNum,
        closingDay: closingNum,
        dueDay: dueNum,
        color,
      });

      if (res.success && res.data) {
        onCardsChange?.([...cards, res.data]);
        setIsModalOpen(false);
      } else {
        setFormError(res.error || "Não foi possível cadastrar o cartão.");
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = async (cardId?: string) => {
    if (!cardId) return;
    const confirmDelete = window.confirm("Deseja realmente remover este cartão?");
    if (!confirmDelete) return;

    try {
      await deleteCreditCardAction(cardId);
      onCardsChange?.(cards.filter((c) => c.id !== cardId));
    } catch {
      // Ignora erro
    }
  };

  return (
    <div className="space-y-4">
      {/* Topo do Módulo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DEC5EF]/60 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
            <CreditCardIcon className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#18181B] dark:text-white">
              Meus Cartões de Crédito
            </h2>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Acompanhe limites, datas e faturas em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHideCardValues(!hideCardValues)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[#3F3F46] transition hover:bg-black/5 dark:text-[#D4D4D8] dark:hover:bg-white/10 cursor-pointer"
            aria-label={hideCardValues ? "Mostrar valores" : "Ocultar valores"}
          >
            {hideCardValues ? (
              <Eye className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <EyeOff className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>

          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={handleOpenModal}
          >
            Novo Cartão
          </Button>
        </div>
      </div>

      {/* Lista de Cartões ou Empty State */}
      {cards.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#D4D4D8] bg-white/60 p-8 text-center dark:border-white/15 dark:bg-white/5 space-y-3">
          <CreditCardIcon className="mx-auto h-8 w-8 text-[#71717A] dark:text-[#D4D4D8]" />
          <div>
            <p className="text-sm font-semibold text-[#18181B] dark:text-white">
              Nenhum cartão cadastrado ainda
            </p>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
              Cadastre seu primeiro cartão para acompanhar faturas e limites em tempo real.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={handleOpenModal}
          >
            Cadastrar Primeiro Cartão
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cards.map((card) => {
            const availableLimit = Math.max(0, card.creditLimit - card.currentInvoice);
            const usagePercent = Math.min(
              100,
              Math.round((card.currentInvoice / card.creditLimit) * 100)
            );

            return (
              <div
                key={card.id || card.lastDigits}
                className="relative overflow-hidden rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] flex flex-col justify-between min-h-[190px]"
              >
                {/* Linha decorativa no topo */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundColor: card.color || "#692296" }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-extrabold tracking-tight text-[#18181B] dark:text-white">
                        {card.name}
                      </p>
                      <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                        •••• {card.lastDigits} • {card.brand}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className="rounded-lg px-2 py-0.5 text-[10px] font-extrabold text-white"
                        style={{ backgroundColor: card.color || "#692296" }}
                      >
                        {card.brand}
                      </span>
                      {card.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(card.id)}
                          className="rounded-lg p-1 text-[#71717A] hover:bg-black/5 hover:text-[#DF2929] dark:hover:bg-white/10"
                          title="Excluir cartão"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA]">
                        Fatura Atual
                      </p>
                      <p className="text-xl font-extrabold tracking-tight text-[#DF2929] dark:text-[#EC6862] tabular-nums">
                        {hideCardValues
                          ? "R$ ••••••"
                          : formatCurrencyBRL(card.currentInvoice)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA]">
                        Limite Disponível
                      </p>
                      <p className="text-sm font-bold text-[#0CB853] dark:text-[#46C87D] tabular-nums">
                        {hideCardValues
                          ? "R$ ••••••"
                          : formatCurrencyBRL(availableLimit)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 pt-3 border-t border-[#E4E4E7]/70 dark:border-white/10">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#71717A] dark:text-[#A1A1AA] flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Fecha dia {card.closingDay} • Vence dia {card.dueDay}
                    </span>
                    <span className="font-extrabold text-[#18181B] dark:text-white tabular-nums">
                      {usagePercent}% usado
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E4E7] dark:bg-[#27272A]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        usagePercent > 80
                          ? "bg-[#DF2929]"
                          : usagePercent > 50
                          ? "bg-[#EA920F]"
                          : "bg-[#0CB853]"
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          MODAL DE CADASTRO DE NOVO CARTÃO DE CRÉDITO
          ==================================================================== */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#E4E4E7] bg-white/95 p-6 text-[#18181B] shadow-2xl backdrop-blur-2xl dark:border-[#27272A] dark:bg-[#18181B]/95 dark:text-[#F4F4F5] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7] dark:border-[#27272A]">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DEC5EF]/60 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
                  <CreditCardIcon className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                  Novo Cartão de Crédito
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-[#71717A] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="mt-4 space-y-3.5">
              {formError && (
                <div className="rounded-xl border border-[#DF2929]/30 bg-[#DF2929]/10 p-2.5 text-xs font-semibold text-[#DF2929]">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                  Nome do Cartão
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Nubank Ultravioleta, C6 Carbon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                    Últimos 4 Dígitos
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Ex: 4821"
                    value={lastDigits}
                    onChange={(e) => setLastDigits(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                    Bandeira
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value as typeof brand)}
                    className="w-full h-10 rounded-xl border border-[#E4E4E7] bg-white px-3 text-xs font-semibold text-[#18181B] outline-none focus:ring-2 focus:ring-[#692296] dark:border-[#27272A] dark:bg-[#18181B] dark:text-white"
                  >
                    <option value="Mastercard">Mastercard</option>
                    <option value="Visa">Visa</option>
                    <option value="Elo">Elo</option>
                    <option value="Nubank">Nubank</option>
                    <option value="Amex">American Express</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                  Limite Total (R$)
                </label>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="100"
                  min="0"
                  placeholder="Ex: 5000"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                    Dia Fechamento
                  </label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="31"
                    value={closingDay}
                    onChange={(e) => setClosingDay(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                    Dia Vencimento
                  </label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="31"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1.5">
                  Cor do Cartão
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      onClick={() => setColor(p.hex)}
                      className={`h-6 w-6 rounded-full border-2 transition-transform ${
                        color === p.hex ? "scale-115 border-white shadow-md ring-2 ring-[#692296]" : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: p.hex }}
                      title={p.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E4E7] dark:border-[#27272A]">
                <Button
                  type="button"
                  size="sm"
                  variant="neutral"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  icon={CheckCircle2}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar Cartão"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
