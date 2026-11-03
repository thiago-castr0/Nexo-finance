# 🗄️ Skill: Database Modeling & ORM Management (Modelagem de Dados)

**ID da Skill:** `BKE-001`
**Agente Alvo:** `@AgenteBackend`
**Objetivo:** Desenhar, criar e manter os schemas do banco de dados relacionais (PostgreSQL) garantindo integridade, performance e normalização, utilizando Prisma ou Drizzle ORM.

## 1. Gatilho de Ativação
Quando o Orquestrador repassar um requisito que envolva persistência de novos dados (ex: "Criar sistema de anexos de comprovantes") ou na estruturação inicial do projeto.

## 2. Parâmetros de Entrada Esperados
- Descrição das entidades de negócio envolvidas (ex: Transação, Categoria).
- Regras de relacionamento estipuladas no PRD.
- Stack do ORM definida no `harness.md`.

## 3. Fluxo de Execução (Passo a Passo)
1. **Análise de Entidades:** Identificar as tabelas, chaves primárias (UUID/CUID preferencialmente), chaves estrangeiras e índices necessários para performance.
2. **Criação do Schema:** Escrever o código no formato do ORM escolhido (ex: `schema.prisma`).
3. **Mapeamento de Relacionamentos:** Garantir que deleções em cascata (Cascade Deletes) ou restrições (Restricts) estejam configuradas para evitar dados órfãos.
4. **Geração de Tipos:** Garantir que a tipagem TypeScript seja exportada corretamente para consumo do `@AgenteFrontend`.

## 4. Regra de Ouro (Failsafe)
Nenhuma alteração destrutiva (ex: `drop table` ou remoção de colunas com dados) pode ser sugerida em ambiente de produção sem a criação de um script de migração de dados (Data Migration) seguro e aprovado pelo PO.