-- Repair: auth.users without a profiles row (e.g. after manual DELETE from profiles)
insert into public.profiles (id, full_name, role)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  case
    when lower(trim(u.email)) = lower(trim('skillsforlifeethio@gmail.com')) then 'super_admin'
    else 'trainee'
  end
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;
