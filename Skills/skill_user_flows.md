# File: skill_user_flows.md
# Skill: Mapeamento de Fluxos e Redução de Fricção (Extra)
**Descrição:** Foca na jornada do usuário ("Happy Path" e "Edge Cases"), garantindo que a transição entre telas e tarefas seja o mais curta e fluida possível.

## Regras de Execução:
1. **Onboarding Silencioso:** Projetar a primeira experiência (Zero State) de forma instrutiva. Telas vazias devem conter ilustrações e CTAs claros como "Faça o upload do seu primeiro extrato".
2. **Fluxo de Upload sem Fricção:** Permitir arrastar e soltar (Drag & Drop) e função de colar (Ctrl+V) imagens diretamente na tela do Dashboard para acionar a IA.
3. **Prevenção de Dead-ends:** Se a IA não conseguir ler o arquivo, fornecer um fallback imediato e amigável: "Não conseguimos ler este recibo. Deseja preencher manualmente?".
4. **Microinterações:** Solicitar feedback tátil ou visual para o usuário quando o OCR estiver processando dados em background (ex: Skeleton loaders ou mensagens de progresso dinâmicas).