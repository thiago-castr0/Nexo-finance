# 🏃‍♂️ Mega Sprint: Nexo Finance MVP

## 📌 Épico 1: Setup, Discovery e Design (Foundation)

### 🃏 Card 1.1: Setup do Repositório
* **Responsáveis:** `@AgenteBackend`, `@AgenteFrontend`, `@AgenteSecurity`
* **Descrição:** Configurar Next.js, Tailwind, ESLint e variáveis de ambiente.

### 🃏 Card 1.2: Mapeamento de Fluxos (User Flows)
* **Responsáveis:** `@AgentePO`, `@AgenteUX`
* **Descrição:** Desenhar o fluxo exato de uso (Dashboard -> Upload -> Rascunho -> Aprovação).

### 🃏 Card 1.3: Setup do Design System e UI Base
* **Responsáveis:** `@AgenteDesignSystem`, `@AgenteUI`
* **Descrição:** Configurar o `tailwind.config.ts` com a paleta Vermelho/Roxo, fonte Inter e cantos arredondados. Criar os componentes base (botões vazados, inputs limpos com ícones Lucide) substituindo os padrões brutos do Shadcn.

## 📌 Épico 2: Motor de Dados e IA (Backend & Core)
*(Cards de Backend, DB e LLM)*
* **Responsáveis:** `@AgenteBackend`
* **Descrição:** Modelagem (Prisma) e Serviço de OCR.

## 📌 Épico 3: Interface de Usuário e Integração (Frontend)
*(Cards de Dashboard e Smart Input)*
* **Responsáveis:** `@AgenteFrontend`, `@AgenteUX`, `@AgenteUI`
* **Descrição:** Construção da tela de Rascunho (Draft) e gráficos, garantindo respeito absoluto ao Design System configurado no Card 1.3.

## 📌 Épico 4: Qualidade, Segurança e Fechamento (Hardening)
*(Cards de Playwright, Auditoria e Handshake)*
* **Responsáveis:** `@AgenteQA`, `@AgenteSecurity`, `Orquestrador`