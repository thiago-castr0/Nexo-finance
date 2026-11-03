# 🎭 Skill: End-to-End Testing (Playwright)

**ID da Skill:** `QAE-001`
**Agente Alvo:** `@AgenteQA`
**Objetivo:** Simular o comportamento de um usuário real navegando pela aplicação Nexo Finance, garantindo que os fluxos principais (Happy Paths) e os fluxos de erro não quebrem na interface.

## 1. Gatilho de Ativação
Sempre que uma feature visual ou fluxo completo (ex: Upload de PDF -> Tela de Rascunho -> Salvar) for dada como "Concluída" pelo `@AgenteFrontend`.

## 2. Parâmetros de Entrada Esperados
- Código do Frontend finalizado.
- Fluxo de UX desenhado no PRD ou nos Cards da Sprint.
- URLs e rotas do ambiente local/teste.

## 3. Fluxo de Execução (Passo a Passo)
1. **Configuração do Cenário:** Escrever testes no Playwright usando o padrão Page Object Model (POM) para manter o código limpo.
2. **Ações de Usuário:** Simular cliques em botões (verificando o estado de hover e loading), digitação em inputs e navegação por abas.
3. **Teste de Upload (Mock):** Criar um script que injete um arquivo PDF ou Imagem mockada no componente de Drag & Drop para garantir que o Frontend reage corretamente (exibe o loader e muda de tela).
4. **Asserções (Assertions):** Verificar se elementos específicos aparecem na tela (ex: `expect(page.locator('text="Comprovante Lido com Sucesso"')).toBeVisible()`).

## 4. Regra de Ouro (Failsafe)
Testes E2E são lentos por natureza. O Agente QA deve focar o Playwright nos **fluxos críticos de negócio** (login, upload, salvar transação) e não testar coisas triviais (como se a cor de um texto mudou, isso é papel do Agente Design System).