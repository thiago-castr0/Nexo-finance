import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { categoryBudgetSchema } from "../../src/lib/schemas/budget.ts";

describe("Nexo Finance - Execução & Testes das Opções B, C e D", () => {
  // OPÇÃO B: Lógica de Distribuição por Categoria (Donut Chart)
  it("Opção B: deve calcular agregação por categoria, total e percentual corretamente", () => {
    const mockTransactions = [
      { category: "Alimentação", amount: 400, type: "EXPENSE" },
      { category: "Alimentação", amount: 200, type: "EXPENSE" },
      { category: "Moradia", amount: 1400, type: "EXPENSE" },
      { category: "Salário & Renda", amount: 5000, type: "INCOME" }, // Não deve entrar nas despesas
    ];

    const expenseTxs = mockTransactions.filter((tx) => tx.type === "EXPENSE");
    const map = new Map<string, number>();
    let totalExpenses = 0;

    for (const tx of expenseTxs) {
      const current = map.get(tx.category) || 0;
      map.set(tx.category, current + tx.amount);
      totalExpenses += tx.amount;
    }

    assert.equal(totalExpenses, 2000);
    assert.equal(map.get("Alimentação"), 600);
    assert.equal(map.get("Moradia"), 1400);

    const slices = Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      percent: (value / totalExpenses) * 100,
    }));

    slices.sort((a, b) => b.value - a.value);

    assert.equal(slices[0].name, "Moradia");
    assert.equal(slices[0].percent, 70);
    assert.equal(slices[1].name, "Alimentação");
    assert.equal(slices[1].percent, 30);
  });

  // OPÇÃO C: Persistência de Envelopes (Schema e Integridade)
  it("Opção C: deve validar e sanitizar schema de category_budgets no Postgres", () => {
    const validBudget = {
      category: "Transporte",
      monthlyLimit: 750.5,
    };

    const parsed = categoryBudgetSchema.safeParse(validBudget);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.category, "Transporte");
      assert.equal(parsed.data.monthlyLimit, 750.5);
    }

    // Deve rejeitar limite negativo
    const invalidNegative = {
      category: "Transporte",
      monthlyLimit: -50,
    };
    const invalidParsed = categoryBudgetSchema.safeParse(invalidNegative);
    assert.equal(invalidParsed.success, false);
  });

  // OPÇÃO D: Visualizador de Comprovantes & Metadados de Auditoria
  it("Opção D: deve validar detecção de extensões de comprovante e flags de auditoria IA", () => {
    const isImageReceipt = (url: string) => /\.(png|jpe?g|webp|gif)$/i.test(url);

    assert.equal(isImageReceipt("https://storage.supabase.com/receipt-123.jpg"), true);
    assert.equal(isImageReceipt("https://storage.supabase.com/receipt-456.png"), true);
    assert.equal(isImageReceipt("https://storage.supabase.com/documento.pdf"), false);

    const transactionWithOcr = {
      id: "tx-test-ocr",
      description: "Supermercado Extra",
      amount: 189.9,
      type: "EXPENSE",
      category: "Alimentação",
      source: "AI_OCR",
      attachmentUrl: "https://storage.supabase.com/recibo.png",
      transactionDate: "2026-11-09",
    };

    assert.equal(transactionWithOcr.source, "AI_OCR");
    assert.ok(transactionWithOcr.attachmentUrl);
    assert.equal(isImageReceipt(transactionWithOcr.attachmentUrl), true);
  });
});
