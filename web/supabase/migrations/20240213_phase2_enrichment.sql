-- Add recipe_id to datasets for lineage tracking
alter table public.datasets 
add column if not exists recipe_id uuid references public.recipes(id) on delete set null;

-- Create Schedules Table (for Vercel Cron / Automation)
create table public.schedules (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null default auth.uid (),
  recipe_id uuid not null,
  name text not null,
  cron_expression text not null, -- e.g. '0 9 * * 1'
  is_active boolean default true,
  last_run_at timestamp with time zone,
  next_run_at timestamp with time zone,
  constraint schedules_pkey primary key (id),
  constraint schedules_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint schedules_recipe_id_fkey foreign key (recipe_id) references public.recipes (id) on delete cascade
);

-- Enable RLS for Schedules
alter table public.schedules enable row level security;

create policy "Users can view their own schedules" on public.schedules
  for select using (auth.uid() = user_id);

create policy "Users can manage their own schedules" on public.schedules
  for all using (auth.uid() = user_id);


-- Create Enrichment Jobs Table (for async AI processing)
create table public.enrichment_jobs (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null default auth.uid (),
  dataset_id uuid not null,
  type text not null, -- 'sentiment', 'ner', 'translation', 'summarization'
  status text not null default 'pending', -- 'pending', 'processing', 'completed', 'failed'
  result_summary jsonb, -- e.g. { "positive": 80, "negative": 20 }
  error text,
  constraint enrichment_jobs_pkey primary key (id),
  constraint enrichment_jobs_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint enrichment_jobs_dataset_id_fkey foreign key (dataset_id) references public.datasets (id) on delete cascade
);

-- Enable RLS for Enrichment Jobs
alter table public.enrichment_jobs enable row level security;

create policy "Users can view their own enrichment jobs" on public.enrichment_jobs
  for select using (auth.uid() = user_id);

create policy "Users can manage their own enrichment jobs" on public.enrichment_jobs
  for all using (auth.uid() = user_id);
