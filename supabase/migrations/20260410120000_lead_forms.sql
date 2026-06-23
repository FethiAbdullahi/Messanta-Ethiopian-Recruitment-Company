-- Contact form, employer worker requests, candidate shortlist requests (written by Next.js API with service role)

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null
);

alter table public.contact_submissions enable row level security;

create table if not exists public.employer_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text not null,
  country text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  roles_requested text not null,
  number_of_workers integer not null,
  start_date text not null,
  job_description text not null,
  notes text
);

alter table public.employer_requests enable row level security;

create table if not exists public.shortlist_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  candidate_id text not null,
  candidate_name text not null,
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  country text not null,
  notes text
);

alter table public.shortlist_requests enable row level security;

-- Optional: super admins may read from client if you add UI later
drop policy if exists "contact_submissions_super_admin_read" on public.contact_submissions;
create policy "contact_submissions_super_admin_read"
  on public.contact_submissions for select
  using (public.is_super_admin());

drop policy if exists "employer_requests_super_admin_read" on public.employer_requests;
create policy "employer_requests_super_admin_read"
  on public.employer_requests for select
  using (public.is_super_admin());

drop policy if exists "shortlist_requests_super_admin_read" on public.shortlist_requests;
create policy "shortlist_requests_super_admin_read"
  on public.shortlist_requests for select
  using (public.is_super_admin());
