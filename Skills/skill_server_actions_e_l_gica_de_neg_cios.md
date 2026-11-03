# ⚙️ Skill: Server Actions & Business Logic (Lógica de Servidor)

**ID da Skill:** `BKE-002`
**Agente Alvo:** `@AgenteBackend`
**Objetivo:** Escrever a lógica que roda no servidor do Next.js (App Router), conectando o banco de dados à interface e aplicando as regras de negócio de contabilidade.

## 1. Gatilho de Ativação
Quando o Orquestrador demandar a criação de rotas, mutações de dados (CRUD) ou endpoints de API para o frontend consumir.

## 2. Parâmetros de Entrada Esperados
- Tipagem dos dados esperados pelo Frontend.
- Regras de negócio (ex: "Uma despesa paga deve subtrair do saldo atual").
- Schemas do banco de dados (Prisma/Drizzle).

## 3. Fluxo de Execução (Passo a Passo)
1. **Definição de Contrato:** Estabelecer qual será o input (payload) e o output (retorno).
2. **Criação da Server Action:** Escrever a função assíncrona com `'use server'`.
3. **Implementação da Lógica:** Realizar as operações de banco de dados envolvendo blocos `try/catch` para tratamento adequado de erros.
4. **Revalidação de Cache:** Utilizar `revalidatePath` ou `revalidateTag` do Next.js para garantir que o Dashboard atualize após uma mutação (ex: após salvar uma despesa).

## 4. Regra de Ouro (Failsafe)
Toda Server Action deve ser "Stateless" (não guardar estado na memória do servidor) e deve sempre retornar objetos serializáveis consistentes (ex: `{ success: true, data: {...} }` ou `{ success: false, error: "mensagem" }`).