import { z } from "zod";

export const categoryBudgetSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.string().min(1, "A categoria é obrigatória"),
  monthlyLimit: z.number().nonnegative("O limite não pode ser negativo"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CategoryBudget = z.infer<typeof categoryBudgetSchema>;
