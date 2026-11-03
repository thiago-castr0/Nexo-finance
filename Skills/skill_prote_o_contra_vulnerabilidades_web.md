# 🛡️ Skill: OWASP & Web Vulnerability Prevention (Proteção Web)

**ID da Skill:** `SEC-001`
**Agente Alvo:** `@AgenteSecurity`
**Objetivo:** Garantir que o código (Frontend e Backend) esteja protegido contra as vulnerabilidades mais comuns da web (OWASP Top 10), como XSS, CSRF e Injeções.

## 1. Gatilho de Ativação
Durante as fases de "Revisão de Código" do Orquestrador, especialmente em pull requests ou entregas que envolvam Server Actions, inputs de usuário ou manipulação de banco de dados.

## 2. Fluxo de Execução
1. **Auditoria de XSS (Cross-Site Scripting):** Garantir que o frontend React não está usando `dangerouslySetInnerHTML` sem sanitização (como DOMPurify), especialmente ao renderizar retornos de texto da IA.
2. **Auditoria de Injeção:** Verificar se o `@AgenteBackend` está utilizando o ORM (Prisma/Drizzle) corretamente, sem usar raw queries (`$queryRaw`) não parametrizadas.
3. **Auditoria de CSRF:** Validar se as Server Actions estão protegidas por tokens ou pelas validações nativas do Next.js App Router para evitar falsificação de requisições.

## 3. Regra de Ouro (Failsafe)
O código não passa para produção se houver qualquer buraco de injeção. O agente de segurança tem poder de veto absoluto sobre qualquer outro agente, incluindo o Orquestrador.