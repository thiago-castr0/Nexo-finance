# File: skill_design_system_creation.md
# Skill: Criação e Manutenção de Design System
**Descrição:** Torna o `@AgenteUX` um especialista em estruturar, manter e aplicar o Design System do projeto. Esta skill garante que toda a interface respeite o Style Guide definido, mantendo a consistência visual, a padronização de componentes clean e a identidade da marca.

## Regras de Execução:
1. **Fidelidade ao Style Guide:** Consultar e aplicar obrigatoriamente as regras do arquivo `design_system_guide.md` em todas as decisões de UI.
2. **Design Clean e Minimalista:** Priorizar espaços em branco (white space), bordas finas (1px) e cantos arredondados (border-radius alto, como `rounded-lg` ou `rounded-full` no Tailwind).
3. **Botões e Interações:** Padronizar botões primários e secundários com o estilo *Outline* (vazados), contendo Ícone (Lucide) + Texto. Evitar fundos sólidos pesados, exceto em casos extremos de destaque.
4. **Semântica de Cores Financeiras:** Garantir que o uso da cor Primária (Vermelho) e Secundária (Roxo) não entre em conflito com o feedback financeiro. Vermelho deve ser usado com cuidado na UI para não ser confundido com saldo negativo, a menos que seja intencional.
5. **Iconografia Consistente:** Utilizar exclusivamente a biblioteca **Lucide Icons**. Os ícones devem ter a mesma espessura de linha (stroke-width: 1.5 ou 2) para combinar com as bordas finas dos inputs e botões.