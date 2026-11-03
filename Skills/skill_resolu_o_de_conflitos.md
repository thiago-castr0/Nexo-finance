# ⚖️ Skill: Conflict Resolution & Integration (Resolução e Integração)

**ID da Skill:** `ORC-003`
**Agente Alvo:** Orquestrador
**Objetivo:** Resolver gargalos técnicos e incompatibilidades de código entre diferentes especialistas da Squad (ex: o Frontend espera um JSON, mas o Backend devolve uma String).

## 1. Gatilho de Ativação
Quando a integração de duas entregas de agentes falha, quando ocorrem erros de tipagem entre camadas, ou quando o `@AgenteQA` reporta que o teste quebrou a integração.

## 2. Parâmetros de Entrada Esperados
- Código do Agente A (ex: Frontend).
- Código do Agente B (ex: Backend).
- Mensagem de erro ou log do terminal.

## 3. Fluxo de Execução (Passo a Passo)
1. **Isolamento da Falha:** Identificar exatamente onde ocorre a quebra de contrato (ex: A Server Action espera um `FormData`, mas o Client Component enviou um `JSON`).
2. **Definição do Padrão (Source of Truth):** Consultar o `prd.md` ou os schemas do banco (Prisma) para ver quem está certo.
3. **Ação Corretiva Direcionada:** Acionar apenas o agente que está fora do padrão para corrigir sua ponta. 
   - *Comando:* `"@AgenteFrontend, o Backend foi desenhado para receber multipart/form-data devido ao arquivo PDF. Ajuste seu payload de envio."`
4. **Validação Cruzada:** Após a correção, re-testar a integração das duas partes.

## 4. Regra de Ouro (Failsafe)
O Orquestrador não deve reescrever o código sozinho para "tapar buracos". Ele deve obrigar o agente especialista a gerar o código correto, mantendo a responsabilidade de domínio intacta.