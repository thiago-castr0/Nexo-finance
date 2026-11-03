# 📊 Product Requirements Document (PRD) - Nexo Finance

**Projeto:** Nexo Finance (Nome Provisório)
**Fase:** Beta (MVP) - Foco em Pessoa Física

## 1. Visão Geral do Produto
Aplicação web de controle financeiro pessoal, com automação de entrada de dados via IA (leitura de extratos PDF e prints). 

## 2. Identidade Visual e Design System
O projeto possui uma identidade visual estrita gerenciada pelo `@AgenteDesignSystem` e implementada pelo `@AgenteUI`:
*   **Design Clean:** Minimalista, com muito respiro (white space), bordas finas (1px) e formas arredondadas.
*   **Cores Base:** Vermelho (Primária) e Roxo (Secundária). Cores financeiras seguem o padrão (Verde para entrada, Vermelho para saída).
*   **Tipografia:** Inter (Google Fonts) com numerais tabulares para valores.
*   **Componentes:** Botões estilo "Outline" (vazados) acompanhados de ícones da biblioteca **Lucide Icons**.

## 3. Arquitetura e Stack Tecnológico
*   **Framework:** Next.js (App Router), React, TypeScript.
*   **Estilização:** Tailwind CSS, Shadcn UI.
*   **Backend/Dados:** PostgreSQL (Prisma/Drizzle), Server Actions.
*   **Motor de IA:** Google Gemini / GPT via API.

## 4. Funcionalidades Core (Escopo Beta)
*   **Smart Input (IA):** Upload de mídia, OCR contextual e Tela de Rascunho para revisão de dados lidos pela IA.
*   **Gestão Manual:** Formulários otimizados para teclado, criação e edição de lançamentos.
*   **Dashboard:** Saldo, receitas, despesas e gráficos (Recharts).

## 5. Referências de Engenharia Reversa
*   *Lógica IA:* Moniq, AI Expense Tracker (n8n), Finzytrack.
*   *Frontend:* Shadcn Fintech Dashboard (adaptação visual para o nosso Design System).