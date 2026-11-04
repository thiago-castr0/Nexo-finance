# ✨ Skill: Impeccable UI Craft & Micro-Precision (Acabamento Impecável)

**ID da Skill:** `UIE-002`
**Agente Alvo:** `@AgenteDesignSystem`, `@AgenteUI`
**Referência:** `impeccable` (`pbakaus/impeccable`)
**Objetivo:** Elevar o acabamento visual da interface ao nível de produtos financeiros de elite (Linear, Stripe, Ramp), aplicando precisão óptica, camadas de superfície sutis (`1px solid`), microinterações fluidas e ritmo espacial rigoroso.

## 1. Gatilho de Ativação
Durante a criação ou revisão estética do Design System e do Dashboard principal.

## 2. Parâmetros de Entrada Esperados
- Tokens de cores da paleta oficial (`RED`, `PURPLE`, `ALERT`, `SUCCESS`, `ERROR/DANGER`, `INFO`, `NEUTRAL`).
- Componentes base de UI (`Button`, `Input`, `Card`, `Badge`).

## 3. Fluxo de Execução (Passo a Passo)
1. **Camadas de Superfície (Surface Layering):** Construir contraste elegante entre o canvas (`#F4F4F5` no Light / `#09090B` no Dark) e os cartões (`#FFFFFF` no Light / `#18181B` no Dark), separados exclusivamente por bordas finas de `1px solid #E4E4E7` (`#3F3F46` no Dark).
2. **Alinhamento Óptico:** Ícones Lucide (`strokeWidth={1.5}`) devem estar perfeitamente centralizados com os rótulos tipográficos e indicadores numéricos.
3. **Microinterações Deliberadas:** Aplicar transições rápidas (`150ms ease-out`) em estados de `hover`, `focus-visible` e `active:scale-[0.99]`, usando o nível `100` da paleta para preenchimentos translúcidos.
4. **Respiro e Densidade (White Space):** Manter padding consistente (`p-5` a `p-6`) e espaçamento entre grupos (`gap-4` a `gap-6`) para que os números financeiros respirem.

## 4. Regra de Ouro (Failsafe)
Proibido usar sombras pesadas (`shadow-xl`/`shadow-2xl` escuras) ou gradientes saturados agressivos que quebrem a estética *Clean & Minimalist* de `1px solid`.
