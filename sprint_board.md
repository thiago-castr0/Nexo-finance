# 🏃‍♂️ Mega Sprint: Nexo Finance MVP

## 📌 Épico 1: Setup, Discovery e Design (Foundation) — ✅ CONCLUÍDO

### 🃏 Card 1.1: Setup do Repositório — ✅ DONE
* **Responsáveis:** `@AgenteBackend`, `@AgenteFrontend`, `@AgenteSecurity`
* **Descrição:** Configurar Next.js, Tailwind, ESLint e variáveis de ambiente.

### 🃏 Card 1.2: Mapeamento de Fluxos (User Flows) — ✅ DONE
* **Responsáveis:** `@AgentePO`, `@AgenteUX`, `@AgenteQA`
* **Descrição:** Desenhar o fluxo exato de uso (Dashboard -> Upload -> Rascunho -> Aprovação) em `docs/user_flows_and_edge_cases.md`.

### 🃏 Card 1.3: Setup do Design System e UI Base — ✅ DONE
* **Responsáveis:** `@AgenteDesignSystem`, `@AgenteUI`
* **Descrição:** Configurar o `tailwind.config.ts` com a paleta Vermelho/Roxo, fonte Inter e cantos arredondados. Criar os componentes base (botões vazados, inputs limpos com ícones Lucide) substituindo os padrões brutos do Shadcn.

## 📌 Épico 2: Motor de Dados e IA (Backend & Core) — ✅ CONCLUÍDO
*(Cards de Backend, DB e LLM)*
* **Responsáveis:** `@AgenteBackend`, `@AgenteSecurity`
* **Descrição:** Modelagem (`prisma/schema.prisma`, migração Supabase SQL + Storage Bucket `statements` com RLS), validação Zod/Magic Bytes e Serviço de OCR (`src/lib/ai/ocr-parser.ts` + `src/app/actions/transactions.ts`).

## 📌 Épico 3: Interface de Usuário e Integração (Frontend) — ✅ CONCLUÍDO
*(Cards de Dashboard e Smart Input)*
* **Responsáveis:** `@AgenteFrontend`, `@AgenteUX`, `@AgenteUI`
* **Descrição:** Construção da tela de Rascunho (`DraftReviewPanel`), zona de Smart Input (Drag & Drop + `Ctrl+V`), modal manual keyboard-first e gráficos (`Recharts`), garantindo respeito absoluto ao Design System configurado no Card 1.3.

## 📌 Épico 4: Qualidade, Segurança e Fechamento (Hardening) — ✅ CONCLUÍDO
*(Cards de Playwright, Auditoria e Handshake)*
* **Responsáveis:** `@AgenteQA`, `@AgenteSecurity`, `Orquestrador`
* **Descrição:** Suíte de testes unitários de cálculo financeiro em centavos, parser de IA, Magic Bytes e Data Masking (`tests/unit/finance-and-parser.test.ts`), Page Object Model E2E (`tests/e2e/nexo-dashboard.pom.ts`) e auditoria de Harness.
