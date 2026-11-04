# 🧱 Skill: Shadcn/UI Custom Primitives (Arquitetura de Componentes)

**ID da Skill:** `UIE-005`
**Agente Alvo:** `@AgenteUI`, `@AgenteFrontend`
**Referência:** `shadcn-ui` (`shadcn-ui/ui`)
**Objetivo:** Construir primitivos de interface composáveis e tipados (`cva` + `tailwind-merge` + `forwardRef`), substituindo o visual bruto padrão do Shadcn pela identidade *Outline 1px Clean* do Nexo Finance.

## 1. Gatilho de Ativação
Ao criar ou evoluir componentes em `src/components/ui/`.

## 2. Parâmetros de Entrada Esperados
- Especificações do `design_system_guide.md`.
- Utilitário `cn` (`src/lib/utils.ts`).

## 3. Fluxo de Execução (Passo a Passo)
1. **Variantes Tipadas com CVA:** Definir variantes explícitas (`variant`, `size`, `shape`) usando `class-variance-authority`.
2. **Composição Limpa:** Exportar subcomponentes semânticos (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) permitindo composição flexível sem *prop drilling*.
3. **Customização Obrigatória do Padrão Shadcn:**
   - Botões são *Outline* por padrão (vazados com borda `1px` colorida e ícone Lucide à esquerda).
   - Inputs possuem suporte nativo a `label`, `icon`, `error`, `helperText` e `tabularNums`.

## 4. Regra de Ouro (Failsafe)
Nunca deixar estilos genéricos não customizados do Shadcn vazarem para a interface; todo primitivo em `src/components/ui/` deve refletir a paleta e a tipografia oficial do Nexo Finance.
