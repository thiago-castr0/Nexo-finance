# 🧠 Skill: Task Delegation & Context Routing (Delegação e Roteamento)

**ID da Skill:** `ORC-001`
**Agente Alvo:** Orquestrador
**Objetivo:** Analisar um requisito complexo, fatiá-lo e delegar para os especialistas corretos com o contexto exato que eles precisam, sem gerar ruído.

## 1. Gatilho de Ativação
Sempre que o Orquestrador receber um novo "Card da Sprint" ou um pedido direto do Desenvolvedor Humano (Usuário).

## 2. Parâmetros de Entrada Esperados
- Descrição da Tarefa (User Story ou Requisito).
- Arquivos de referência (PRD, referências de layout).
- Restrições técnicas do `harness.md`.

## 3. Fluxo de Execução (Passo a Passo)
1. **Análise de Escopo:** Ler a tarefa e identificar quais domínios (Frontend, Backend, UI, UX, QA) estão envolvidos.
2. **Preparação de Contexto (Prompting Interno):** Criar um mini-briefing para cada agente. 
   - *Exemplo:* Em vez de mandar "faça o upload de PDF" para o Frontend, enviar "Crie o componente de Drag&Drop em React/Tailwind e conecte com a Server Action X, seguindo o layout Y".
3. **Invocação Sequencial/Paralela:** Chamar os agentes usando suas tags (ex: `@AgenteUX`, depois `@AgenteUI` e `@AgenteBackend` em paralelo).
4. **Tracking:** Marcar o estado da tarefa como "Em Andamento (Aguardando Especialista)".

## 4. Regra de Ouro (Failsafe)
Nunca delegar uma tarefa de interface visual sem antes ter os dados (Backend) modelados, a menos que seja para criar *mocks*. Se faltar informação, o Orquestrador deve invocar o `@AgentePO` para esclarecimentos antes de acionar os devs.