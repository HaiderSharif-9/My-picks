-- My Picks database setup
-- Create the owner's user privately in Supabase Authentication > Users.
-- Disable public sign-ups. Run this file in the Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin'))
);
create table if not exists public.pins (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text, image_url text not null, affiliate_url text not null,
  category text not null default 'Everyday', price text, published boolean not null default true,
  click_count bigint not null default 0, created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.pins enable row level security;

drop policy if exists "Admins can read own profile" on public.profiles;
create policy "Admins can read own profile" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "Anyone can view published pins" on public.pins;
create policy "Anyone can view published pins" on public.pins for select to anon, authenticated using (
  published = true or exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
drop policy if exists "Admins can add pins" on public.pins;
create policy "Admins can add pins" on public.pins for insert to authenticated with check (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
drop policy if exists "Admins can update pins" on public.pins;
create policy "Admins can update pins" on public.pins for update to authenticated using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
) with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
drop policy if exists "Admins can delete pins" on public.pins;
create policy "Admins can delete pins" on public.pins for delete to authenticated using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

create or replace function public.record_pin_click(pin_id uuid)
returns void language sql security definer set search_path = ''
as $$ update public.pins set click_count = click_count + 1 where id = pin_id and published = true; $$;
revoke all on function public.record_pin_click(uuid) from public;
grant execute on function public.record_pin_click(uuid) to anon, authenticated;
grant select on public.pins to anon, authenticated;
grant insert, update, delete on public.pins to authenticated;
grant select on public.profiles to authenticated;

-- After creating the admin user, insert their real Auth UUID:
-- insert into public.profiles (id, role) values ('YOUR_ADMIN_USER_UUID', 'admin');
