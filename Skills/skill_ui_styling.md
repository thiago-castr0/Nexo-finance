# 🎨 Skill: UI Styling & Token Architecture (Estilização Sistemática)

**ID da Skill:** `UIE-003`
**Agente Alvo:** `@AgenteDesignSystem`, `@AgenteUI`, `@AgenteFrontend`
**Referência:** `ui-styling` (`nextlevelbuilder/ui-ux-pro-max-skill`)
**Objetivo:** Orquestrar a estilização em Tailwind CSS utilizando estritamente a escala cromática de 5 níveis (`500`, `400`, `300`, `200`, `100`) e a escala de neutros (`BLACK`, `GRAY 900-100`, `WHITE`) sem valores mágicos desconectados.

## 1. Gatilho de Ativação
Sempre que classes Tailwind CSS ou variáveis CSS forem escritas ou refatoradas em componentes.

## 2. Parâmetros de Entrada Esperados
- `design_system_guide.md`, `tailwind.config.ts` e `src/app/globals.css`.

## 3. Fluxo de Execução (Passo a Passo)
1. **Regra de Pareamento Cromático (500 / 200 / 100):**
   - Texto e Ícone de Destaque: Nível `500` (ex: `#DC2626`, `#692296`, `#0CB853`, `#DF2929`, `#EA920F`, `#2572CE`).
   - Borda Semântica Sutil: Nível `200` ou `300` (ex: `#F59B92`, `#C59BE3`, `#7BD6A0`, `#F4948C`, `#ECD54A`, `#8CB9EB`).
   - Fundo de Hover / Badge Tint: Nível `100` (ex: `#FACBC2`, `#DEC5EF`, `#BCE5CB`, `#F9C5BD`, `#EDE08D`, `#BCD6F2`).
2. **Hierarquia de Neutros:**
   - Títulos e Valores Principais: `GRAY 900` (`#18181B`).
   - Subtítulos e Corpo Secundário: `GRAY 700` (`#3F3F46`).
   - Legendas e Placeholders: `GRAY 500` (`#71717A`).
   - Bordas de `1px`: `GRAY 200` (`#E4E4E7`) e `GRAY 300` (`#D4D4D8`) no hover.
3. **Ritmo de Cantos Arredondados:** `rounded-lg` para botões e inputs, `rounded-xl` para cards internos e `rounded-2xl` para containers de destaque.

## 4. Regra de Ouro (Failsafe)
Toda cor aplicada na UI deve pertencer comprovadamente à matriz oficial do Design System do Nexo Finance.
