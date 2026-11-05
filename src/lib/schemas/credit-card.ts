import { z } from "zod";

export const creditCardSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Nome do cartão deve ter pelo menos 2 caracteres"),
  lastDigits: z
    .string()
    .length(4, "Informe os 4 últimos dígitos do cartão")
    .regex(/^\d{4}$/, "Apenas números"),
  brand: z.enum(["Mastercard", "Visa", "Elo", "Nubank", "Amex", "Outro"]).default("Mastercard"),
  color: z.string().default("#692296"),
  creditLimit: z.number().positive("O limite deve ser maior que zero"),
  closingDay: z.number().int().min(1).max(31, "Dia de fechamento inválido"),
  dueDay: z.number().int().min(1).max(31, "Dia de vencimento inválido"),
  currentInvoice: z.number().nonnegative().default(0),
});

export type CreditCard = z.infer<typeof creditCardSchema>;
