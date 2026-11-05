---
name: spatial-glass-ui
description: Apple iOS / VisionOS Spatial Glassmorphism & Semantic Variable Architecture for Nexo Finance (2TP Ecosystem). Enforces frosted glass surfaces, specular 1px borders, ambient brand aurora glows, and semantic CSS tokens while preserving WCAG 2.1 AA and single-line Lucide Icon + Text buttons.
---

# Spatial Glassmorphism & Semantic UI (`spatial-glass-ui`)

Consulte também `Skills/skill_spatial_glass_futuristic_ui.md` (`UIE-007`).

## Regras Principais
1. **Camadas de Vidro (iOS / VisionOS Frosted Glass):**
   - Superfícies translúcidas com `backdrop-blur-xl backdrop-saturate-[180%]`, reflexo interno superior (`inset 0 1px 0 rgba(255,255,255,0.6)`) e bordas especulares de `1px solid`.
2. **Variáveis Semânticas (`globals.css`):**
   - Uso obrigatório de tokens semânticos (`--surface-glass-*`, `--text-primary`, `--text-secondary`, `--border-glass`, `--accent-brand-primary`, `--accent-ai-primary`, `--status-income`, `--status-expense`, `--status-warning`, `--status-info`) que se adaptam automaticamente ao Light Mode e Dark Mode.
3. **Iluminação Ambiental da Marca 2TP (Aurora Mesh):**
   - Orbes difusos em `RED (#DC2626)` e `PURPLE (#692296)` no plano de fundo para que o desfoque do vidro revele as cores da marca com sofisticação futurista.
4. **Regras Invioláveis:**
   - Nenhum botão pode quebrar em duas linhas (`flex-row flex-nowrap whitespace-nowrap shrink-0`).
   - Todo botão deve conter `Ícone Lucide + Texto`.
   - Zero repetição de ações entre o Header e o corpo da página.
