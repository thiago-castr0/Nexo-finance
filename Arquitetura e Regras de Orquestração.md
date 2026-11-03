# File: architecture_and_orchestration.md
# Arquitetura e Regras de Orquestração - Nexo Finance

Este documento define a infraestrutura tecnológica do projeto Nexo Finance e estabelece as regras de automação para os agentes da IDE. O objetivo principal é garantir um setup "zero dor de cabeça" para o usuário (Stakeholder), automatizando a criação de bancos de dados, storage e hospedagem.

## 1. Stack de Infraestrutura (Aprovada)
*   **Frontend & Framework:** Next.js (App Router) com React.
*   **Hospedagem (Hosting):** Netlify (Plano Free). Escolhido pela estabilidade e facilidade de automação via CLI. Não possui modo "sleep".
*   **Database & Storage:** Supabase (Plano Free). 
    *   *Database:* PostgreSQL para dados tabulares (usuários, transações, categorias).
    *   *Storage:* Supabase Storage para armazenamento persistente de imagens, prints e PDFs dos extratos.
*   **Controle de Versão:** GitHub.
*   **Estilização:** Tailwind CSS + Shadcn UI + Lucide Icons.

## 2. Regras de Orquestração Autônoma (Instruções para a IDE)

⚠️ **ATENÇÃO, AGENTE ORQUESTRADOR (ANTIGRAVITY / MCP):** 
O usuário não é um desenvolvedor focado em DevOps e não deve ser sobrecarregado com configurações manuais de infraestrutura. Você deve executar as configurações de forma autônoma usando CLIs.

### 2.1. Integração com GitHub
*   **Ação da IA:** No início do setup, o Agente Orquestrador DEVE perguntar ao usuário: *"Qual é a URL do repositório GitHub que vamos utilizar para este projeto?"*.
*   Após o usuário fornecer o link, a IDE deve configurar o `git remote add origin` e gerenciar os commits autonomamente.

### 2.2. Setup Autônomo do Supabase (Database + Storage)
*   **Ação da IA:** O agente deve inicializar o Supabase localmente no projeto rodando `npx supabase init`.
*   Para conectar à nuvem, o agente pedirá ao usuário apenas para fazer o login no site do Supabase, criar um projeto em branco e fornecer a URL e a Chave de API (Anon Key / Service Role).
*   A IA deve criar as tabelas e os *Buckets* de Storage (para os PDFs e Prints) via código (migrações SQL ou painel do Supabase), garantindo que as políticas de segurança (RLS) permitam o upload.

### 2.3. Setup Autônomo do Netlify (Hospedagem)
*   **Ação da IA:** O agente deve instalar o Netlify CLI (`npm install -g netlify-cli`).
*   O agente executará `netlify login` e pedirá ao usuário para clicar no link gerado no terminal para autorizar a IDE.
*   Em seguida, a IA executará `netlify init` para conectar o repositório do GitHub ao Netlify, configurando o deploy contínuo (qualquer push na main atualiza o site).

## 3. Fluxo de Dados da Aplicação (Data Flow)

Para garantir que imagens e PDFs nunca quebrem (como ocorria no Render), o fluxo de envio de extratos funcionará estritamente da seguinte forma:

1.  **Upload:** O usuário sobe o PDF ou Print no Frontend (Next.js).
2.  **Armazenamento Persistente:** O Frontend envia o arquivo diretamente para o **Supabase Storage**. O arquivo fica salvo lá e gera uma URL pública permanente.
3.  **Processamento de IA:** O Frontend envia a URL do arquivo (agora seguro no Supabase) para a API do Gemini/GPT (via Route Handlers do Next.js).
4.  **Retorno e Banco de Dados:** A IA lê o documento, extrai as despesas/receitas e retorna um JSON estruturado. O Frontend exibe o rascunho para aprovação.
5.  **Gravação Final:** Ao aprovar, os dados são salvos no **Supabase Database** (PostgreSQL).

## 4. Delegação de Tarefas (Squad Interna)
*   O **@AgenteOrquestrador** lê este arquivo e aciona o **@AgenteBackend** para configurar o `Supabase` e o `Netlify CLI`.
*   O **@AgenteFrontend** é chamado logo em seguida para rodar `npx create-next-app` e montar a interface.
*   Toda tomada de decisão estrutural que exija a criação de contas ou inserção de senhas será pausada pelo **@AgentePO**, que explicará o cenário ao usuário de forma simples e pedirá a informação ou clique de autorização.