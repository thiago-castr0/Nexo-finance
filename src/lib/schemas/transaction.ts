import { z } from "zod";

export const CATEGORIES = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Assinaturas & Software",
  "Salário & Renda",
  "Investimentos",
  "Outros",
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export const transactionTypeSchema = z.enum(["INCOME", "EXPENSE"]);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const transactionStatusSchema = z.enum(["DRAFT", "COMPLETED"]);
export type TransactionStatus = z.infer<typeof transactionStatusSchema>;

export const transactionSourceSchema = z.enum(["MANUAL", "AI_OCR"]);
export type TransactionSource = z.infer<typeof transactionSourceSchema>;

export const transactionInputSchema = z.object({
  id: z.string().optional(),
  description: z
    .string()
    .trim()
    .min(2, "A descrição deve ter pelo menos 2 caracteres.")
    .max(120, "A descrição deve ter no máximo 120 caracteres."),
  amount: z
    .number({ invalid_type_error: "Informe um valor numérico válido." })
    .positive("O valor deve ser maior que zero.")
    .max(999999999.99, "Valor acima do limite permitido."),
  type: transactionTypeSchema,
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Selecione uma categoria válida." }),
  }),
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use o formato AAAA-MM-DD)."),
  attachmentUrl: z.string().url().optional().nullable(),
  source: transactionSourceSchema.default("MANUAL"),
});

export type TransactionInput = z.infer<typeof transactionInputSchema>;

export interface TransactionRecord extends TransactionInput {
  id: string;
  status: TransactionStatus;
  createdAt: string;
}

export const draftBatchApprovalSchema = z.object({
  items: z
    .array(transactionInputSchema)
    .min(1, "O rascunho precisa conter ao menos 1 lançamento para aprovação."),
});

export const llmExtractedItemSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  type: transactionTypeSchema,
  category: z.string().min(1),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  confidence: z.number().min(0).max(1).optional(),
});

export const llmExtractionResponseSchema = z.object({
  items: z.array(llmExtractedItemSchema),
  documentSummary: z.string().optional(),
});
