-- ============================================================================
--  GestDette — MIGRATION : rendez-vous & alertes de paiement
--  (payment appointments & alerts)
--
--  HOW TO RUN
--  ----------
--  Open Supabase → SQL Editor → paste this WHOLE file → Run.
--  It is idempotent: running it twice is harmless.
--
--  WHAT IT ADDS
--  ------------
--  1. clients.appt_*  ......... per-client payment-reminder settings
--       appt_enabled ........... reminder on/off
--       appt_mode .............. 'interval'  = every N days after the last payment
--                                'fixed_day' = a fixed day of every month (1–28)
--       appt_interval_days ..... the N above (default 30)
--       appt_day_of_month ...... the fixed day above (default 1)
--  2. appointments ............ manual appointments (collect or give money,
--                                optionally linked to a client, date + hour)
--  3. Indexes + Row Level Security so each admin only sees their own rows.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Payment-reminder settings on clients
-- ---------------------------------------------------------------------------
alter table public.clients
  add column if not exists appt_enabled       boolean not null default false,
  add column if not exists appt_mode          text    not null default 'interval',
  add column if not exists appt_interval_days integer not null default 30,
  add column if not exists appt_day_of_month  integer not null default 1;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'clients_appt_mode_check') then
    alter table public.clients
      add constraint clients_appt_mode_check
      check (appt_mode in ('interval','fixed_day'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'clients_appt_interval_days_check') then
    alter table public.clients
      add constraint clients_appt_interval_days_check
      check (appt_interval_days > 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'clients_appt_day_of_month_check') then
    alter table public.clients
      add constraint clients_appt_day_of_month_check
      check (appt_day_of_month between 1 and 28);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Manual appointments
-- ---------------------------------------------------------------------------
create table if not exists public.appointments (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client_id    uuid references public.clients (id) on delete set null,
  title        text not null,
  description  text,
  direction    text not null default 'collect' check (direction in ('collect','give')),
  scheduled_at timestamptz not null,
  status       text not null default 'pending' check (status in ('pending','done','cancelled')),
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_appointments_owner  on public.appointments (owner_id);
create index if not exists idx_appointments_client on public.appointments (client_id);
create index if not exists idx_appointments_sched  on public.appointments (scheduled_at);

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.appointments enable row level security;

drop policy if exists appointments_crud_own on public.appointments;
create policy appointments_crud_own on public.appointments
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
