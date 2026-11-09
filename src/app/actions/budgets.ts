"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface BudgetActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

async function getAuthUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("nexo_session")?.value;
    if (!token) return null;
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

export async function fetchCategoryBudgetsAction(): Promise<
  BudgetActionResult<Record<string, number>>
> {
  try {
    const userId = await getAuthUserId();
    const supabase = createServerSupabaseClient();

    let query = supabase.from("category_budgets").select("category, monthly_limit");
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) {
      return { success: false, error: error.message };
    }

    const result: Record<string, number> = {};
    if (data && data.length > 0) {
      for (const row of data) {
        result[row.category] = Number(row.monthly_limit);
      }
    }

    return { success: true, data: result };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Erro ao carregar orçamentos de categorias.",
    };
  }
}

export async function saveCategoryBudgetsAction(
  budgets: Record<string, number>
): Promise<BudgetActionResult<Record<string, number>>> {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      // Se não autenticado (modo demo), retorna sucesso sem quebrar
      return { success: true, data: budgets };
    }

    const supabase = createServerSupabaseClient();

    const rows = Object.entries(budgets).map(([category, monthlyLimit]) => ({
      user_id: userId,
      category,
      monthly_limit: Math.max(0, monthlyLimit),
      updated_at: new Date().toISOString(),
    }));

    if (rows.length === 0) {
      return { success: true, data: budgets };
    }

    const { error } = await supabase.from("category_budgets").upsert(rows, {
      onConflict: "user_id, category",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true, data: budgets };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Erro ao salvar orçamentos de categorias.",
    };
  }
}
