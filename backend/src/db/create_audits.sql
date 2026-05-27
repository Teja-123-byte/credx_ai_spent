create extension if not exists pgcrypto;

create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  share_id text not null unique,
  is_public boolean not null default true,
  company_name text,
  email text,
  team_size integer not null check (team_size > 0),
  primary_use_case text not null check (
    primary_use_case in ('coding', 'writing', 'data', 'research', 'mixed')
  ),
  input jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.audits add column if not exists email text;

create index if not exists audits_created_at_idx
  on public.audits (created_at desc);

create index if not exists audits_company_name_idx
  on public.audits (company_name);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists audits_set_updated_at on public.audits;

create trigger audits_set_updated_at
before update on public.audits
for each row
execute function public.set_updated_at();
