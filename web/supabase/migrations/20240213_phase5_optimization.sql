-- Phase 5: Optimization & Cleanup

-- 1. Ensure Datasets Table Exists (if not already)
create table if not exists public.datasets (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null default auth.uid (),
  name text,
  source_url text,
  status text default 'completed',
  row_count integer default 0,
  data jsonb, -- The actual data content
  constraint datasets_pkey primary key (id),
  constraint datasets_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- 2. Enforce Row Level Security (RLS) on Datasets
alter table public.datasets enable row level security;

-- Remove existing policies to avoid conflicts if re-running
drop policy if exists "Users can view their own datasets" on public.datasets;
drop policy if exists "Users can insert their own datasets" on public.datasets;
drop policy if exists "Users can update their own datasets" on public.datasets;
drop policy if exists "Users can delete their own datasets" on public.datasets;

create policy "Users can view their own datasets" on public.datasets
  for select using (auth.uid() = user_id);

create policy "Users can insert their own datasets" on public.datasets
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own datasets" on public.datasets
  for update using (auth.uid() = user_id);

create policy "Users can delete their own datasets" on public.datasets
  for delete using (auth.uid() = user_id);

-- 3. Optimization: Add Index on user_id for faster dashboard loading
create index if not exists datasets_user_id_idx on public.datasets (user_id);

-- 4. Cleanup: Remove any deprecated tables or columns if known (None for now)
