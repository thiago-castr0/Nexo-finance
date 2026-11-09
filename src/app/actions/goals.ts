"use server";

import { revalidatePath } from "next/cache";
import { savingsGoalSchema, type SavingsGoal } from "@/lib/schemas/savings-goal";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAuthUserId } from "@/app/actions/auth";

export interface GoalActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchSavingsGoalsAction(): Promise<GoalActionResult<SavingsGoal[]>> {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return { success: true, data: [] };
    }

    const supabase = createServerSupabaseClient();
    const query = supabase
      .from("savings_goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    const { data, error } = await query;
    if (error) {
      return { success: false, error: error.message };
    }

    const mapped: SavingsGoal[] = (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      targetAmount: Number(row.target_amount),
      currentAmount: Number(row.current_amount),
      targetDate: row.target_date,
      category: row.category,
      color: row.color,
      createdAt: row.created_at,
    }));

    return { success: true, data: mapped };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro ao carregar metas de economia.",
    };
  }
}

export async function createSavingsGoalAction(
  goalData: Omit<SavingsGoal, "id" | "createdAt">
): Promise<GoalActionResult<SavingsGoal>> {
  try {
    const parsed = savingsGoalSchema.safeParse(goalData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Dados inválidos da meta.",
      };
    }

    const userId = await getAuthUserId();
    const supabase = createServerSupabaseClient();

    const insertPayload = {
      name: parsed.data.name,
      target_amount: parsed.data.targetAmount,
      current_amount: parsed.data.currentAmount || 0,
      target_date: parsed.data.targetDate || null,
      category: parsed.data.category,
      color: parsed.data.color,
      user_id: userId || null,
    };

    const { data, error } = await supabase
      .from("savings_goals")
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Erro ao salvar meta." };
    }

    const newGoal: SavingsGoal = {
      id: data.id,
      name: data.name,
      targetAmount: Number(data.target_amount),
      currentAmount: Number(data.current_amount),
      targetDate: data.target_date,
      category: data.category,
      color: data.color,
      createdAt: data.created_at,
    };

    revalidatePath("/");
    return { success: true, data: newGoal };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Falha ao cadastrar meta.",
    };
  }
}

export async function depositToGoalAction(
  goalId: string,
  amount: number
): Promise<GoalActionResult<SavingsGoal>> {
  try {
    if (isNaN(amount) || amount === 0) {
      return { success: false, error: "Informe um valor válido para aporte ou resgate." };
    }

    const supabase = createServerSupabaseClient();
    const { data: goal, error: fetchErr } = await supabase
      .from("savings_goals")
      .select("*")
      .eq("id", goalId)
      .single();

    if (fetchErr || !goal) {
      return { success: false, error: "Meta não encontrada." };
    }

    const newAmount = Math.max(0, Number(goal.current_amount) + amount);

    const { data: updated, error: updateErr } = await supabase
      .from("savings_goals")
      .update({ current_amount: newAmount })
      .eq("id", goalId)
      .select()
      .single();

    if (updateErr || !updated) {
      return { success: false, error: updateErr?.message || "Erro ao atualizar saldo da meta." };
    }

    revalidatePath("/");
    return {
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        targetAmount: Number(updated.target_amount),
        currentAmount: Number(updated.current_amount),
        targetDate: updated.target_date,
        category: updated.category,
        color: updated.color,
        createdAt: updated.created_at,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro no aporte da meta.",
    };
  }
}

export async function deleteSavingsGoalAction(id: string): Promise<GoalActionResult<void>> {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("savings_goals").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro ao excluir meta.",
    };
  }
}
