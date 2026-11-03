# 🔐 Skill: Data Validation & Security (Validação e Segurança)

**ID da Skill:** `BKE-004`
**Agente Alvo:** `@AgenteBackend`
**Objetivo:** Garantir que todo dado que chega ao servidor é limpo, válido e não representa ameaça (como injeção de dependências ou XSS disfarçado em PDFs).

## 1. Gatilho de Ativação

Durante a criação de qualquer endpoint, Server Action ou função que receba dados de origem externa (cliente).

## 2. Parâmetros de Entrada Esperados

* Payload bruto enviado pelo frontend.

* Tipagem Zod ou Yup estabelecida para a entidade.

## 3. Fluxo de Execução (Passo a Passo)

1. **Zod Schema:** Criar schemas de validação estritos (ex: `z.object({ amount: z.number().positive(), date: z.string().datetime() })`).

2. **Parsing do Input:** Executar `schema.safeParse(input)` na entrada de toda Server Action.

3. **Validação de Tipos de Arquivo:** Se o input for um arquivo, validar os "Magic Bytes" (assinatura do arquivo) e não apenas a extensão (ex: `.pdf`) para garantir que um executável não suba disfarçado.

4. **Rate Limiting (Conceitual):** Estruturar o endpoint prevendo que ele não pode ser chamado 1000 vezes por segundo (especialmente o endpoint de IA, que tem custo).

## 4. Regra de Ouro (Failsafe)

A regra fundamental de segurança dita pelo `harness.md`: O backend deve agir no modelo "Zero Trust" (Confiança Zero). Presumir que o Frontend pode ser burlado, portanto, **toda validação de regras de negócio e sanitização deve ser repetida no servidor**, mesmo que o `@AgenteFrontend` já tenha feito validações visuais.