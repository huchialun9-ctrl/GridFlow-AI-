-- Enable Storage
insert into storage.buckets (id, name, public)
values ('exports', 'exports', false);

-- RLS Policy: Users can only upload their own exports
create policy "Users can upload their own exports"
on storage.objects for insert
with check ( bucket_id = 'exports' and auth.uid() = owner );

-- RLS Policy: Users can only read their own exports
create policy "Users can read their own exports"
on storage.objects for select
using ( bucket_id = 'exports' and auth.uid() = owner );

-- Create a table to track export history (Managed Assets)
create table if not exists public.managed_exports (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    dataset_id uuid references public.datasets(id),
    file_path text not null,
    file_name text not null,
    file_size_bytes bigint,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.managed_exports enable row level security;

create policy "Users can view their own exports"
on public.managed_exports for select
using (auth.uid() = user_id);
