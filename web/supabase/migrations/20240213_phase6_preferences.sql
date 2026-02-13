-- Add preferences column to profiles
alter table public.profiles 
add column if not exists preferences jsonb default '{}'::jsonb;

-- Ensure RLS allows update (already set in Phase 4 but good to verify)
-- Policy "Users can update own profile" should cover this.
