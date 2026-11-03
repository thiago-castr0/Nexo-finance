# File: skill_accessibility.md
# Skill: Acessibilidade (A11y & WCAG)
**Descrição:** Assegura que a aplicação seja inclusiva e utilizável por pessoas com diferentes tipos de deficiência, seguindo as diretrizes WCAG (Web Content Accessibility Guidelines).

## Regras de Execução:
1. **Contraste de Cores:** Garantir taxa de contraste mínima de 4.5:1 para textos normais e 3:1 para textos grandes e componentes de interface.
2. **Navegação por Teclado:** Toda a aplicação deve ser navegável usando apenas a tecla `Tab`. O formulário de entrada manual deve permitir preenchimento rápido via teclado.
3. **Apoio a Leitores de Tela:** Incluir `aria-labels` descritivos em botões apenas com ícones (ex: ícones do Lucide Icons) e usar tags semânticas do HTML5 (`<main>`, `<nav>`, `<aside>`).
4. **Indicação Visual de Foco:** O estado de `:focus` e `:focus-visible` dos inputs e botões deve ser óbvio, geralmente com um anel de foco visível (padrão do Shadcn UI).
5. **Feedback não dependente de cor:** Não usar apenas vermelho para indicar erro; incluir ícones de alerta e mensagens de texto claras.