# 🔌 Skill: Backend Integration & Data Fetching (Integração e Consumo)

**ID da Skill:** `FTE-003`
**Agente Alvo:** `@AgenteFrontend`
**Objetivo:** Conectar a interface do usuário às Server Actions e rotas do Next.js fornecidas pelo `@AgenteBackend`, garantindo tratamento de erros e feedbacks visuais precisos (Loaders/Toasts).

## 1. Gatilho de Ativação
Sempre que um componente precisar buscar dados reais (ex: carregar histórico de despesas) ou enviar dados (ex: submeter um arquivo PDF).

## 2. Parâmetros de Entrada Esperados
- Contrato da API ou assinatura da Server Action criada pelo Backend.
- Tipagem TypeScript (interfaces/types) do dado de retorno.

## 3. Fluxo de Execução (Passo a Passo)
1. **Invocação:** Realizar a chamada assíncrona (`await`) para a Server Action.
2. **Loading States:** Ativar estados de carregamento (ex: *skeletons* para páginas inteiras, ou um *spinner* no botão) assim que o request iniciar.
3. **Tratamento de Exceções:** Envolver a chamada em `try/catch`. 
   - Se sucesso: Renderizar dados ou disparar notificação de sucesso.
   - Se falha: Disparar toast notification amigável para o usuário ("Erro ao processar arquivo").
4. **Transition Hook:** Utilizar `useTransition` do React 18/Next.js para mutações não-bloqueantes quando aplicável.

## 4. Regra de Ouro (Failsafe)
O Frontend **nunca** deve "confiar" cegamente que a API retornará sucesso. Ele deve prever que a rede pode cair, o PDF pode ser grande demais e o servidor demorar. O usuário não pode ficar olhando para uma tela congelada sem saber o que está acontecendo.