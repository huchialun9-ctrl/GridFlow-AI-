-- Create Recipes Table
create table public.recipes (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null default auth.uid (),
  name text not null,
  description text,
  domain text, -- e.g., 'amazon.com'
  selector_json jsonb not null, -- Stores the extraction rules
  constraint recipes_pkey primary key (id),
  constraint recipes_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- Enable RLS for Recipes
alter table public.recipes enable row level security;

create policy "Users can view their own recipes" on public.recipes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own recipes" on public.recipes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own recipes" on public.recipes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own recipes" on public.recipes
  for delete using (auth.uid() = user_id);


-- Create Webhooks Table
create table public.webhooks (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null default auth.uid (),
  name text not null,
  url text not null,
  secret text, -- Optional signing secret
  event_types jsonb, -- Array of events e.g., ['dataset.created']
  is_active boolean default true,
  constraint webhooks_pkey primary key (id),
  constraint webhooks_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- Enable RLS for Webhooks
alter table public.webhooks enable row level security;

create policy "Users can view their own webhooks" on public.webhooks
  for select using (auth.uid() = user_id);

create policy "Users can manage their own webhooks" on public.webhooks
  for all using (auth.uid() = user_id);


-- Create API Keys Table
create table public.api_keys (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null default auth.uid (),
  name text not null,
  key_hash text not null, -- Store only the hash of the key
  last_used_at timestamp with time zone,
  scopes jsonb, -- e.g., ['read:datasets', 'write:extract']
  constraint api_keys_pkey primary key (id),
  constraint api_keys_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- Enable RLS for API Keys
alter table public.api_keys enable row level security;

create policy "Users can view their own api keys" on public.api_keys
  for select using (auth.uid() = user_id);

create policy "Users can manage their own api keys" on public.api_keys
  for all using (auth.uid() = user_id);
