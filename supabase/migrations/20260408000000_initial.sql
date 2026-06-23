-- Run in Supabase SQL Editor or via CLI: supabase db push
-- Profiles (linked to auth.users; role gates CV access)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'trainee'
    check (role in ('trainee', 'employer', 'staff', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- New auth users get a profile (default role: trainee). Promote employers to role employer in Dashboard.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'trainee'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Program enrollments (inserted only from your Next.js API using the service role)

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  date_of_birth date not null,
  phone text not null,
  email text not null,
  national_id text not null,
  passport text,
  program_id text,
  program_title text not null,
  experience text,
  cv_storage_path text,
  cv_link text
);

alter table public.enrollments enable row level security;
-- No policies: clients cannot read/write; service role bypasses RLS.

-- Maps site candidate id (from candidates.json) to a private storage object

create table if not exists public.candidate_cv_files (
  candidate_id text primary key,
  storage_path text not null,
  updated_at timestamptz not null default now()
);

alter table public.candidate_cv_files enable row level security;

-- Private buckets (upload & signed URLs via service role in Next.js API)

insert into storage.buckets (id, name, public)
values ('enrollment-files', 'enrollment-files', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('candidate-cvs', 'candidate-cvs', false)
on conflict (id) do nothing;
