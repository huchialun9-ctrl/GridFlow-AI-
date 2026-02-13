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

-- --- TEAMS & ORGANIZATIONS ---

-- Create Table for Organizations
create table public.organizations (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  owner_id uuid not null default auth.uid (),
  constraint organizations_pkey primary key (id),
  constraint organizations_owner_id_fkey foreign key (owner_id) references auth.users (id)
);

-- Create Table for Organization Members
create table public.organization_members (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  organization_id uuid not null,
  user_id uuid not null,
  role text not null default 'member', -- 'owner', 'admin', 'member'
  constraint organization_members_pkey primary key (id),
  constraint organization_members_organization_id_fkey foreign key (organization_id) references public.organizations (id) on delete cascade,
  constraint organization_members_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  unique (organization_id, user_id)
);

-- Enable RLS for organizations
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;

-- Policies for organizations
create policy "Members can view their organizations" on public.organizations
  for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_id = public.organizations.id
      and user_id = auth.uid()
    )
  );

-- Policies for organization_members
create policy "Members can view their fellow members" on public.organization_members
  for select
  using (
    exists (
      select 1 from public.organization_members my_membership
      where my_membership.organization_id = public.organization_members.organization_id
      and my_membership.user_id = auth.uid()
    )
  );

-- Update datasets table to support organizations
alter table public.datasets add column organization_id uuid references public.organizations(id);

-- Update RLS for datasets to include team access
create policy "Members can view team datasets" on public.datasets
  for select
  using (
    organization_id is not null and
    exists (
      select 1 from public.organization_members
      where organization_id = datasets.organization_id
      and user_id = auth.uid()
    )
  );

