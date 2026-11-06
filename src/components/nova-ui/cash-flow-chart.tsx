"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatCurrencyBRL } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

export interface CashFlowChartProps {
  transactions: TransactionRecord[];
  allTransactions?: TransactionRecord[];
  selectedDate: Date;
}

type ViewMode = "DAILY" | "SEMESTER";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#E4E4E7] bg-white/95 p-3.5 shadow-xl backdrop-blur-xl dark:border-[#27272A] dark:bg-[#18181B]/95 text-xs">
      <p className="font-extrabold text-[#18181B] dark:text-white mb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry) => {
          const isIncome = entry.dataKey === "entradas";
          const isExpense = entry.dataKey === "saidas";
          const labelText = isIncome ? "Entradas" : isExpense ? "Saídas" : "Saldo Líquido";

          return (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#71717A] dark:text-[#A1A1AA] font-medium">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {labelText}
              </span>
              <span className="font-extrabold text-[#18181B] dark:text-white tabular-nums">
                {formatCurrencyBRL(entry.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MONTH_SHORT_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export function CashFlowChart({
  transactions,
  allTransactions = [],
  selectedDate,
}: CashFlowChartProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("DAILY");
  const [chartType, setChartType] = React.useState<"AREA" | "BAR">("AREA");

  // 1. Dados Diários do Mês Atual Selecionado
  const dailyChartData = React.useMemo(() => {
    const targetYear = selectedDate.getFullYear();
    const targetMonth = selectedDate.getMonth() + 1;
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();

    const daysMap = new Map<number, { entradas: number; saidas: number }>();
    for (let d = 1; d <= daysInMonth; d++) {
      daysMap.set(d, { entradas: 0, saidas: 0 });
    }

    transactions.forEach((tx) => {
      const parts = tx.transactionDate.split("-");
      const d = parseInt(parts[2], 10);
      if (!isNaN(d) && daysMap.has(d)) {
        const current = daysMap.get(d)!;
        if (tx.type === "INCOME") {
          current.entradas += tx.amount;
        } else {
          current.saidas += tx.amount;
        }
      }
    });

    let runningBalance = 0;
    const result: Array<{
      label: string;
      entradas: number;
      saidas: number;
      saldo: number;
    }> = [];

    // Agrupa de 3 em 3 dias para ficar visualmente limpo e legível
    const step = daysInMonth > 28 ? 3 : 2;
    for (let d = 1; d <= daysInMonth; d += step) {
      let bucketEntradas = 0;
      let bucketSaidas = 0;

      for (let inner = d; inner < Math.min(d + step, daysInMonth + 1); inner++) {
        const item = daysMap.get(inner);
        if (item) {
          bucketEntradas += item.entradas;
          bucketSaidas += item.saidas;
        }
      }

      runningBalance += bucketEntradas - bucketSaidas;

      result.push({
        label: `Dia ${String(d).padStart(2, "0")}`,
        entradas: Math.round(bucketEntradas * 100) / 100,
        saidas: Math.round(bucketSaidas * 100) / 100,
        saldo: Math.round(runningBalance * 100) / 100,
      });
    }

    return result;
  }, [transactions, selectedDate]);

  // 2. Dados Semestrais (Últimos 3 meses + Mês Atual + Próximos 2 meses projetados)
  const semesterChartData = React.useMemo(() => {
    const listToUse = allTransactions.length > 0 ? allTransactions : transactions;
    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth(); // 0 a 11

    const months: Array<{
      key: string;
      label: string;
      entradas: number;
      saidas: number;
      saldo: number;
    }> = [];

    // -3 a +2 meses
    for (let offset = -3; offset <= 2; offset++) {
      const d = new Date(currentYear, currentMonth + offset, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const key = `${y}-${String(m).padStart(2, "0")}`;
      const label = `${MONTH_SHORT_NAMES[d.getMonth()]}/${String(y).slice(2)}`;

      // Soma transações deste mês
      let entradas = 0;
      let saidas = 0;

      listToUse.forEach((tx) => {
        if (tx.transactionDate.startsWith(key)) {
          if (tx.type === "INCOME") entradas += tx.amount;
          else saidas += tx.amount;
        }
      });

      // Se for mês futuro e estiver zerado, projeta recorrentes
      if (offset > 0 && entradas === 0 && saidas === 0) {
        listToUse.filter((tx) => tx.isRecurring).forEach((rec) => {
          if (rec.type === "INCOME") entradas += rec.amount;
          else saidas += rec.amount;
        });
      }

      months.push({
        key,
        label,
        entradas: Math.round(entradas * 100) / 100,
        saidas: Math.round(saidas * 100) / 100,
        saldo: Math.round((entradas - saidas) * 100) / 100,
      });
    }

    return months;
  }, [allTransactions, transactions, selectedDate]);

  const activeData = viewMode === "DAILY" ? dailyChartData : semesterChartData;

  const totalIncome = activeData.reduce((acc, curr) => acc + curr.entradas, 0);
  const totalExpense = activeData.reduce((acc, curr) => acc + curr.saidas, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 sm:p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] space-y-5">
      {/* Topo do Gráfico com Título e Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DEC5EF]/60 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
            <TrendingUp className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
              Fluxo de Caixa & Evolução
            </h3>
            <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
              Comparativo visual de entradas, despesas e saldo líquido
            </p>
          </div>
        </div>

        {/* Controles de Visualização */}
        <div className="flex items-center gap-2">
          {/* Seletor Diário vs Semestral */}
          <div className="flex items-center rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-0.5 dark:border-[#27272A] dark:bg-[#27272A]">
            <button
              type="button"
              onClick={() => setViewMode("DAILY")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === "DAILY"
                  ? "bg-white text-[#18181B] shadow-xs dark:bg-[#18181B] dark:text-white"
                  : "text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white"
              }`}
            >
              Mês Ativo
            </button>
            <button
              type="button"
              onClick={() => setViewMode("SEMESTER")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === "SEMESTER"
                  ? "bg-white text-[#18181B] shadow-xs dark:bg-[#18181B] dark:text-white"
                  : "text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white"
              }`}
            >
              Semestral
            </button>
          </div>

          {/* Tipo de Gráfico: Área vs Barras */}
          <div className="flex items-center rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-0.5 dark:border-[#27272A] dark:bg-[#27272A]">
            <button
              type="button"
              onClick={() => setChartType("AREA")}
              className={`rounded-lg p-1 text-xs font-bold transition ${
                chartType === "AREA"
                  ? "bg-white text-[#692296] shadow-xs dark:bg-[#18181B] dark:text-[#DEC5EF]"
                  : "text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white"
              }`}
              title="Gráfico em Área"
            >
              <Activity className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setChartType("BAR")}
              className={`rounded-lg p-1 text-xs font-bold transition ${
                chartType === "BAR"
                  ? "bg-white text-[#692296] shadow-xs dark:bg-[#18181B] dark:text-[#DEC5EF]"
                  : "text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white"
              }`}
              title="Gráfico em Barras"
            >
              <BarChart3 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Métricas Rápidas do Período */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center justify-between p-3 rounded-2xl border border-[#E4E4E7] bg-white/60 dark:border-[#27272A] dark:bg-[#18181B]/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
              Entradas do Gráfico
            </span>
            <p className="text-base font-extrabold text-[#0CB853] tabular-nums">
              +{formatCurrencyBRL(totalIncome)}
            </p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0CB853]/10 text-[#0CB853]">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl border border-[#E4E4E7] bg-white/60 dark:border-[#27272A] dark:bg-[#18181B]/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
              Saídas do Gráfico
            </span>
            <p className="text-base font-extrabold text-[#DF2929] tabular-nums">
              -{formatCurrencyBRL(totalExpense)}
            </p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DF2929]/10 text-[#DF2929]">
            <ArrowDownRight className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl border border-[#E4E4E7] bg-white/60 dark:border-[#27272A] dark:bg-[#18181B]/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
              Resultado Líquido
            </span>
            <p className={`text-base font-extrabold tabular-nums ${netBalance >= 0 ? "text-[#692296] dark:text-[#DEC5EF]" : "text-[#DF2929]"}`}>
              {netBalance >= 0 ? "+" : ""}{formatCurrencyBRL(netBalance)}
            </p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DEC5EF]/40 text-[#692296] dark:bg-[#692296]/30 dark:text-[#DEC5EF]">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Área do Gráfico Recharts */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "AREA" ? (
            <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="nexoIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0CB853" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0CB853" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="nexoExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                stroke="#A1A1AA"
                fontSize={11}
                fontWeight={600}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#A1A1AA"
                fontSize={10}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="entradas"
                stroke="#0CB853"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#nexoIncomeGrad)"
              />
              <Area
                type="monotone"
                dataKey="saidas"
                stroke="#DF2929"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#nexoExpenseGrad)"
              />
            </AreaChart>
          ) : (
            <BarChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                stroke="#A1A1AA"
                fontSize={11}
                fontWeight={600}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#A1A1AA"
                fontSize={10}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="entradas" fill="#0CB853" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="saidas" fill="#DF2929" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
