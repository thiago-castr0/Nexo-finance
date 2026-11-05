---
name: fintech-command-cockpit
description: Arquitetura UI v5.0 (Nova Roupagem - Porta 3001) para o Nexo Finance. Define o layout App-Shell com Sidebar de Navegação, Wallet Card interativo, Timeline Diária de Lançamentos, Envelopes de Orçamento e Design System Studio com navegação lateral.
---

# Fintech Command Cockpit (`fintech-command-cockpit` — `UIE-008`)

Consulte também `Skills/skill_fintech_command_cockpit.md` (`UIE-008`).

## Diretrizes Principais (Proposta `localhost:3001`)
1. **App-Shell com Navegação Lateral (Left Rail) + Barra Inferior Mobile:** Substitui o layout tradicional de blocos empilhados por uma estrutura de aplicativo moderno (inspirada em Linear, Wise e Copilot Money), com navegação rápida por contexto (`Visão Geral`, `Extrato Timeline`, `Scanner IA`, `Orçamentos`).
2. **Hero Wallet Card & Quick Actions:** Cartão principal de saldo com visual tátil da marca 2TP (`#DC2626` + `#692296`), acompanhado de pílulas de resumo limpas (`Entradas`, `Saídas`, `Saldo Livre`) e ações de 1 clique.
3. **Timeline de Lançamentos & Alternância Lista/Tabela:** Exibição limpa e escaneável dos lançamentos com ícones por categoria, busca instantânea, filtros em pílula e opção de alternar entre **Modo Lista (App)** e **Modo Tabela Compacta**.
4. **Regras Inegociáveis Mantidas:** Botões sempre em **linha única** (`Lucide Icon + Texto` com `whitespace-nowrap`), numerais `tabular-nums`, validação Zod, Magic Bytes, e suporte completo a Light Mode Clean (`#F8FAFC`/`#FFFFFF`) e Dark Mode OLED (`#09090B`/`#121216`).
