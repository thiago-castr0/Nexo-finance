# 🛡️ System Harness & Global Rules

Este documento define as fronteiras, regras estritas de execução e diretrizes de qualidade que **todos os agentes** (incluindo o Orquestrador) devem respeitar incondicionalmente durante o desenvolvimento do projeto Nexo Finance.

## 1. Diretrizes de Segurança (Strict Security)
- **NENHUM** segredo (API keys, tokens, senhas de banco) deve ser hardcoded no código. Usar sempre variáveis de ambiente (`.env.local`).
- **VALIDAÇÃO OBRIGATÓRIA:** Todos os inputs de usuários (arquivos PDF, imagens, digitação manual) devem ser sanitizados no frontend e validados estritamente no backend.
- O Agente de Segurança deve aprovar o fluxo de autenticação e manipulação de arquivos de IA antes de qualquer merge na branch principal.

## 2. Padrões de Código e Arquitetura
- **Stack Fixa:** Next.js (App Router), React, Tailwind CSS, Shadcn UI, TypeScript.
- **Tipagem:** TypeScript é obrigatório (Strict Mode ativado). Sem uso de `any` injustificado.
- **Backend/APIs:** Devem ser construídas primariamente como Server Actions no Next.js ou Route Handlers.
- **Componentização:** Padrão de componentes pequenos, focados em uma única responsabilidade (SOLID).
- **Idioma do Código:** Variáveis, funções e comentários técnicos em Inglês. Textos de interface (UI) em Português (PT-BR).

## 3. Regras de Execução de Tarefas
- **Proibido Pular Etapas:** Nenhuma funcionalidade vai para código (Frontend/Backend) sem antes passar pela validação do PO/PM e refinamento de UX.
- **Test-Driven:** Funcionalidades críticas (como o motor de parsing de despesas) devem ter testes escritos pelo especialista em QA (Playwright/Jest) garantindo que a regra de negócio não quebre.
- **Autonomia Limitada:** O Orquestrador não deve tomar decisões de mudança de escopo (remover features essenciais do PRD) sem aprovação explícita do desenvolvedor humano (Usuário).

## 4. O que NÃO pode ser feito
- Modificar o PRD principal sem passar por um processo de revisão.
- Adicionar bibliotecas pesadas (ex: Lodash inteiro, Moment.js) quando alternativas modernas e nativas estiverem disponíveis.
- Executar testes destrutivos em banco de dados de produção (sempre usar mocks ou ambiente de teste isolado).