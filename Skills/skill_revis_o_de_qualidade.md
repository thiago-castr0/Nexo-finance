# 🎯 Skill: Quality Review & PO Handshake (Revisão Final)

**ID da Skill:** `ORC-004`
**Agente Alvo:** Orquestrador
**Objetivo:** Garantir que o trabalho entregue atende a todos os Critérios de Aceite (Acceptance Criteria) definidos no Card da Sprint antes de apresentar ao Desenvolvedor Humano.

## 1. Gatilho de Ativação

Quando todas as tarefas de um Card do `sprint_board.md` forem dadas como "Concluídas" pelos especialistas (incluindo testes pelo `@AgenteQA`).

## 2. Parâmetros de Entrada Esperados

* O sistema funcional (ou pacote de código finalizado).

* Os Critérios de Aceite descritos no Card da Sprint.

* O `prd.md`.

## 3. Fluxo de Execução (Passo a Passo)

1. **Checklist de Aceite:** Passar ponto a ponto nos critérios do Card.

   * Ex: *O usuário consegue alterar um valor na tela de rascunho?* (Sim/Não).

2. **Invocação do PO:** Chamar o `@AgentePO` para validar se o valor de negócio foi atingido e se a experiência (aprovada pelo `@AgenteUX`) está fluida.

3. **Geração de Relatório (Handover):** Criar um resumo conciso para o Usuário Humano informando:

   * O que foi construído.

   * Decisões técnicas tomadas.

   * Como testar/rodar.

4. **Fechamento do Card:** Marcar o Card como "Done" e preparar a squad para o próximo épico.

## 4. Regra de Ouro (Failsafe)

Se faltar 1 único critério de aceite, o Card não pode ser fechado. O Orquestrador deve enviar o trabalho de volta para a fase de "Construção".