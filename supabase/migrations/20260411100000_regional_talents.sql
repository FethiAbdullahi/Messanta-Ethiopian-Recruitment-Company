-- Regional talent / student records captured by field teams (form or bulk upload).
-- Access is enforced in Next.js APIs (service role).

alter table public.profiles
  add column if not exists default_region text;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.regional_talents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id) on delete cascade,
  region text not null,
  source text not null default 'form' check (source in ('form', 'bulk_csv', 'bulk_xlsx')),
  full_name text not null,
  gender text,
  date_of_birth date,
  phone text not null,
  email text,
  national_id text,
  passport text,
  current_address text,
  city text,
  woreda_subcity text,
  emergency_contact_name text,
  emergency_contact_phone text,
  highest_education text,
  field_of_study text,
  institution_name text,
  graduation_year text,
  languages text,
  skills_summary text,
  notes text
);

create index if not exists regional_talents_created_by_idx on public.regional_talents (created_by);
create index if not exists regional_talents_region_idx on public.regional_talents (region);
create index if not exists regional_talents_created_at_idx on public.regional_talents (created_at desc);

alter table public.regional_talents enable row level security;

drop trigger if exists regional_talents_set_updated_at on public.regional_talents;
create trigger regional_talents_set_updated_at
  before update on public.regional_talents
  for each row execute function public.set_updated_at();
