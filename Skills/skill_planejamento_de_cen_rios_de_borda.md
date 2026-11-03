# 🗺️ Skill: Edge Cases & Scenario Planning (Mapeamento de Cenários)

**ID da Skill:** `QAE-003`
**Agente Alvo:** `@AgenteQA`
**Objetivo:** Pensar como um testador destrutivo antes mesmo do código ser escrito. Antecipar tudo o que pode dar errado no uso do aplicativo.

## 1. Gatilho de Ativação
Durante a fase de *Discovery*, logo após o PO e o UX desenharem o fluxo da nova feature, mas antes dos devs codarem.

## 2. Parâmetros de Entrada Esperados
- Documentação da feature (User Story).
- Protótipo de fluxo.

## 3. Fluxo de Execução (Passo a Passo)
1. **Análise de Risco:** Identificar o que acontece se o usuário agir de forma imprevisível.
2. **Criação da Matriz de Testes:** Documentar cenários que devem ser blindados. Exemplo de cenários para o upload de PDF:
   - *E se o usuário subir um PDF de 50MB protegido por senha?*
   - *E se o usuário subir um PDF em branco?*
   - *E se a internet cair em 50% do upload?*
   - *E se o upload for uma foto PNG muito escura, a IA vai travar?*
3. **Passagem de Bastão:** Entregar essa lista ao Orquestrador para que ele exija as validações do Backend e Frontend durante a codificação.

## 4. Regra de Ouro (Failsafe)
O QA deve sempre assumir que a "Lei de Murphy" se aplica. Se algo pode quebrar, vai quebrar. O trabalho desta skill é documentar essas falhas para que a squad de desenvolvimento crie as travas de segurança (`try/catch`, `zod schemas`, alertas) antecipadamente.