# ♿ Skill: Web Accessibility & Inclusive Fintech (WCAG & A11y Avançada)

**ID da Skill:** `UIE-004`
**Agente Alvo:** `@AgenteUI`, `@AgenteFrontend`, `@AgenteQA`
**Referência:** `web-accessibility` (`addyosmani/web-quality-skills`)
**Objetivo:** Assegurar conformidade rigorosa com WCAG 2.1 AA, navegação fluida por teclado, semântica ARIA completa e feedback multimodal em todas as operações financeiras.

## 1. Gatilho de Ativação
Em toda criação de formulários, modais, tabelas interativas, alertas de erro e fluxos de revisão de IA.

## 2. Parâmetros de Entrada Esperados
- Componentes interativos (`Button`, `Input`, `ManualEntryModal`, `DraftReviewPanel`, `SmartInputDropzone`).

## 3. Fluxo de Execução (Passo a Passo)
1. **Landmarks Semânticos:** Estruturar páginas com `<header>`, `<nav>`, `<main>`, `<section aria-label="...">` e `<footer/aside>`.
2. **Anéis de Foco Visíveis (`:focus-visible`):** Nunca remover o `outline` sem substituir por um `focus-visible:ring-2` nítido na cor da ação.
3. **Regiões Vivas (`aria-live`):** Usar `role="status" aria-live="polite"` para progresso de leitura da IA e confirmações, e `role="alert"` para erros de validação.
4. **Independência de Cor:** Toda entrada (`+` + ícone `ArrowUpRight` + Verde `#0CB853`) e toda saída (`-` + ícone `ArrowDownRight` + Vermelho `#DF2929`) deve combinar símbolo matemático, ícone e cor.

## 4. Regra de Ouro (Failsafe)
Nenhum botão apenas com ícone pode existir sem `aria-label` descritivo em Português (PT-BR), e todo modal ou filtro deve ser operável 100% via teclado (`Tab`, `Shift+Tab`, `Enter`, `Escape`).
