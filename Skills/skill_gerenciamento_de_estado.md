# 🔄 Skill: State Management & Reactivity (Gestão de Estado)

**ID da Skill:** `FTE-002`
**Agente Alvo:** `@AgenteFrontend`
**Objetivo:** Controlar o ciclo de vida dos dados na tela, gerenciando estados locais, estados globais e feedbacks visuais em tempo real para o usuário.

## 1. Gatilho de Ativação
Quando o fluxo do usuário exige interação com dados temporários ou múltiplos passos antes de salvar (ex: a Tela de Rascunho após a IA ler a fatura).

## 2. Parâmetros de Entrada Esperados
- Dados estruturados (mocks ou reais) que precisam ser manipulados.
- Fluxo de tela definido pelo `@AgenteUX`.

## 3. Fluxo de Execução (Passo a Passo)
1. **Escolha da Ferramenta:**
   - Usar `useState` ou `useReducer` para estados locais simples (ex: abrir/fechar modal).
   - Usar Context API ou *Zustand* (se aprovado no projeto) para estados globais complexos que cruzam componentes (ex: guardar o JSON da IA enquanto o usuário edita a tabela de rascunho).
2. **Atualização Otimista (Optimistic UI):** Ao usuário deletar ou editar uma transação, atualizar a interface imediatamente (sem esperar o servidor), revertendo a ação silenciosamente caso a chamada falhe.
3. **Controle de Side-effects:** Utilizar o `useEffect` com parcimônia, garantindo que o array de dependências esteja correto para evitar re-renderizações infinitas.

## 4. Regra de Ouro (Failsafe)
Evitar o "Prop Drilling" (passar propriedades por 10 camadas de componentes). Se o estado precisa ser acessado por partes distantes da aplicação, ele deve ser elevado (lifted) para um Contexto ou gerenciador de estado global.