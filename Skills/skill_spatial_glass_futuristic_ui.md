# ✨ Skill: Spatial Glassmorphism & Semantic UI Architecture (iOS / VisionOS Fintech Craft)

**ID da Skill:** `UIE-007`
**Agente Alvo:** `@AgenteDesignSystem`, `@AgenteUI`, `@AgenteFrontend`
**Referência:** Apple iOS 18 / VisionOS Spatial Glass + 2TP Futuristic Fintech Identity
**Objetivo:** Elevar o Design System e o Dashboard do Nexo Finance para uma estética futurista, translúcida e espacial (*Frosted Glassmorphism*), combinando desfoque óptico (`backdrop-blur`), bordas especulares de `1px`, iluminação ambiental da marca (`RED #DC2626` e `PURPLE #692296`), variáveis semânticas (`--surface-*`, `--border-*`, `--text-*`, `--glow-*`) e biblioteca expandida de componentes reutilizáveis, sem comprometer legibilidade ou WCAG 2.1 AA.

## 1. Gatilho de Ativação
Sempre que `@AgenteDesignSystem`, `@AgenteUI` ou `@AgenteFrontend` criarem ou refatorarem superfícies, cards, barras flutuantes, modais, gráficos ou novos componentes do Design System v4.0.

## 2. Parâmetros de Entrada Esperados
- Paleta Oficial de 38 Tokens (6 escalas de 5 níveis + 8 neutros).
- Regras invioláveis de usabilidade: Botões sempre em **1 única linha** (`Ícone Lucide + Texto`), `ThemeSwitch` (Light/Dark), `tabular-nums` em valores financeiros e zero menu lateral volumoso.

## 3. Fluxo de Execução (Passo a Passo)
1. **Arquitetura de Variáveis Semânticas (Semantic Token Layer):**
   - Nunca acoplar componentes diretamente a HEX estáticos quando o estado depender do tema. Utilizar tokens semânticos em `globals.css`:
     - `--surface-canvas`: Fundo espacial com mesh radial sutil (`RED 100`/`PURPLE 100` em Light; `RED 500/12%` + `PURPLE 500/15%` sob `#09090B` em Dark).
     - `--surface-glass-1` / `--surface-glass-2` / `--surface-glass-3`: Camadas de vidro fosco (`bg-white/65 dark:bg-zinc-900/60 backdrop-blur-xl backdrop-saturate-150`).
     - `--border-specular`: Borda luminosa estilo iPhone/VisionOS (`border-white/60 dark:border-white/12` combinada com contorno semântico `1px`).
     - `--glow-brand-red` / `--glow-brand-purple` / `--glow-semantic-success`: Sombras difusas suaves que criam profundidade espacial.
2. **Efeito Frosted Glassmorphism (Padrão iOS / iPhone):**
   - Aplicar `backdrop-blur-xl backdrop-saturate-[180%]` em barras de comando flutuantes (*Floating Dynamic Island Header*), cards de KPIs, painéis de IA e modais.
   - Adicionar reflexo superior interno (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]`) para simular a refração real do vidro.
3. **Componentes Reutilizáveis de Alta Densidade:**
   - Todo componente do Design System deve expor variantes semânticas (`brand`, `ai`, `income`, `expense`, `warning`, `info`, `glass`) documentadas interativamente em `/design-system`.

## 4. Regra de Ouro (Failsafe)
O efeito de vidro embaçado (*Glassmorphism*) nunca pode reduzir a taxa de contraste do texto abaixo de `4.5:1` (WCAG AA). Textos de saldo e tabelas devem manter nitidez absoluta sobre a camada translúcida, e todo suporte a `prefers-reduced-motion` deve ser respeitado.
