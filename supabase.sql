-- ============================================================================
--  GestDette — Supabase schema & security
--  Debt / seller management application
-- ============================================================================
--
--  APPLICATION ANALYSIS
--  --------------------
--  The app manages a shop owner's customers and the debts they owe.
--
--  Entities & relationships:
--    • auth.users .... Supabase-managed authentication (the shop admin).
--    • profiles ...... 1–1 with auth.users. Holds display name / username / role.
--                      A row is created automatically on sign-up (trigger).
--    • clients ....... The shop's customers. Belongs to one owner (the admin).
--    • products ...... What a client bought (name, description, price).
--                      Many products per client. total = SUM(price).
--    • payments ...... Money a client has paid. type = 'initial' (the first
--                      deposit made at creation) or 'payment' (later top-ups).
--                      paid = SUM(amount).  rest = total - paid.
--
--  Every business row carries owner_id = auth.uid() so Row Level Security
--  guarantees an admin only ever sees / edits their own data.
--
--  Single-admin flow: the app hides the "create admin" button once a profile
--  exists. It asks the DB via the SECURITY DEFINER function public.admin_exists()
--  (callable by anon, before login).
--
--  HOW TO INSTALL
--  --------------
--  1. Open Supabase → SQL Editor → paste this whole file → Run.
--  2. Auth → Providers → Email: turn OFF "Confirm email" so the admin can log
--     in immediately after sign-up (or leave it on and confirm by e-mail).
--  3. Done. Open the app and create the admin account.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. PROFILES  (one row per authenticated admin)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  username   text unique,
  email      text,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. CLIENTS
-- ---------------------------------------------------------------------------
create table if not exists public.clients (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  full_name  text not null,
  phone      text,
  address    text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. PRODUCTS  (items sold to a client)
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients (id) on delete cascade,
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  description text,
  price       numeric(14,2) not null default 0 check (price >= 0),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. PAYMENTS  (money received — 'initial' = deposit, 'payment' = top-up)
-- ---------------------------------------------------------------------------
create table if not exists public.payments (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients (id) on delete cascade,
  owner_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  amount     numeric(14,2) not null default 0 check (amount >= 0),
  type       text not null default 'payment' check (type in ('initial','payment')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. INDEXES
-- ---------------------------------------------------------------------------
create index if not exists idx_clients_owner   on public.clients  (owner_id);
create index if not exists idx_products_client on public.products (client_id);
create index if not exists idx_products_owner  on public.products (owner_id);
create index if not exists idx_payments_client on public.payments (client_id);
create index if not exists idx_payments_owner  on public.payments (owner_id);

-- ---------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.clients  enable row level security;
alter table public.products enable row level security;
alter table public.payments enable row level security;

-- profiles: a user only sees / edits their own profile row
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- clients / products / payments: full CRUD on rows you own
drop policy if exists clients_crud_own on public.clients;
create policy clients_crud_own on public.clients
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists products_crud_own on public.products;
create policy products_crud_own on public.products
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists payments_crud_own on public.payments;
create policy payments_crud_own on public.payments
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- 7. TRIGGER — create a profile row automatically on sign-up
--    Reads the metadata sent by the app: { full_name, username }.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- OPTIONAL single-admin lock: uncomment the 3 lines below to make the DB
  -- refuse any sign-up after the first admin exists (belt-and-braces on top of
  -- the UI hiding the button).
  -- if (select count(*) from public.profiles) >= 1 then
  --   raise exception 'Registration is closed: an administrator already exists.';
  -- end if;

  insert into public.profiles (id, full_name, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 8. RPC — admin_exists()  (does any admin already exist?)
--    Called by the app *before* login to hide the "create admin" button.
-- ---------------------------------------------------------------------------
create or replace function public.admin_exists()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles);
$$;

grant execute on function public.admin_exists() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 9. RPC — get_email_by_username()  (allow logging in with a username)
--    Resolves a username to its e-mail so the app can call signInWithPassword.
-- ---------------------------------------------------------------------------
create or replace function public.get_email_by_username(p_username text)
returns text
language sql
security definer
set search_path = public
as $$
  select email
  from public.profiles
  where lower(username) = lower(p_username)
  limit 1;
$$;

grant execute on function public.get_email_by_username(text) to anon, authenticated;

-- ============================================================================
--  OPTIONAL — seed demo data for the CURRENTLY LOGGED-IN admin.
--  Run this block from the SQL editor AFTER you have created your admin account
--  and while you are the only user, to populate a few example clients.
--  (The app also ships an offline "Demo account" button that needs no data.)
-- ============================================================================
-- do $$
-- declare me uuid := (select id from public.profiles order by created_at limit 1);
-- declare c uuid;
-- begin
--   insert into public.clients (owner_id, full_name, phone, address)
--     values (me, 'Ahmed Benali', '06 12 34 56 78', 'Rue Didouche Mourad, Alger')
--     returning id into c;
--   insert into public.products (client_id, owner_id, name, description, price) values
--     (c, me, 'Réfrigérateur', 'Modèle 300L, blanc', 62000),
--     (c, me, 'Micro-ondes',   '25L inox',           18000);
--   insert into public.payments (client_id, owner_id, amount, type) values
--     (c, me, 30000, 'initial'),
--     (c, me, 15000, 'payment');
-- end $$;
