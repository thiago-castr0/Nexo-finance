# 🧠 Skill: LLM Integration & Smart Parsing (Integração IA e OCR)

**ID da Skill:** `BKE-003`
**Agente Alvo:** `@AgenteBackend`
**Objetivo:** Conectar o backend às APIs de IA (Google Gemini 1.5 Pro / GPT-4o) para ler imagens, recibos e extratos em PDF, extraindo as informações contábeis em formato estruturado.

## 1. Gatilho de Ativação
Sempre que a feature "Smart Input" (upload de faturas) for acionada ou necessitar de manutenções no prompt de extração.

## 2. Parâmetros de Entrada Esperados
- Buffer ou Base64 do arquivo enviado pelo usuário (PDF, PNG, JPG).
- Chaves de API (disponibilizadas exclusivamente via variáveis de ambiente seguras).

## 3. Fluxo de Execução (Passo a Passo)
1. **Engenharia de Prompt (System Prompt):** Configurar a IA com um prompt estrito. Ex: *"Você é um contador. Extraia data, valor, descrição. Retorne APENAS um JSON válido seguindo este schema..."*
2. **Tratamento do Arquivo:** Converter o PDF ou imagem para o formato compatível com a API da IA alvo.
3. **Chamada à API e Timeout:** Fazer o request com limite máximo de tempo (timeout) para evitar travamento do servidor.
4. **Limpeza do Retorno:** Realizar o parsing do retorno (`JSON.parse`), removendo marcações de markdown (` ```json `) que a IA possa ter injetado por engano.

## 4. Regra de Ouro (Failsafe)
O backend **nunca** deve salvar diretamente no banco de dados o output cru gerado pela IA. O retorno deve sempre ser passado para o Frontend (na Tela de Rascunho/Draft) para aprovação do Usuário Humano antes da persistência final.