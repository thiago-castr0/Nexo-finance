# 🔐 Skill: Data Privacy, Auth & Tenant Isolation (Privacidade e Isolamento)

**ID da Skill:** `SEC-002`
**Agente Alvo:** `@AgenteSecurity`
**Objetivo:** Garantir que os dados financeiros de um usuário (receitas, despesas, faturas) jamais sejam acessados por outro usuário, e que documentos sensíveis sejam manipulados de forma segura.

## 1. Gatilho de Ativação

Quando o sistema de autenticação for implementado e quando o fluxo de upload de documentos para a IA (PDFs, Prints) for construído.

## 2. Fluxo de Execução

1. **Isolamento de Tenant (Usuário):** Verificar obrigatoriamente se todas as queries de banco de dados (Select, Update, Delete) possuem a cláusula `where: { userId: currentUser.id }`. Nenhuma consulta financeira pode ocorrer sem filtro de usuário.

2. **Segurança de Anexos:** Garantir que os PDFs ou Prints não fiquem expostos em URLs públicas adivinháveis. O acesso a esses arquivos deve exigir validação de token (Presigned URLs no S3, por exemplo).

3. **Limpeza de IA (Data Masking):** Evitar que senhas ou PII (Personal Identifiable Information) críticos sejam enviados para o prompt da API do Gemini/GPT, se possível.

## 3. Regra de Ouro (Failsafe)

Aplicações financeiras operam em "Zero Trust" (Confiança Zero). O backend nunca deve confiar no `userId` enviado pelo payload do Frontend; ele deve extrair a identidade exclusivamente do token de sessão validado (JWT/Session) no servidor.