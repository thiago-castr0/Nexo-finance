# 🧪 Skill: Unit & Integration Testing (Jest/Vitest)

**ID da Skill:** `QAE-002`
**Agente Alvo:** `@AgenteQA`
**Objetivo:** Testar funções isoladas e a lógica pura do sistema, garantindo que cálculos financeiros e o parsing de dados da IA funcionem 100% das vezes, independente da interface visual.

## 1. Gatilho de Ativação
Quando o `@AgenteBackend` criar novas Server Actions, utilitários de cálculo ou o motor de integração com a IA (Gemini/GPT).

## 2. Parâmetros de Entrada Esperados
- Funções TypeScript cruas (ex: `calculateTotalBalance`, `parseLLMResponse`).
- Casos de uso e regras de negócio.

## 3. Fluxo de Execução (Passo a Passo)
1. **Mocks de API:** Interceptar e mockar respostas da API da IA e do Banco de Dados. O teste não deve fazer chamadas de rede reais (para não gastar tokens de IA ou sujar o banco).
2. **Testes de Parsing:** Enviar strings JSON corrompidas (simulando uma alucinação da IA) para a função de parser do backend e afirmar (`expect`) que ela trata o erro graciosamente e retorna um aviso, em vez de quebrar a aplicação.
3. **Cálculos Matemáticos:** Testar funções de soma/subtração de despesas considerando edge cases de ponto flutuante em JavaScript (ex: `0.1 + 0.2`).

## 4. Regra de Ouro (Failsafe)
Nenhum PR envolvendo manipulação de dinheiro, saldo ou leitura de IA pode ser aprovado pelo Orquestrador sem ter pelo menos 90% de cobertura de testes unitários nas funções de cálculo/parsing.