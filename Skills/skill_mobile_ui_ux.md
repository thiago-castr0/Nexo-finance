# 📱 Skill: Mobile UI/UX & Touch Ergonomics (Design Mobile-First)

**ID da Skill:** `UIE-001`
**Agente Alvo:** `@AgenteUX`, `@AgenteUI`, `@AgenteFrontend`
**Referência:** `mobile-design` (`vudovn/antigravity-kit`)
**Objetivo:** Garantir que toda a experiência do Nexo Finance seja impecável em dispositivos móveis e desktops, aplicando ergonomia de toque (Thumb Zone), alvos de clique mínimos de 44x44px e layouts responsivos sem rolagem horizontal quebrada.

## 1. Gatilho de Ativação
Sempre que uma tela, modal, tabela ou fluxo de upload (Smart Input / Rascunho) for criado ou refatorado.

## 2. Parâmetros de Entrada Esperados
- Componentes React/Tailwind da interface.
- Fluxos de usuário definidos pelo `@AgenteUX`.

## 3. Fluxo de Execução (Passo a Passo)
1. **Touch Targets (44x44px):** Garantir que botões, seletores e ações de linha tenham área de toque confortável (`min-h-10` / `h-10` ou superior em mobile).
2. **Adaptação de Tabelas e Listas:** Em telas menores (`< 768px`), garantir que tabelas financeiras e a Tela de Rascunho (Draft) se adaptem com empilhamento inteligente ou scroll horizontal suave com colunas-chave visíveis.
3. **Ergonomia de Polegar (Thumb Zone):** Posicionar CTAs principais (como *"Aprovar e Salvar"* e *"Novo Lançamento"*) em zonas de fácil alcance.
4. **Prevenção de Zoom Indesejado:** Inputs em mobile devem manter tamanho de fonte legível (`text-sm` / `16px` equivalente) e teclado numérico apropriado (`inputMode="decimal"`) para valores em R$.

## 4. Regra de Ouro (Failsafe)
Nenhuma tela pode apresentar *overflow* horizontal involuntário em viewports de `375px` (iPhone SE/Mini) a `1440px` (Desktop).
