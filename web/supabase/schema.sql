-- Create a table for storing extracted datasets
create table public.datasets (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null default auth.uid (),
  name text not null,
  source_url text,
  row_count integer,
  headers jsonb, -- Array of strings
  rows jsonb, -- Array of arrays of strings
  metadata jsonb, -- Extra info (browser, version, etc)
  constraint datasets_pkey primary key (id),
  constraint datasets_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
);

-- Enable Row Level Security (RLS)
alter table public.datasets enable row level security;

-- Create Policy: Users can only see their own datasets
create policy "Users can view their own datasets" on public.datasets
  for select
  using (auth.uid() = user_id);

-- Create Policy: Users can insert their own datasets
create policy "Users can insert their own datasets" on public.datasets
  for insert
  with check (auth.uid() = user_id);

-- Create Policy: Users can update their own datasets
create policy "Users can update their own datasets" on public.datasets
  for update
  using (auth.uid() = user_id);

-- Create Policy: Users can delete their own datasets
create policy "Users can delete their own datasets" on public.datasets
  for delete
  using (auth.uid() = user_id);
