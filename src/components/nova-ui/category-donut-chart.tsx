"use client";

import * as React from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart as PieChartIcon, TrendingDown } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

export interface CategoryDonutChartProps {
  transactions: TransactionRecord[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Moradia: "#692296", // Roxo Nexo
  Alimentação: "#DC2626", // Vermelho 2TP
  Transporte: "#2572CE", // Azul
  "Assinaturas & Software": "#EA920F", // Âmbar
  "Saúde & Farmácia": "#0CB853", // Verde
  Saúde: "#0CB853",
  Lazer: "#D946EF", // Fúcsia
  "Lazer & Outros": "#D946EF",
  Educação: "#8B5CF6", // Roxo Claro
  Investimentos: "#06B6D4", // Ciano
  Outros: "#71717A", // Neutro
};

const FALLBACK_PALETTE = [
  "#692296",
  "#DC2626",
  "#2572CE",
  "#0CB853",
  "#EA920F",
  "#D946EF",
  "#8B5CF6",
  "#06B6D4",
  "#F43F5E",
  "#14B8A6",
];

interface DonutSlice {
  name: string;
  value: number;
  percent: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: DonutSlice;
  }>;
}

function CustomDonutTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-2xl border border-[#E4E4E7] bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-[#27272A] dark:bg-[#18181B]/95 text-xs">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
          {data.name}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 text-[11px] tabular-nums">
        <span className="text-[#71717A] dark:text-[#A1A1AA]">Total:</span>
        <span className="font-bold text-[#18181B] dark:text-white">
          {formatCurrencyBRL(data.value)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 text-[11px] tabular-nums mt-0.5">
        <span className="text-[#71717A] dark:text-[#A1A1AA]">Participação:</span>
        <span className="font-extrabold text-[#DC2626] dark:text-[#EC6862]">
          {data.percent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

export function CategoryDonutChart({ transactions }: CategoryDonutChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const { slices, totalExpenses } = React.useMemo(() => {
    const expenseTxs = transactions.filter((tx) => tx.type === "EXPENSE");
    const map = new Map<string, number>();

    let total = 0;
    for (const tx of expenseTxs) {
      const current = map.get(tx.category) || 0;
      map.set(tx.category, current + tx.amount);
      total += tx.amount;
    }

    const items: DonutSlice[] = [];
    let idx = 0;

    map.forEach((value, name) => {
      const color =
        CATEGORY_COLORS[name] ||
        FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];
      const percent = total > 0 ? (value / total) * 100 : 0;
      items.push({
        name,
        value,
        percent,
        color,
      });
      idx++;
    });

    items.sort((a, b) => b.value - a.value);

    return { slices: items, totalExpenses: total };
  }, [transactions]);

  if (slices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E4E4E7] bg-white/88 p-8 text-center text-[#18181B] backdrop-blur-2xl dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5]">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DEC5EF]/40 text-[#692296] dark:bg-[#692296]/20 dark:text-[#DEC5EF] mb-2">
          <PieChartIcon className="h-5 w-5" />
        </div>
        <p className="text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
          Nenhuma despesa registrada neste mês
        </p>
        <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] mt-1">
          Adicione um novo gasto ou importe comprovantes para visualizar a distribuição.
        </p>
      </div>
    );
  }

  const activeSlice = activeIndex !== null ? slices[activeIndex] : null;

  return (
    <div className="flex flex-col rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 sm:p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5]">
      {/* Topo do Card */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#692296] to-[#DC2626] text-white shadow-xs">
            <PieChartIcon className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
              Distribuição por Categoria
            </h3>
            <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
              Divisão percentual de despesas no mês
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-[#FACBC2]/40 px-2.5 py-1 text-xs font-bold text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#FACBC2]">
          <TrendingDown className="h-3.5 w-3.5" />
          <span>{slices.length} categorias</span>
        </div>
      </div>

      {/* Conteúdo: Donut Chart à esquerda + Legenda detalhada à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Gráfico Donut Centralizado com Número no Centro */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[240px]">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Tooltip content={<CustomDonutTooltip />} />
              <Pie
                data={slices}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={92}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                animationDuration={600}
                cornerRadius={4}
              >
                {slices.map((slice, index) => (
                  <Cell
                    key={`cell-${slice.name}`}
                    fill={slice.color}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.45
                    }
                    className="transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Valor Central no Donut */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {activeSlice ? (
              <>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] truncate max-w-[110px]">
                  {activeSlice.name}
                </span>
                <span className="text-base font-extrabold text-[#18181B] dark:text-white tabular-nums">
                  {formatCurrencyBRL(activeSlice.value)}
                </span>
                <span className="text-[11px] font-extrabold text-[#DC2626] dark:text-[#EC6862]">
                  {activeSlice.percent.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                  Despesas
                </span>
                <span className="text-base font-extrabold text-[#18181B] dark:text-white tabular-nums">
                  {formatCurrencyBRL(totalExpenses)}
                </span>
                <span className="text-[10px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
                  Total do Mês
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legenda com Ranking de Participação */}
        <div className="lg:col-span-6 space-y-2 max-h-[240px] overflow-y-auto pr-1">
          {slices.map((slice, index) => {
            const isHovered = activeIndex === index;

            return (
              <button
                key={slice.name}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-xs transition-all cursor-pointer ${
                  isHovered
                    ? "bg-[#F4F4F5] dark:bg-[#27272A] scale-[1.01]"
                    : "hover:bg-[#F4F4F5]/60 dark:hover:bg-[#27272A]/40"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="font-bold text-[#18181B] dark:text-[#FFFFFF] truncate">
                    {slice.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 tabular-nums shrink-0">
                  <span className="font-bold text-[#18181B] dark:text-white">
                    {formatCurrencyBRL(slice.value)}
                  </span>
                  <span className="inline-block min-w-[42px] text-right text-[11px] font-extrabold text-[#71717A] dark:text-[#A1A1AA]">
                    {slice.percent.toFixed(1)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
