import { z } from "zod";

export const GOAL_CATEGORIES = [
  "Reserva de Emergência",
  "Viagem & Férias",
  "Casa Própria",
  "Veículo",
  "Educação & Cursos",
  "Aposentadoria",
  "Tecnologia",
  "Outros",
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const savingsGoalSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Nome da meta deve ter pelo menos 2 caracteres").max(60, "Máximo de 60 caracteres"),
  targetAmount: z.number().positive("O valor alvo deve ser maior que zero"),
  currentAmount: z.number().nonnegative("O valor atual não pode ser negativo").default(0),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use AAAA-MM-DD)").optional().nullable(),
  category: z.string().default("Reserva de Emergência"),
  color: z.string().default("#692296"),
  createdAt: z.string().optional(),
});

export type SavingsGoal = z.infer<typeof savingsGoalSchema>;
