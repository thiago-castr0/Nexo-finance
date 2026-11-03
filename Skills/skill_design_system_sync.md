# File: skill_design_system_sync.md
# Skill: Sincronização de Tokens e Design System (Extra)
**Descrição:** Traduz a linguagem de design para a engenharia de forma estruturada. Conecta as decisões de UX/UI com a implementação em Tailwind CSS e Shadcn UI para o `@AgenteFrontend`.

## Regras de Execução:
1. **Definição de Tokens:** Especificar variáveis de design (Cores, Tipografia, Sombras, Border Radius) compatíveis com o `tailwind.config.ts`.
2. **Reuso de Componentes:** Mapear necessidades de interface para componentes existentes do Shadcn UI antes de sugerir a criação de um componente customizado do zero.
3. **Estados de Interação:** Sempre documentar e exigir os estados `hover`, `active`, `disabled` e `loading` para qualquer elemento interativo.
4. **Responsividade Constante:** Projetar na lógica "Mobile First", garantindo que a tabela de extratos e o envio de prints funcionem perfeitamente em telas de smartphones.