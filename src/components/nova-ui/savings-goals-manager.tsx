"use client";

import * as React from "react";
import {
  Target,
  Plus,
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrencyBRL } from "@/lib/finance";
import {
  GOAL_CATEGORIES,
  type SavingsGoal,
  type GoalCategory,
} from "@/lib/schemas/savings-goal";
import {
  createSavingsGoalAction,
  deleteSavingsGoalAction,
  depositToGoalAction,
} from "@/app/actions/goals";

export interface SavingsGoalsManagerProps {
  goals: SavingsGoal[];
  onGoalsChange?: (goals: SavingsGoal[]) => void;
  monthlySavingsCapacity?: number;
}

const COLOR_PRESETS = [
  { label: "Roxo Nexo", hex: "#692296" },
  { label: "Verde Conquista", hex: "#0CB853" },
  { label: "Azul Sonho", hex: "#2572CE" },
  { label: "Vermelho 2TP", hex: "#DC2626" },
  { label: "Dourado Ouro", hex: "#EA920F" },
  { label: "Rosa Vibrante", hex: "#D946EF" },
];

export function SavingsGoalsManager({
  goals,
  onGoalsChange,
  monthlySavingsCapacity = 0,
}: SavingsGoalsManagerProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = React.useState(false);
  const [activeGoal, setActiveGoal] = React.useState<SavingsGoal | null>(null);
  const [depositAmountStr, setDepositAmountStr] = React.useState("");
  const [depositType, setDepositType] = React.useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");

  // Form State para Nova Meta
  const [name, setName] = React.useState("");
  const [targetAmountStr, setTargetAmountStr] = React.useState("");
  const [initialAmountStr, setInitialAmountStr] = React.useState("");
  const [category, setCategory] = React.useState<GoalCategory>("Reserva de Emergência");
  const [targetDate, setTargetDate] = React.useState("");
  const [color, setColor] = React.useState("#692296");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Cálculos Consolidados
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const overallPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const handleOpenCreateModal = () => {
    setName("");
    setTargetAmountStr("");
    setInitialAmountStr("");
    setCategory("Reserva de Emergência");
    setTargetDate("");
    setColor("#692296");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const targetNum = parseFloat(targetAmountStr.replace(/\./g, "").replace(",", "."));
    const initialNum = initialAmountStr ? parseFloat(initialAmountStr.replace(/\./g, "").replace(",", ".")) : 0;

    if (!name.trim()) {
      setFormError("Informe o nome da meta.");
      return;
    }
    if (isNaN(targetNum) || targetNum <= 0) {
      setFormError("Informe um valor alvo válido maior que zero.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createSavingsGoalAction({
        name: name.trim(),
        targetAmount: targetNum,
        currentAmount: initialNum > 0 ? initialNum : 0,
        targetDate: targetDate || null,
        category,
        color,
      });

      if (res.success && res.data) {
        onGoalsChange?.([...goals, res.data]);
        setIsModalOpen(false);
      } else {
        setFormError(res.error || "Não foi possível cadastrar a meta.");
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id?: string) => {
    if (!id) return;
    const confirmDelete = window.confirm("Deseja realmente excluir esta meta?");
    if (!confirmDelete) return;

    try {
      await deleteSavingsGoalAction(id);
      onGoalsChange?.(goals.filter((g) => g.id !== id));
    } catch {
      // Ignora erro
    }
  };

  const handleOpenDepositModal = (goal: SavingsGoal, type: "DEPOSIT" | "WITHDRAW") => {
    setActiveGoal(goal);
    setDepositType(type);
    setDepositAmountStr("");
    setIsDepositModalOpen(true);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoal?.id) return;

    const val = parseFloat(depositAmountStr.replace(/\./g, "").replace(",", "."));
    if (isNaN(val) || val <= 0) return;

    const delta = depositType === "DEPOSIT" ? val : -val;

    try {
      const res = await depositToGoalAction(activeGoal.id, delta);
      if (res.success && res.data) {
        onGoalsChange?.(goals.map((g) => (g.id === activeGoal.id ? res.data! : g)));
        setIsDepositModalOpen(false);
      }
    } catch {
      // Ignora erro
    }
  };

  return (
    <div className="space-y-5">
      {/* Topo do Módulo com Título e Ação */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DEC5EF]/60 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
            <Target className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#18181B] dark:text-white">
              Metas & Objetivos Financeiros
            </h2>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Construa suas reservas, caixinhas e conquistas de médio/longo prazo
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="primary"
          icon={Plus}
          onClick={handleOpenCreateModal}
        >
          Nova Meta
        </Button>
      </div>

      {/* 3 Cartões de Indicadores Gerais de Conquista */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl border border-[#E4E4E7] bg-white/88 dark:border-[#27272A] dark:bg-[#18181B]/90 shadow-sm backdrop-blur-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
            Total Já Guardado
          </span>
          <p className="text-xl font-extrabold text-[#0CB853] tabular-nums mt-0.5">
            {formatCurrencyBRL(totalSaved)}
          </p>
          <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA] mt-1">
            Alocado em {goals.length} {goals.length === 1 ? "objetivo" : "objetivos"}
          </p>
        </div>

        <div className="p-4 rounded-3xl border border-[#E4E4E7] bg-white/88 dark:border-[#27272A] dark:bg-[#18181B]/90 shadow-sm backdrop-blur-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
            Meta Global Alvo
          </span>
          <p className="text-xl font-extrabold text-[#18181B] dark:text-white tabular-nums mt-0.5">
            {formatCurrencyBRL(totalTarget)}
          </p>
          <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA] mt-1">
            Faltam {formatCurrencyBRL(Math.max(0, totalTarget - totalSaved))} para a meta total
          </p>
        </div>

        <div className="p-4 rounded-3xl border border-[#E4E4E7] bg-white/88 dark:border-[#27272A] dark:bg-[#18181B]/90 shadow-sm backdrop-blur-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
            Progresso Geral
          </span>
          <p className="text-xl font-extrabold text-[#692296] dark:text-[#DEC5EF] tabular-nums mt-0.5">
            {overallPercent}%
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E4E4E7] dark:bg-[#27272A]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#692296] to-[#0CB853] transition-all duration-300"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid de Metas ou Estado Vazio */}
      {goals.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#D4D4D8] bg-white/60 p-8 text-center dark:border-white/15 dark:bg-white/5 space-y-3">
          <Target className="mx-auto h-8 w-8 text-[#71717A] dark:text-[#D4D4D8]" />
          <div>
            <p className="text-sm font-semibold text-[#18181B] dark:text-white">
              Nenhuma meta cadastrada ainda
            </p>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
              Crie objetivos de economia (Reserva, Viagem, Sonhos) e acompanhe seu progresso mês a mês.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={handleOpenCreateModal}
          >
            Criar Minha Primeira Meta
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percent = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            // Estimativa de meses restantes baseada na capacidade mensal de poupança
            const monthsLeft = monthlySavingsCapacity > 0 && remaining > 0 ? Math.ceil(remaining / monthlySavingsCapacity) : null;

            return (
              <div
                key={goal.id || goal.name}
                className="relative overflow-hidden rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 sm:p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] flex flex-col justify-between space-y-4"
              >
                {/* Linha decorativa no topo */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundColor: goal.color || "#692296" }}
                />

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold tracking-tight text-[#18181B] dark:text-white">
                          {goal.name}
                        </h4>
                        {percent >= 100 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#0CB853]/10 px-1.5 py-0.5 text-[10px] font-extrabold text-[#0CB853]">
                            <ShieldCheck className="h-3 w-3" />
                            Atingida!
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
                        {goal.category}
                        {goal.targetDate && ` • Alvo para ${goal.targetDate.split("-").reverse().join("/")}`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="rounded-lg p-1 text-[#71717A] hover:bg-black/5 hover:text-[#DF2929] dark:hover:bg-white/10"
                      title="Excluir meta"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Valores Atuais vs Alvo */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                        Acumulado
                      </span>
                      <p className="text-xl font-extrabold text-[#0CB853] tabular-nums">
                        {formatCurrencyBRL(goal.currentAmount)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                        Alvo
                      </span>
                      <p className="text-sm font-bold text-[#18181B] dark:text-white tabular-nums">
                        {formatCurrencyBRL(goal.targetAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="space-y-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#E4E4E7] dark:bg-[#27272A]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: goal.color || "#692296",
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                      <span>{remaining > 0 ? `Faltam ${formatCurrencyBRL(remaining)}` : "Meta alcançada!"}</span>
                      <span className="font-extrabold tabular-nums">{percent}%</span>
                    </div>
                  </div>

                  {/* Previsão de alcance com taxa de poupança */}
                  {monthsLeft && remaining > 0 && (
                    <div className="flex items-center gap-1.5 rounded-xl bg-[#DEC5EF]/20 p-2 text-[11px] font-medium text-[#692296] dark:bg-[#692296]/20 dark:text-[#DEC5EF]">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        No ritmo atual de poupança, você atinge este objetivo em aproximadamente <strong>{monthsLeft} {monthsLeft === 1 ? "mês" : "meses"}</strong>.
                      </span>
                    </div>
                  )}
                </div>

                {/* Botões de Aporte e Resgate */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E4E7]/70 dark:border-white/10">
                  <Button
                    type="button"
                    size="sm"
                    variant="neutral"
                    icon={MinusCircle}
                    onClick={() => handleOpenDepositModal(goal, "WITHDRAW")}
                  >
                    Resgatar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    icon={PlusCircle}
                    onClick={() => handleOpenDepositModal(goal, "DEPOSIT")}
                  >
                    Aportar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          MODAL DE CRIAÇÃO DE NOVA META
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
                  <Target className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                  Novo Objetivo de Poupança
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

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3.5">
              {formError && (
                <div className="rounded-xl border border-[#DF2929]/30 bg-[#DF2929]/10 p-2.5 text-xs font-semibold text-[#DF2929]">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                  Nome da Meta
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Reserva de Emergência, Viagem Europa 2027"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                    className="w-full h-10 rounded-xl border border-[#E4E4E7] bg-white px-3 text-xs font-semibold text-[#18181B] outline-none focus:ring-2 focus:ring-[#692296] dark:border-[#27272A] dark:bg-[#18181B] dark:text-white"
                  >
                    {GOAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                    Data Alvo (Opcional)
                  </label>
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                    Valor Alvo (R$)
                  </label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="50"
                    min="1"
                    placeholder="Ex: 15000"
                    value={targetAmountStr}
                    onChange={(e) => setTargetAmountStr(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                    Já Guardado (R$)
                  </label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="50"
                    min="0"
                    placeholder="0"
                    value={initialAmountStr}
                    onChange={(e) => setInitialAmountStr(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1.5">
                  Cor da Meta
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
                  {isSubmitting ? "Salvando..." : "Criar Meta"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL RÁPIDO DE APORTE OU RESGATE
          ==================================================================== */}
      {isDepositModalOpen && activeGoal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-3xl border border-[#E4E4E7] bg-white/95 p-6 text-[#18181B] shadow-2xl backdrop-blur-2xl dark:border-[#27272A] dark:bg-[#18181B]/95 dark:text-[#F4F4F5] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7] dark:border-[#27272A]">
              <h4 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                {depositType === "DEPOSIT" ? "Aportar na Meta" : "Resgatar da Meta"}
              </h4>
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(false)}
                className="rounded-lg p-1 text-[#71717A] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Meta: <strong>{activeGoal.name}</strong> (Saldo Atual: {formatCurrencyBRL(activeGoal.currentAmount)})
            </p>

            <form onSubmit={handleDepositSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#18181B] dark:text-white mb-1">
                  Valor (R$)
                </label>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="10"
                  min="1"
                  placeholder="Ex: 250"
                  value={depositAmountStr}
                  onChange={(e) => setDepositAmountStr(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4E4E7] dark:border-[#27272A]">
                <Button
                  type="button"
                  size="sm"
                  variant="neutral"
                  onClick={() => setIsDepositModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  icon={depositType === "DEPOSIT" ? PlusCircle : MinusCircle}
                >
                  {depositType === "DEPOSIT" ? "Confirmar Aporte" : "Confirmar Resgate"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
