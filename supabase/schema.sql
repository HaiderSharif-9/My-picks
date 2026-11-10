-- My Picks database setup
-- Run this file in Supabase SQL Editor.
-- 1) Create your admin user privately in Supabase Authentication > Users.
-- 2) Copy that user's UUID and replace YOUR_ADMIN_USER_UUID below.
-- 3) Run this SQL. Never expose the service_role key in the browser.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin'))
);

create table if not exists public.pins (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  affiliate_url text not null,
  category text not null default 'Everyday',
  price text,
  published boolean not null default true,
  click_count bigint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.pins enable row level security;

create policy "Admins can read own profile" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "Anyone can view published pins" on public.pins
  for select to anon, authenticated using (published = true or exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

create policy "Admins can add pins" on public.pins
  for insert to authenticated with check (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

create policy "Admins can update pins" on public.pins
  for update to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  )) with check (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

create policy "Admins can delete pins" on public.pins
  for delete to authenticated using (exists (
    select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
  ));

-- After creating your admin in Supabase Auth, run:
-- insert into public.profiles (id, role) values ('YOUR_ADMIN_USER_UUID', 'admin');

grant select on public.pins to anon, authenticated;
grant insert, update, delete on public.pins to authenticated;
grant select on public.profiles to authenticated;
