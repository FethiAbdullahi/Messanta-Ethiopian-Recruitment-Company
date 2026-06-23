-- Super admin role, RLS, and role-change guard (run after initial migration)

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('trainee', 'employer', 'staff', 'admin', 'super_admin'));

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

grant execute on function public.is_super_admin() to authenticated;
grant execute on function public.is_super_admin() to anon;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;

create policy "profiles_select"
  on public.profiles for select
  using (auth.uid() = id or public.is_super_admin());

create policy "profiles_update"
  on public.profiles for update
  using (auth.uid() = id or public.is_super_admin());

create or replace function public.enforce_profile_role_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and old.role is distinct from new.role then
    -- Server-side service role updates have no JWT user; allow (trusted backend only)
    if auth.uid() is null then
      return new;
    end if;
    if not public.is_super_admin() then
      raise exception 'Only a super admin can change roles';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_role_guard on public.profiles;
create trigger profiles_role_guard
  before update on public.profiles
  for each row execute function public.enforce_profile_role_rules();

-- Let super admins read program enrollments from the client (optional; APIs also work)
drop policy if exists "enrollments_super_admin_read" on public.enrollments;
create policy "enrollments_super_admin_read"
  on public.enrollments for select
  using (public.is_super_admin());
