"use client";

import * as React from "react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Printer,
  ShieldCheck,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrencyBRL } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

export interface FinancialInsightsScoreProps {
  transactions: TransactionRecord[];
  totalIncome: number;
  totalExpenses: number;
  creditCardTotal?: number;
}

export function FinancialInsightsScore({
  transactions,
  totalIncome,
  totalExpenses,
  creditCardTotal = 0,
}: FinancialInsightsScoreProps) {
  // 1. Cálculo da Taxa de Poupança (0 a 40 pts)
  const savingsAmount = Math.max(0, totalIncome - totalExpenses);
  const savingsRate = totalIncome > 0 ? (savingsAmount / totalIncome) * 100 : 0;
  const savingsScore = Math.min(40, Math.round((savingsRate / 25) * 40));

  // 2. Cálculo do Comprometimento de Cartão de Crédito (0 a 30 pts)
  // Menor que 30% da renda = 30 pts, entre 30% e 50% = 15 pts, > 50% = 5 pts
  const cardCommitment = totalIncome > 0 ? (creditCardTotal / totalIncome) * 100 : 0;
  const cardScore =
    cardCommitment <= 30 ? 30 : cardCommitment <= 50 ? 15 : 5;

  // 3. Disciplina de Gastos e Regularidade (0 a 30 pts)
  const expenseRatio = totalIncome > 0 ? totalExpenses / totalIncome : 1;
  const disciplineScore =
    expenseRatio <= 0.7 ? 30 : expenseRatio <= 0.9 ? 20 : 10;

  const totalScore = Math.min(100, Math.max(10, savingsScore + cardScore + disciplineScore));

  const scoreTier = React.useMemo(() => {
    if (totalScore >= 80) {
      return {
        label: "Excelente",
        color: "text-[#0CB853]",
        bg: "bg-[#0CB853]/10 dark:bg-[#0CB853]/20",
        border: "border-[#0CB853]/30",
        icon: ShieldCheck,
      };
    }
    if (totalScore >= 60) {
      return {
        label: "Saudável",
        color: "text-[#692296] dark:text-[#DEC5EF]",
        bg: "bg-[#692296]/10 dark:bg-[#692296]/25",
        border: "border-[#692296]/30",
        icon: TrendingUp,
      };
    }
    if (totalScore >= 40) {
      return {
        label: "Atenção",
        color: "text-[#EA920F]",
        bg: "bg-[#EA920F]/10 dark:bg-[#EA920F]/20",
        border: "border-[#EA920F]/30",
        icon: AlertTriangle,
      };
    }
    return {
      label: "Crítico",
      color: "text-[#DF2929]",
      bg: "bg-[#DF2929]/10 dark:bg-[#DF2929]/20",
      border: "border-[#DF2929]/30",
      icon: Flame,
    };
  }, [totalScore]);

  // Categoria com maior gasto
  const topExpenseCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
      });
    let maxCat = "";
    let maxVal = 0;
    for (const [cat, val] of map.entries()) {
      if (val > maxVal) {
        maxVal = val;
        maxCat = cat;
      }
    }
    return { category: maxCat, amount: maxVal };
  }, [transactions]);

  const handlePrintReport = () => {
    window.print();
  };

  const TierIcon = scoreTier.icon;

  return (
    <div className="rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 sm:p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] space-y-5">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DEC5EF]/60 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
            <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
              Saúde Financeira & Inteligência 2TP
            </h3>
            <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
              Diagnóstico preditivo em tempo real dos seus lançamentos
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="neutral"
          icon={Printer}
          onClick={handlePrintReport}
          title="Imprimir relatório mensal consolidado"
        >
          Relatório Executivo
        </Button>
      </div>

      {/* Grid com Score + Métricas Chave */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Score Radial Visual */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5]/50 dark:border-[#27272A] dark:bg-[#27272A]/30">
          <div className="relative flex items-center justify-center">
            {/* Círculo do Score */}
            <div className="h-28 w-28 rounded-full border-4 border-dashed border-[#692296]/30 flex flex-col items-center justify-center animate-pulse">
              <span className="text-3xl font-black tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                {totalScore}
              </span>
              <span className="text-[10px] font-bold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
                de 100 pts
              </span>
            </div>
          </div>

          <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${scoreTier.bg} ${scoreTier.color} ${scoreTier.border}`}>
            <TierIcon className="h-3.5 w-3.5" />
            <span>{scoreTier.label}</span>
          </div>
        </div>

        {/* 3 Diagnósticos em Cards Frosted */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Taxa de Poupança */}
          <div className="p-3.5 rounded-2xl border border-[#E4E4E7] bg-white/60 dark:border-[#27272A] dark:bg-[#18181B]/60 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
              Taxa de Poupança
            </span>
            <div className="text-lg font-black text-[#0CB853]">
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-[10px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
              {savingsAmount > 0
                ? `${formatCurrencyBRL(savingsAmount)} guardados`
                : "Sem margem líquida"}
            </p>
          </div>

          {/* Card 2: Comprometimento Cartão */}
          <div className="p-3.5 rounded-2xl border border-[#E4E4E7] bg-white/60 dark:border-[#27272A] dark:bg-[#18181B]/60 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
              Faturas de Cartão
            </span>
            <div
              className={`text-lg font-black ${
                cardCommitment > 40 ? "text-[#EA920F]" : "text-[#692296] dark:text-[#DEC5EF]"
              }`}
            >
              {cardCommitment.toFixed(0)}%
            </div>
            <p className="text-[10px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
              da sua renda mensal
            </p>
          </div>

          {/* Card 3: Maior Ponto Focal */}
          <div className="p-3.5 rounded-2xl border border-[#E4E4E7] bg-white/60 dark:border-[#27272A] dark:bg-[#18181B]/60 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
              Maior Categoria
            </span>
            <div className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF] truncate">
              {topExpenseCategory.category || "N/A"}
            </div>
            <p className="text-[10px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
              {topExpenseCategory.amount > 0 ? formatCurrencyBRL(topExpenseCategory.amount) : "R$ 0,00"}
            </p>
          </div>
        </div>
      </div>

      {/* Insights da IA em Bullet Points Executivos */}
      <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5]/60 p-4 dark:border-[#27272A] dark:bg-[#27272A]/40 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#692296] dark:text-[#DEC5EF]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Recomendações da Inteligência Nexo</span>
        </div>
        <ul className="space-y-1 text-xs text-[#3F3F46] dark:text-[#D4D4D8]">
          <li className="flex items-start gap-1.5">
            <ArrowRight className="h-3 w-3 mt-0.5 text-[#DC2626] shrink-0" />
            <span>
              {savingsRate >= 20
                ? "Parabéns! Sua taxa de poupança está acima da meta recomendada de 20% para reserva de emergência."
                : "Sua taxa de poupança está abaixo de 20%. Recomendamos revisar assinaturas e gastos de lazer."}
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <ArrowRight className="h-3 w-3 mt-0.5 text-[#692296] shrink-0" />
            <span>
              {cardCommitment <= 30
                ? "Faturas de cartão estão saudáveis e dentro do limite seguro da sua renda."
                : "Atenção: Suas faturas de cartão superam 30% da sua renda mensal. Priorize liquidar o valor total."}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
