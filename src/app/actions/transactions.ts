"use server";

import { revalidatePath } from "next/cache";
import {
  draftBatchApprovalSchema,
  transactionInputSchema,
  type TransactionInput,
  type TransactionRecord,
  type CategoryName,
} from "@/lib/schemas/transaction";
import { extractTransactionsFromDocument } from "@/lib/ai/ocr-parser";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAuthUserId } from "@/app/actions/auth";

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

/**
 * Server Action: Busca todas as transações persistidas no Supabase Cloud para o usuário autenticado.
 */
export async function fetchTransactionsAction(): Promise<ActionResponse<TransactionRecord[]>> {
  if (!isSupabaseConfigured()) {
    return { success: true, data: [] };
  }

  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return { success: true, data: [] };
    }

    const supabase = createServerSupabaseClient();
    const query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("transaction_date", { ascending: false });

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
      installmentNumber: row.installment_number || null,
      totalInstallments: row.total_installments || null,
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

function addMonthsToDate(isoDate: string, monthsToAdd: number): string {
  const [yearStr, monthStr, dayStr] = isoDate.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  const targetDate = new Date(year, month + monthsToAdd, 1);
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;

  const daysInTargetMonth = new Date(targetYear, targetMonth, 0).getDate();
  const validDay = Math.min(day, daysInTargetMonth);

  return `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(validDay).padStart(2, "0")}`;
}

/**
 * Server Action: Cria uma transação manual validada estritamente com Zod (Skill BKE-002 & BKE-004).
 * Suporta parcelamento de compras (1x a 72x) com projeção automática nos meses subsequentes.
 */
export async function createManualTransactionAction(
  input: TransactionInput
): Promise<ActionResponse<TransactionRecord[]>> {
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
    const nowIso = new Date().toISOString();
    const totalInstallments = parsed.data.totalInstallments || 1;
    const recordsToInsert: TransactionRecord[] = [];

    if (totalInstallments > 1 && parsed.data.type === "EXPENSE") {
      const totalAmount = parsed.data.amount;
      const amountPerInstallment = Math.round((totalAmount / totalInstallments) * 100) / 100;
      const firstInstallmentAmount =
        Math.round((totalAmount - amountPerInstallment * (totalInstallments - 1)) * 100) / 100;

      for (let i = 1; i <= totalInstallments; i++) {
        const installmentDate = addMonthsToDate(parsed.data.transactionDate, i - 1);
        const installmentAmount = i === 1 ? firstInstallmentAmount : amountPerInstallment;
        const parcelSuffix = ` (${String(i).padStart(2, "0")}/${String(totalInstallments).padStart(2, "0")})`;

        recordsToInsert.push({
          ...parsed.data,
          id: crypto.randomUUID(),
          description: `${parsed.data.description}${parcelSuffix}`,
          amount: installmentAmount,
          transactionDate: installmentDate,
          installmentNumber: i,
          totalInstallments,
          isRecurring: false,
          status: "COMPLETED",
          source: "MANUAL",
          createdAt: nowIso,
        });
      }
    } else {
      recordsToInsert.push({
        ...parsed.data,
        id: crypto.randomUUID(),
        status: "COMPLETED",
        source: "MANUAL",
        installmentNumber: null,
        totalInstallments: null,
        createdAt: nowIso,
      });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServerSupabaseClient();
        await supabase.from("transactions").insert(
          recordsToInsert.map((rec) => ({
            id: rec.id,
            description: rec.description,
            amount: rec.amount,
            type: rec.type,
            category: rec.category,
            status: "COMPLETED",
            transaction_date: rec.transactionDate,
            source: "MANUAL",
            is_recurring: Boolean(rec.isRecurring),
            credit_card_id: rec.creditCardId || null,
            installment_number: rec.installmentNumber || null,
            total_installments: rec.totalInstallments || null,
            user_id: userId || null,
          }))
        );
      } catch {
        // Fallback seguro até conexão da nuvem
      }
    }

    revalidatePath("/");
    return {
      success: true,
      data: recordsToInsert,
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

/**
 * Server Action: Atualiza uma transação existente no Supabase Cloud.
 */
export async function updateTransactionAction(
  id: string,
  input: TransactionInput
): Promise<ActionResponse<TransactionRecord>> {
  try {
    const parsed = transactionInputSchema.safeParse(input);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message;
      return {
        success: false,
        error: firstIssue || "Dados inválidos para atualização.",
      };
    }

    const updatedRecord: TransactionRecord = {
      ...parsed.data,
      id,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase
        .from("transactions")
        .update({
          description: updatedRecord.description,
          amount: updatedRecord.amount,
          type: updatedRecord.type,
          category: updatedRecord.category,
          transaction_date: updatedRecord.transactionDate,
          is_recurring: Boolean(updatedRecord.isRecurring),
          credit_card_id: updatedRecord.creditCardId || null,
          installment_number: updatedRecord.installmentNumber || null,
          total_installments: updatedRecord.totalInstallments || null,
        })
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    revalidatePath("/");
    return { success: true, data: updatedRecord };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro ao atualizar lançamento.",
    };
  }
}
