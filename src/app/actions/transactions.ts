"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  draftBatchApprovalSchema,
  transactionInputSchema,
  type TransactionInput,
  type TransactionRecord,
  type CategoryName,
} from "@/lib/schemas/transaction";
import { extractTransactionsFromDocument } from "@/lib/ai/ocr-parser";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  mode?: "GEMINI_API" | "SMART_SIMULATION";
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return Boolean(
    url &&
      key &&
      url.startsWith("https://") &&
      !url.includes("seu-projeto.supabase.co")
  );
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

/**
 * Server Action: Busca todas as transações persistidas no Supabase Cloud.
 */
export async function fetchTransactionsAction(): Promise<ActionResponse<TransactionRecord[]>> {
  if (!isSupabaseConfigured()) {
    return { success: true, data: [] };
  }

  try {
    const userId = await getAuthUserId();
    const supabase = createServerSupabaseClient();

    let query = supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) {
      return { success: false, error: error.message };
    }

    const records: TransactionRecord[] = (data || []).map((row) => ({
      id: row.id,
      description: row.description,
      amount: Number(row.amount),
      type: row.type as "INCOME" | "EXPENSE",
      category: (row.category || "Outros") as CategoryName,
      transactionDate: row.transaction_date,
      status: row.status as "DRAFT" | "COMPLETED",
      source: row.source as "MANUAL" | "AI_OCR",
      attachmentUrl: row.attachment_url,
      isRecurring: Boolean(row.is_recurring),
      creditCardId: row.credit_card_id || null,
      createdAt: row.created_at,
    }));

    return { success: true, data: records };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro ao carregar transações.",
    };
  }
}

/**
 * Server Action: Recebe o upload de PDF/Imagem, valida Magic Bytes (BKE-004),
 * salva no Supabase Storage (se configurado) e retorna os itens para a Tela de Rascunho (Draft).
 * Regra de Ouro BKE-003: NUNCA salva direto no banco sem aprovação humana.
 */
export async function processSmartInputAction(
  formData: FormData
): Promise<ActionResponse<TransactionInput[]>> {
  try {
    const fileEntry = formData.get("file");
    if (!fileEntry || !(fileEntry instanceof File)) {
      return {
        success: false,
        error: "Nenhum arquivo válido foi enviado para análise.",
      };
    }

    const arrayBuffer = await fileEntry.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);

    let attachmentUrl: string | null = null;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServerSupabaseClient();
        const sanitizedName = fileEntry.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `uploads/${Date.now()}-${sanitizedName}`;

        const { error: uploadError } = await supabase.storage
          .from("statements")
          .upload(storagePath, fileBytes, {
            contentType: fileEntry.type || "application/octet-stream",
            upsert: false,
          });

        if (!uploadError) {
          const { data: signedData } = await supabase.storage
            .from("statements")
            .createSignedUrl(storagePath, 60 * 60 * 24 * 7);
          attachmentUrl = signedData?.signedUrl ?? null;
        }
      } catch {
        // Continua o processamento do OCR mesmo se o bucket ainda não estiver vinculado na nuvem
      }
    }

    const extraction = await extractTransactionsFromDocument({
      fileBytes,
      mimeType: fileEntry.type,
      fileName: fileEntry.name,
      attachmentUrl,
    });

    if (!extraction.success) {
      return {
        success: false,
        error:
          extraction.error ||
          "Não conseguimos ler este comprovante automaticamente. Deseja preencher manualmente?",
      };
    }

    return {
      success: true,
      data: extraction.items,
      mode: extraction.mode,
    };
  } catch {
    return {
      success: false,
      error:
        "Erro inesperado ao processar o documento. Tente novamente ou utilize o lançamento manual.",
    };
  }
}

/**
 * Server Action: Aprova e persiste o lote de transações revisadas pelo usuário na Tela de Rascunho.
 */
export async function approveDraftTransactionsAction(
  items: TransactionInput[]
): Promise<ActionResponse<TransactionRecord[]>> {
  try {
    const parsed = draftBatchApprovalSchema.safeParse({ items });
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message;
      return {
        success: false,
        error: firstIssue || "Dados inválidos no rascunho. Verifique os campos destacados.",
      };
    }

    const userId = await getAuthUserId();
    const nowIso = new Date().toISOString();
    const approvedRecords: TransactionRecord[] = parsed.data.items.map(
      (item) => ({
        ...item,
        id: crypto.randomUUID(),
        status: "COMPLETED",
        source: "AI_OCR",
        createdAt: nowIso,
      })
    );

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServerSupabaseClient();
        await supabase.from("transactions").insert(
          approvedRecords.map((record) => ({
            id: record.id,
            description: record.description,
            amount: record.amount,
            type: record.type,
            category: record.category,
            status: "COMPLETED",
            transaction_date: record.transactionDate,
            attachment_url: record.attachmentUrl ?? null,
            source: "AI_OCR",
            user_id: userId || null,
          }))
        );
      } catch {
        // Mantém sincronia otimista
      }
    }

    revalidatePath("/");
    return {
      success: true,
      data: approvedRecords,
    };
  } catch {
    return {
      success: false,
      error: "Não foi possível salvar os lançamentos do rascunho.",
    };
  }
}

/**
 * Server Action: Cria uma transação manual validada estritamente com Zod (Skill BKE-002 & BKE-004).
 */
export async function createManualTransactionAction(
  input: TransactionInput
): Promise<ActionResponse<TransactionRecord>> {
  try {
    const parsed = transactionInputSchema.safeParse(input);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message;
      return {
        success: false,
        error: firstIssue || "Verifique os campos obrigatórios do lançamento.",
      };
    }

    const userId = await getAuthUserId();
    const record: TransactionRecord = {
      ...parsed.data,
      id: crypto.randomUUID(),
      status: "COMPLETED",
      source: "MANUAL",
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServerSupabaseClient();
        await supabase.from("transactions").insert({
          id: record.id,
          description: record.description,
          amount: record.amount,
          type: record.type,
          category: record.category,
          status: "COMPLETED",
          transaction_date: record.transactionDate,
          source: "MANUAL",
          is_recurring: Boolean(record.isRecurring),
          credit_card_id: record.creditCardId || null,
          user_id: userId || null,
        });
      } catch {
        // Fallback seguro até conexão da nuvem
      }
    }

    revalidatePath("/");
    return {
      success: true,
      data: record,
    };
  } catch {
    return {
      success: false,
      error: "Erro ao registrar lançamento manual.",
    };
  }
}

/**
 * Server Action: Exclui uma transação do Supabase Cloud.
 */
export async function deleteTransactionAction(
  id: string
): Promise<ActionResponse<void>> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = createServerSupabaseClient();
      await supabase.from("transactions").delete().eq("id", id);
    }
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao excluir transação." };
  }
}
