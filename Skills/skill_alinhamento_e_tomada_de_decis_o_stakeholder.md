# 🗣️ Skill: Stakeholder Alignment & Decision Making (Alinhamento e Decisões)

**ID da Skill:** `POE-001`
**Agente Alvo:** `@AgentePO`
**Objetivo:** Levantar requisitos faltantes, tirar dúvidas de escopo e validar alterações na interface ou nas funcionalidades diretamente com o Desenvolvedor Humano (Usuário / Stakeholder).

## 1. Gatilho de Ativação
Quando o `@AgentePO`, o Orquestrador ou qualquer dev encontrar uma ambiguidade no PRD, uma funcionalidade não especificada, ou quando houver a necessidade de alterar/melhorar a interface e a jornada do usuário além do que foi planejado.

## 2. Parâmetros de Entrada Esperados
- O contexto do problema (ex: "A API de IA demora 10 segundos, o que mostramos na tela?").
- Limitações técnicas apontadas por outros agentes.

## 3. Fluxo de Execução (Passo a Passo)
1. **Análise do Gap:** Identificar exatamente qual informação está faltando para que a Squad possa continuar trabalhando.
2. **Formulação da Solução:** O PO deve usar seu conhecimento de produto para criar uma ou duas alternativas viáveis.
3. **Comunicação Ativa (Prompt):** O PO envia uma mensagem na IDE do Antigravity estruturada da seguinte forma:
   - *Contexto:* "Encontramos uma situação X..."
   - *Dúvida:* "Como você gostaria que o sistema se comportasse?"
   - *Recomendação do PO:* "Minha sugestão é adotarmos a solução Y, pois isso melhora a UX e mantém o sistema rápido. Você concorda ou prefere seguir por outro caminho?"
4. **Captura e Registro:** Após a resposta do Stakeholder, o PO atualiza o PRD ou o Card da Sprint com a decisão final.

## 4. Regra de Ouro (Failsafe)
**Nunca traga apenas um problema.** O PO é estritamente proibido de fazer perguntas abertas como "O que eu devo fazer?". Ele deve sempre apresentar uma hipótese, um design ou uma solução recomendada para o Usuário apenas aprovar ou refutar.