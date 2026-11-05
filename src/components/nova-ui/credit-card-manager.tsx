"use client";

import * as React from "react";
import {
  CreditCard as CreditCardIcon,
  Plus,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrencyBRL } from "@/lib/finance";
import type { CreditCard } from "@/lib/schemas/credit-card";

export interface CreditCardManagerProps {
  cards: CreditCard[];
  onAddCardClick?: () => void;
}

export function CreditCardManager({
  cards,
  onAddCardClick,
}: CreditCardManagerProps) {
  const [hideCardValues, setHideCardValues] = React.useState(false);

  return (
    <div className="space-y-4">
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
              Acompanhe limites e faturas em tempo real
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

          {onAddCardClick && (
            <Button
              size="sm"
              variant="primary"
              icon={Plus}
              onClick={onAddCardClick}
            >
              Adicionar Cartão
            </Button>
          )}
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#D4D4D8] bg-white/60 p-8 text-center dark:border-white/15 dark:bg-white/5">
          <CreditCardIcon className="mx-auto h-8 w-8 text-[#71717A] dark:text-[#D4D4D8] mb-2" />
          <p className="text-xs font-semibold text-[#18181B] dark:text-white">
            Nenhum cartão cadastrado ainda
          </p>
          <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
            Cadastre seu primeiro cartão para prever suas faturas.
          </p>
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
                  className="pointer-events-none absolute inset-x-0 top-0 h-1"
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

                    <span
                      className="rounded-lg px-2 py-0.5 text-[10px] font-extrabold text-white"
                      style={{ backgroundColor: card.color || "#692296" }}
                    >
                      {card.brand}
                    </span>
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
    </div>
  );
}
