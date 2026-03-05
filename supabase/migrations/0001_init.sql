create extension if not exists pgcrypto;

create table if not exists public.agents (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  agency_name text not null,
  phone text,
  timezone text not null default 'America/New_York',
  insurance_types text[] not null default '{}',
  calendar_link text,
  brand_voice text,
  slug text not null unique,
  telegram_chat_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  insurance_type text not null,
  current_coverage text not null,
  timeline text not null,
  zip_code text not null,
  qualification_score int,
  qualification_reason text,
  status text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  ai_response text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists leads_agent_id_idx on public.leads(agent_id);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

alter table public.agents enable row level security;
alter table public.leads enable row level security;

create policy "agents can read own profile"
  on public.agents for select
  using (auth.uid() = id);

create policy "agents can update own profile"
  on public.agents for update
  using (auth.uid() = id);

create policy "agents can read own leads"
  on public.leads for select
  using (auth.uid() = agent_id);

create policy "agents can update own leads"
  on public.leads for update
  using (auth.uid() = agent_id);

create policy "public can insert leads"
  on public.leads for insert
  with check (true);
