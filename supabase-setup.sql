-- ============================================================
-- Clifden Beauty & Laser Clinic — Supabase Database Setup
-- Run this entire script in the Supabase SQL Editor
-- ============================================================


-- ──────────────────────────────────────────────────────────────
-- 1. PROFILES TABLE
--    Mirrors auth.users 1-to-1. Stores customer name & phone.
-- ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name  text not null default '',
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ──────────────────────────────────────────────────────────────
-- 2. BOOKINGS TABLE
-- ──────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  first_name           text not null,
  last_name            text,
  email                text not null,
  phone                text,
  treatment            text not null,
  message              text,
  status               text not null default 'awaiting_payment'
                         check (status in ('awaiting_payment','confirmed','completed','cancelled')),
  deposit_amount_cents integer,
  stripe_session_id    text,
  booked_at            timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);


-- ──────────────────────────────────────────────────────────────
-- 3. TRIGGER: keep updated_at current
-- ──────────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_booking_updated
  before update on public.bookings
  for each row execute procedure public.handle_updated_at();


-- ──────────────────────────────────────────────────────────────
-- 4. TRIGGER: auto-create profile row on new user signup
--    Seeds first_name / last_name / phone from signup metadata.
-- ──────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name',  ''),
    (new.raw_user_meta_data->>'phone')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ──────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.bookings  enable row level security;

-- Profiles: users can only read and update their own row
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Bookings: users can only read and insert their own rows
create policy "bookings: select own"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "bookings: insert own"
  on public.bookings for insert
  with check (auth.uid() = user_id);

-- Bookings: users can update their own rows (e.g. cancel)
create policy "bookings: update own"
  on public.bookings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- NOTE: The Stripe webhook uses the service_role key which bypasses RLS.
-- No special policy needed for webhook status updates.


-- ──────────────────────────────────────────────────────────────
-- MIGRATION: Enhanced booking fields
-- Run this section after the initial setup if upgrading.
-- ──────────────────────────────────────────────────────────────
alter table public.bookings
  add column if not exists professional             text,
  add column if not exists appointment_date         date,
  add column if not exists treatment_amount_cents   integer,
  add column if not exists patch_test_acknowledged  boolean not null default false;

-- NOTE: The `treatment` column now stores a JSON-stringified array of service names.
-- Example value: '["Eyebrow Shape & Tint","Lash Lift"]'
