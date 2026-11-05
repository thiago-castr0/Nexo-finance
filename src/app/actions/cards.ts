"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { creditCardSchema, type CreditCard } from "@/lib/schemas/credit-card";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface CardActionResult<T = unknown> {
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

export async function fetchCreditCardsAction(): Promise<CardActionResult<CreditCard[]>> {
  try {
    const userId = await getAuthUserId();
    const supabase = createServerSupabaseClient();

    let query = supabase.from("credit_cards").select("*").order("created_at", { ascending: true });
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: cards, error } = await query;
    if (error) {
      return { success: false, error: error.message };
    }

    const mappedCards: CreditCard[] = (cards || []).map((row) => ({
      id: row.id,
      name: row.name,
      lastDigits: row.last_digits,
      brand: row.brand,
      color: row.color,
      creditLimit: Number(row.credit_limit),
      closingDay: row.closing_day,
      dueDay: row.due_day,
      currentInvoice: 0,
    }));

    return { success: true, data: mappedCards };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro ao carregar cartões.",
    };
  }
}

export async function createCreditCardAction(
  cardData: Omit<CreditCard, "id" | "currentInvoice">
): Promise<CardActionResult<CreditCard>> {
  try {
    const parsed = creditCardSchema.safeParse(cardData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Dados inválidos do cartão.",
      };
    }

    const userId = await getAuthUserId();
    const supabase = createServerSupabaseClient();

    const insertPayload = {
      name: parsed.data.name,
      last_digits: parsed.data.lastDigits,
      brand: parsed.data.brand,
      color: parsed.data.color,
      credit_limit: parsed.data.creditLimit,
      closing_day: parsed.data.closingDay,
      due_day: parsed.data.dueDay,
      user_id: userId || null,
    };

    const { data, error } = await supabase
      .from("credit_cards")
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Erro ao salvar cartão." };
    }

    const newCard: CreditCard = {
      id: data.id,
      name: data.name,
      lastDigits: data.last_digits,
      brand: data.brand,
      color: data.color,
      creditLimit: Number(data.credit_limit),
      closingDay: data.closing_day,
      dueDay: data.due_day,
      currentInvoice: 0,
    };

    revalidatePath("/");
    return { success: true, data: newCard };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Falha ao cadastrar cartão.",
    };
  }
}

export async function deleteCreditCardAction(id: string): Promise<CardActionResult<void>> {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("credit_cards").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro ao excluir cartão.",
    };
  }
}
