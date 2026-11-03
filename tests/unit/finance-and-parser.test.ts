import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateFinancialSummary,
  formatCurrencyBRL,
  fromCents,
  toCents,
} from "../../src/lib/finance.ts";
import {
  maskSensitiveMetadata,
  normalizeCategory,
  parseLLMResponse,
  validateFileMagicBytes,
} from "../../src/lib/ai/ocr-parser.ts";

describe("Nexo Finance - Unit Tests (@AgenteQA Skill QAE-002)", () => {
  it("deve calcular 0.1 + 0.2 sem erro de ponto flutuante IEEE 754", () => {
    const summary = calculateFinancialSummary([
      { amount: 0.1, type: "EXPENSE" },
      { amount: 0.2, type: "EXPENSE" },
      { amount: 1.0, type: "INCOME" },
    ]);

    assert.equal(summary.totalExpense, 0.3);
    assert.equal(summary.totalIncome, 1.0);
    assert.equal(summary.totalBalance, 0.7);
    assert.equal(toCents(0.1) + toCents(0.2), 30);
    assert.equal(fromCents(30), 0.3);
  });

  it("deve formatar valores em Real Brasileiro (BRL)", () => {
    const formatted = formatCurrencyBRL(1234.56);
    assert.ok(formatted.includes("1.234,56"));
  });

  it("deve limpar marcações Markdown (```json) do retorno da IA e validar com Zod", () => {
    const markdownWrappedJson = `\`\`\`json
    {
      "items": [
        {
          "description": "Restaurante Sabor",
          "amount": 59.9,
          "type": "EXPENSE",
          "category": "Restaurante",
          "transactionDate": "2026-11-03"
        }
      ]
    }
    \`\`\``;

    const result = parseLLMResponse(markdownWrappedJson);
    assert.equal(result.success, true);
    assert.equal(result.items.length, 1);
    assert.equal(result.items[0].category, "Alimentação");
    assert.equal(result.items[0].amount, 59.9);
  });

  it("deve tratar graciosamente um JSON corrompido (alucinação da IA) sem quebrar", () => {
    const corruptedOutput = "Desculpe, não consegui ler o arquivo { json_invalido: ";
    const result = parseLLMResponse(corruptedOutput);

    assert.equal(result.success, false);
    assert.equal(result.items.length, 0);
    assert.ok(result.error);
  });

  it("deve validar Magic Bytes de PDF autêntico e rejeitar executável (.exe) disfarçado", () => {
    // %PDF-1.7
    const validPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]);
    const pdfCheck = validateFileMagicBytes(validPdfBytes, "application/pdf");
    assert.equal(pdfCheck.valid, true);
    assert.equal(pdfCheck.detectedType, "application/pdf");

    // MZ header (.exe do Windows renomeado para fatura.pdf)
    const fakePdfExeBytes = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]);
    const exeCheck = validateFileMagicBytes(fakePdfExeBytes, "application/pdf");
    assert.equal(exeCheck.valid, false);
    assert.ok(exeCheck.error?.includes("Assinatura de arquivo inválida"));
  });

  it("deve mascarar CPF e números de cartão em metadados antes de enviar para a IA (SEC-002)", () => {
    const rawText = "Comprovante CPF 123.456.789-00 Cartao 4532 1111 2222 3333.pdf";
    const masked = maskSensitiveMetadata(rawText);

    assert.ok(!masked.includes("123.456.789-00"));
    assert.ok(masked.includes("[CPF_PROTEGIDO]"));
    assert.ok(masked.includes("[CARTAO_PROTEGIDO]"));
    assert.equal(normalizeCategory("Uber Trip"), "Transporte");
  });
});
