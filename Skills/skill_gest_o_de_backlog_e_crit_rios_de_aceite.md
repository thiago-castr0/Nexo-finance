# 📋 Skill: Backlog Grooming & Acceptance Criteria (Gestão de Backlog)

**ID da Skill:** `POE-002`
**Agente Alvo:** `@AgentePO`
**Objetivo:** Fatiar épicos em tarefas menores, priorizar o que é MVP (Pessoa Física) do que é Futuro (Pessoa Jurídica/Estoque) e definir o "Definition of Done" (DoD).

## 1. Gatilho de Ativação
Durante o planejamento de novas Sprints ou quando o projeto precisar ser quebrado em partes mais executáveis para os desenvolvedores.

## 2. Fluxo de Execução
1. **Fatiamento (Slicing):** Garantir que nenhum Card da Sprint seja grande demais.
2. **Definição de Critérios de Aceite:** Escrever regras claras que devem ser validadas pelo `@AgenteQA` e Orquestrador (ex: "Dado que o usuário fez upload de um PDF válido, Quando a IA processar, Então a tela de Rascunho deve abrir com os dados pré-preenchidos").
3. **Escudo de Escopo (Scope Creep):** Proteger o MVP. Se algum agente sugerir adicionar controle de estoque agora, o PO deve intervir e colocar isso no "Backlog do Futuro".