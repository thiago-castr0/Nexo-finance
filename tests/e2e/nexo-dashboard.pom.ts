/**
 * @AgenteQA - Especificação E2E (Playwright Page Object Model - Skill QAE-001)
 * Cobre os fluxos críticos:
 * 1. Dashboard -> Upload de PDF no Smart Input -> Abertura da Tela de Rascunho ("Comprovante Lido com Sucesso") -> Aprovação -> Atualização do Saldo
 * 2. Lançamento Manual otimizado para teclado -> Atualização da Tabela e Gráficos
 * 3. Bloqueio de arquivo com Magic Bytes inválidos -> Exibição de fallback manual
 */

export class NexoDashboardPageObject {
  readonly selectors = {
    totalBalance: '[data-testid="total-balance"]',
    totalIncome: '[data-testid="total-income"]',
    totalExpense: '[data-testid="total-expense"]',
    fileInput: '[data-testid="smart-input-file"]',
    draftPanel: '[data-testid="draft-review-panel"]',
    draftSuccessHeading: 'text="Comprovante Lido com Sucesso"',
    approveDraftBtn: '[data-testid="approve-draft-btn"]',
    openManualBtn: '[data-testid="open-manual-modal-btn"]',
    manualDescriptionInput: '[data-testid="manual-description-input"]',
    manualAmountInput: '[data-testid="manual-amount-input"]',
    manualSubmitBtn: '[data-testid="manual-submit-btn"]',
    feedbackBanner: '[data-testid="feedback-banner"]',
  } as const;
}
