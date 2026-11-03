# 🛡️ Skill: Client-Side Validation & Forms (Formulários e Validação)

**ID da Skill:** `FTE-004`
**Agente Alvo:** `@AgenteFrontend`
**Objetivo:** Capturar, higienizar e validar os dados inseridos pelo usuário *antes* de enviá-los ao servidor, garantindo uma UX rápida e reduzindo chamadas desnecessárias à API.

## 1. Gatilho de Ativação

Quando o sistema exigir formulários (Lançamento Manual) ou áreas de upload interativas (Drag & Drop para extratos e faturas).

## 2. Parâmetros de Entrada Esperados

* Regras de negócio (ex: "Valor não pode ser negativo no formulário X").

* Schemas de validação baseados em regras do `@AgenteBackend`.

## 3. Fluxo de Execução (Passo a Passo)

1. **Setup do Formulário:** Utilizar bibliotecas padrão como `react-hook-form` conectadas a componentes Shadcn.

2. **Schema Zod:** Espelhar a validação do Zod criada pelo Backend no Frontend (`@hookform/resolvers/zod`). Isso garante que as mesmas regras apliquem.

3. **Feedback Instantâneo:** Ao preencher um campo errado, exibir a mensagem de erro no `onChange` ou `onBlur` (antes mesmo do usuário clicar em "Salvar").

4. **Tratamento de Arquivos:** No upload de imagens/PDFs (Drag & Drop), validar o tamanho e a extensão (`.pdf`, `.png`, `.jpg`) diretamente no navegador antes de desperdiçar banda tentando subir um arquivo inválido.

## 4. Regra de Ouro (Failsafe)

A validação client-side serve unicamente para **Melhorar a Experiência do Usuário (UX)**. Ela não substitui a validação de segurança do backend. O Frontend deve sempre avisar claramente ao usuário qual campo falhou e o porquê.