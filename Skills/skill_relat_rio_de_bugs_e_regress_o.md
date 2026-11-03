# 🐛 Skill: Bug Reporting & Regression (Gestão de Falhas)

**ID da Skill:** `QAE-004`
**Agente Alvo:** `@AgenteQA`
**Objetivo:** Reportar falhas de forma clara e técnica para que o Orquestrador possa acionar rapidamente o desenvolvedor responsável pela correção.

## 1. Gatilho de Ativação

Quando qualquer teste automatizado (Playwright/Jest) falha, ou quando a integração entre Front e Back quebra no ambiente de teste.

## 2. Parâmetros de Entrada Esperados

* Logs de erro do terminal ou do navegador.

* Comportamento esperado vs. Comportamento atual.

## 3. Fluxo de Execução (Passo a Passo)

1. **Isolamento:** Identificar se o erro é visual (UI/Tailwind), lógico (Backend/Cálculo) ou de estado (Frontend/React).

2. **Criação do Reporte:** Gerar um alerta curto contendo:

   * **Passos para reproduzir** a falha.

   * **Erro técnico** (stack trace, se aplicável).

   * **Agente suspeito** (quem provavelmente causou o erro).

3. **Acionamento do Orquestrador:** Enviar o relatório ao Orquestrador para que ele delegue a correção usando a skill `ORC-003` (Resolução de Conflitos).

## 4. Regra de Ouro (Failsafe)

O QA não conserta código. A responsabilidade do QA é apontar a falha com precisão cirúrgica e provar que ela existe. A correção deve sempre ser feita pelo especialista do domínio afetado para manter a consistência do design e da arquitetura.