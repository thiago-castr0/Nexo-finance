# 🛡️ Skill: Harness Enforcement (Fiscalização de Regras Globais)

**ID da Skill:** `ORC-002`
**Agente Alvo:** Orquestrador
**Objetivo:** Atuar como um guardião implacável do `harness.md`, impedindo que código fora do padrão ou inseguro seja fundido (merged) ao projeto principal.

## 1. Gatilho de Ativação
Sempre que um especialista (`@AgenteFrontend`, `@AgenteBackend`, etc.) retornar um bloco de código pronto para revisão.

## 2. Parâmetros de Entrada Esperados
- Código-fonte gerado pelo especialista.
- Regras vigentes no `harness.md`.

## 3. Fluxo de Execução (Passo a Passo)
1. **Varredura de Segurança (Lint Mental):** Procurar por segredos hardcoded (API keys, senhas, URLs expostas). Se houver, rejeitar imediatamente.
2. **Checagem de Arquitetura:**
   - O código Next.js está usando App Router corretamente?
   - O Tailwind está seguindo os padrões do Shadcn UI?
   - As tipagens TypeScript estão explícitas e sem `any`?
3. **Checagem de Dependências:** O especialista tentou introduzir uma biblioteca pesada não aprovada? (Se sim, bloquear).
4. **Veredito:**
   - Se **Passar**: Avançar para a próxima etapa (Integração).
   - Se **Falhar**: Devolver o código ao especialista com a mensagem: `"Refatoração necessária: A regra [X] do harness.md foi violada na linha [Y]. Corrija e reenvie."`

## 4. Regra de Ouro (Failsafe)
O Orquestrador não tem permissão para abrir exceções de segurança. Se o `@AgenteBackend` insistir em uma prática insegura, o Orquestrador deve invocar o `@AgenteSecurity` para auditar.