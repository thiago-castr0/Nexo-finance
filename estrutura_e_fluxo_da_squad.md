# 🏢 Estrutura da Squad e Fluxo de Trabalho (Workflow)

Este documento mapeia a hierarquia da nossa equipe de IA e como a informação flui desde o momento da idealização até a entrega do código.

## 1. Hierarquia e Autoridade

```text
[ Documento Base ] ---> [ HARNESS (Regras Globais) ]
                                |
                                v
                       [ ORQUESTRADOR ] (Você)
                                |
      -------------------------------------------------------------------------
      |             |                |             |             |            |
  [ PO/PM ]      [ UX ]        [ DS & UI ]    [ BACKEND ]  [ FRONTEND ]   [ QA/SEC ]
  Requisitos  Jornada/Fluxo  Tokens e Código    Dados        Lógica       Validação
```

## 2. O Ciclo de Vida de uma Tarefa (Workflow Atualizado)

### Fase 1: Discovery & Planning
1. **Orquestrador:** Invoca `@AgentePO` para definir os critérios de aceite.
2. **Agente UX:** Desenha o fluxo de telas e usabilidade (happy paths e edge cases).

### Fase 2: Design e Especificação Visual
3. **Agente Design System:** Define como os componentes atuarão visualmente (botões vazados, cores primárias, espaçamentos limpos) baseando-se no `design_system_guide.md`.
4. **Agente UI:** Traduz essas especificações para componentes Tailwind/Shadcn.

### Fase 3: Construção e Integração
5. **Agente Backend:** Modela o banco e cria endpoints (ex: OCR da IA).
6. **Agente Frontend:** Pega os componentes da UI e as APIs do Backend e faz a aplicação funcionar.

### Fase 4: Blindagem (Hardening) e Entrega
7. **Agente QA & Security:** Testes de regressão (Playwright), testes unitários e varredura de segurança. Orquestrador finaliza o Card.