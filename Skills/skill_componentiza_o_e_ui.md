# 🧩 Skill: Componentization & UI Architecture (Arquitetura de UI)

**ID da Skill:** `FTE-001`
**Agente Alvo:** `@AgenteFrontend`
**Objetivo:** Traduzir os requisitos visuais e wireframes em componentes React limpos, responsivos e acessíveis, utilizando Tailwind CSS e a base do Shadcn UI.

## 1. Gatilho de Ativação
Quando o Orquestrador solicita a criação de uma nova tela, um widget do Dashboard ou um componente isolado (ex: "Botão de Upload", "Tabela de Transações").

## 2. Parâmetros de Entrada Esperados
- Wireframes ou especificações de UX aprovadas pelo `@AgenteUX`.
- Tokens de design (cores, tipografia) fornecidos pelo `@AgenteUI`.
- Escopo de uso (se é um *Server Component* ou um *Client Component*).

## 3. Fluxo de Execução (Passo a Passo)
1. **Definição de Fronteira:** Determinar se o componente deve ser um Server Component (padrão para performance) ou Client Component (necessita `'use client'` para interatividade como `onClick` e `useState`).
2. **Implementação Shadcn:** Instalar/utilizar a base de componentes do Shadcn UI (ex: `Button`, `Dialog`, `Table`) ao invés de recriar do zero.
3. **Estilização com Tailwind:** Aplicar as classes utilitárias garantindo total responsividade (mobile-first) e suporte ao Dark Mode.
4. **Isolamento:** Garantir que o componente seja burro (dumb component) o máximo possível, recebendo dados via `props` em vez de buscar dados de dentro dele mesmo.

## 4. Regra de Ouro (Failsafe)
Nenhum componente de interface deve conter regras de negócio complexas. A apresentação deve estar separada da lógica. Se a complexidade visual aumentar demais, o componente deve ser quebrado em pedaços menores (SOLID).