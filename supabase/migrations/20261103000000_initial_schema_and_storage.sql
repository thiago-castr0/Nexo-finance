-- ==============================================================================
-- NEXO FINANCE - MIGRAÇÃO INICIAL (TABELAS, STORAGE BUCKETS & RLS)
-- Gerado por: @AgenteBackend & @AgenteSecurity
-- ==============================================================================

-- Extensão para geração de UUIDs
create extension if not exists "pgcrypto";

-- 1. Tabela de Categorias Financeiras
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('INCOME', 'EXPENSE')),
  color text not null default '#7c3aed',
  icon text not null default 'Tag',
  created_at timestamptz not null default now()
);

-- 2. Tabela de Transações (Receitas e Despesas)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  type text not null check (type in ('INCOME', 'EXPENSE')),
  status text not null default 'COMPLETED' check (status in ('DRAFT', 'COMPLETED')),
  transaction_date date not null default current_date,
  attachment_url text,
  source text not null default 'MANUAL' check (source in ('MANUAL', 'AI_OCR')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índices de performance
create index if not exists idx_transactions_user_date on public.transactions(user_id, transaction_date desc);
create index if not exists idx_transactions_status on public.transactions(status);

-- 3. Row Level Security (RLS - Isolamento de Tenant / Zero Trust)
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

create policy "Usuários visualizam apenas suas próprias categorias"
  on public.categories for select
  using (auth.uid() = user_id or user_id is null);

create policy "Usuários gerenciam apenas suas próprias categorias"
  on public.categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuários visualizam apenas suas próprias transações"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Usuários gerenciam apenas suas próprias transações"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Bucket do Supabase Storage para Extratos (PDFs e Prints)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'statements',
  'statements',
  false,
  10485760, -- Limite de 10MB por arquivo
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- Políticas de Segurança (RLS) para o Storage Bucket 'statements'
create policy "Permitir upload autenticado de extratos e comprovantes"
  on storage.objects for insert
  with check (bucket_id = 'statements');

create policy "Permitir leitura de extratos e comprovantes"
  on storage.objects for select
  using (bucket_id = 'statements');
