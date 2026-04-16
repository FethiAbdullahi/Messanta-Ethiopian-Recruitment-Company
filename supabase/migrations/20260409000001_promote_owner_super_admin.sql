-- Primary owner: super_admin role for this email (no-op if user does not exist yet)
update public.profiles p
set role = 'super_admin'
from auth.users u
where p.id = u.id
  and lower(trim(u.email)) = lower(trim('skillsforlifeethio@gmail.com'));
