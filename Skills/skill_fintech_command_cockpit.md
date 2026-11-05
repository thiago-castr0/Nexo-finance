# Skill UIE-008: Fintech Command Cockpit (Nova Roupagem v5.0 — Porta 3001)

## 1. Objetivo
Definir uma proposta de interface completamente nova e moderna para o **Nexo Finance** em `http://localhost:3001` e `http://localhost:3001/design-system`, preservando a versão original em `http://localhost:3000` para comparação e validação lado a lado.

## 2. Pilares de Design e Usabilidade
- **Zero Poluição Visual:** Cada tela mostra apenas o que o usuário precisa para tomar decisões financeiras rápidas no celular ou no computador.
- **App-Shell Moderno (Sidebar + Workspace Contextual):**
  - Navegação lateral fixa no desktop e barra inferior ergonômica no mobile (`>= 44x44px`).
  - Vistas dedicadas e integradas: `Visão Geral`, `Extrato & Fluxo`, `Scanner IA` e `Metas do Mês`.
- **Wallet Card + Envelopes de Categoria:**
  - Destaque visual elegante para o Saldo Disponível, com indicadores claros de Entradas (`#0CB853`), Saídas (`#DF2929`) e Economia do Mês.
- **Botões Single-Line Obrigatórios:**
  - Todo botão deve conter `Lucide Icon + Texto` em linha única (`inline-flex flex-row flex-nowrap items-center gap-2 whitespace-nowrap`).
- **Clean Code & Mesma Base de Domínio:**
  - Reutiliza integralmente os schemas Zod (`src/lib/schemas/transaction.ts`), cálculos com precisão de centavos (`src/lib/finance.ts`) e Server Actions (`src/app/actions/`).
