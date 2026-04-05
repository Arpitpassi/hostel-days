-- ============================================================
-- HOSTEL DAYS 2026 — Complete Supabase SQL Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. ENABLE EXTENSIONS ────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ── 2. TABLES ───────────────────────────────────────────────

-- Profiles (mirrors auth.users, stores admin flag)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Categories (Cricket, Football, Dance, etc.)
create table if not exists public.categories (
  id serial primary key,
  name text unique not null,
  type text not null check (type in ('sports', 'cultural'))
);

-- Games / Matches (heart of real-time)
create table if not exists public.games (
  id serial primary key,
  day integer not null check (day between 1 and 5),
  start_time timestamptz,
  category_id integer references public.categories(id) on delete set null,
  event_name text not null,
  team_a text not null,
  team_b text not null,
  score_a integer not null default 0 check (score_a >= 0),
  score_b integer not null default 0 check (score_b >= 0),
  status text not null default 'upcoming'
    check (status in ('upcoming', 'live', 'completed')),
  winner text,
  created_at timestamptz not null default now()
);

-- Announcements (info page)
create table if not exists public.announcements (
  id serial primary key,
  title text,
  body text,
  created_at timestamptz not null default now()
);

-- Indexes for common query patterns
create index if not exists idx_games_day on public.games(day);
create index if not exists idx_games_status on public.games(status);
create index if not exists idx_games_category on public.games(category_id);
create index if not exists idx_games_day_status on public.games(day, status);


-- ── 3. ROW LEVEL SECURITY ───────────────────────────────────

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.games enable row level security;
alter table public.announcements enable row level security;


-- ── PROFILES policies ──────────────────────────────────────

-- Anyone can read profiles (needed for public leaderboards if added later)
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

-- Users can only insert/update their own profile
create policy "profiles_self_insert"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id);


-- ── CATEGORIES policies ────────────────────────────────────

-- Public read
create policy "categories_public_read"
  on public.categories for select
  using (true);

-- Only admins can mutate
create policy "categories_admin_write"
  on public.categories for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );


-- ── GAMES policies ─────────────────────────────────────────

-- Public can read all games (required for live scores page)
create policy "games_public_read"
  on public.games for select
  using (true);

-- Only admins can insert
create policy "games_admin_insert"
  on public.games for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Only admins can update
create policy "games_admin_update"
  on public.games for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Only admins can delete
create policy "games_admin_delete"
  on public.games for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );


-- ── ANNOUNCEMENTS policies ─────────────────────────────────

create policy "announcements_public_read"
  on public.announcements for select
  using (true);

create policy "announcements_admin_write"
  on public.announcements for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );


-- ── 4. AUTO-CREATE PROFILE TRIGGER ─────────────────────────

-- Automatically creates a profile row when a user signs up
-- Also grants admin if their email is in the allowed list
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  admin_emails text[] := array[
    'admin1@college.edu',
    'admin2@college.edu',
    'admin3@college.edu',
    'admin4@college.edu',
    'admin5@college.edu'
    -- ↑ Replace with your actual 5 admin email addresses
  ];
begin
  insert into public.profiles (id, full_name, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email = any(admin_emails)
  )
  on conflict (id) do update
    set is_admin = new.email = any(admin_emails);

  return new;
end;
$$;

-- Attach trigger to auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 5. ENABLE REALTIME ─────────────────────────────────────
-- Only enable on the games table to minimize bandwidth

-- Add games table to realtime publication
alter publication supabase_realtime add table public.games;

-- (Optional) also enable for announcements so info page updates live
alter publication supabase_realtime add table public.announcements;


-- ── 6. SEED: CATEGORIES ────────────────────────────────────

insert into public.categories (name, type) values
  ('Cricket',       'sports'),
  ('Football',      'sports'),
  ('Basketball',    'sports'),
  ('Volleyball',    'sports'),
  ('Badminton',     'sports'),
  ('Table Tennis',  'sports'),
  ('Tug of War',    'sports'),
  ('Athletics',     'sports'),
  ('Dance',         'cultural'),
  ('Singing',       'cultural'),
  ('Drama',         'cultural'),
  ('Music',         'cultural'),
  ('Art',           'cultural'),
  ('Debate',        'cultural'),
  ('Quiz',          'cultural'),
  ('Fashion',       'cultural')
on conflict (name) do nothing;


-- ── 7. SEED: GAMES (25 sample games across 5 days) ─────────

-- Helper: set FESTIVAL_START to your actual festival start date
-- All times are in IST (UTC+5:30), stored as UTC

do $$
declare
  festival_start date := '2026-03-10';  -- ← Change to your start date
  cricket_id int;
  football_id int;
  basketball_id int;
  volleyball_id int;
  badminton_id int;
  tt_id int;
  tug_id int;
  athletics_id int;
  dance_id int;
  singing_id int;
  drama_id int;
  music_id int;
  art_id int;
  debate_id int;
  quiz_id int;
  fashion_id int;
begin
  select id into cricket_id    from public.categories where name = 'Cricket';
  select id into football_id   from public.categories where name = 'Football';
  select id into basketball_id from public.categories where name = 'Basketball';
  select id into volleyball_id from public.categories where name = 'Volleyball';
  select id into badminton_id  from public.categories where name = 'Badminton';
  select id into tt_id         from public.categories where name = 'Table Tennis';
  select id into tug_id        from public.categories where name = 'Tug of War';
  select id into athletics_id  from public.categories where name = 'Athletics';
  select id into dance_id      from public.categories where name = 'Dance';
  select id into singing_id    from public.categories where name = 'Singing';
  select id into drama_id      from public.categories where name = 'Drama';
  select id into music_id      from public.categories where name = 'Music';
  select id into art_id        from public.categories where name = 'Art';
  select id into debate_id     from public.categories where name = 'Debate';
  select id into quiz_id       from public.categories where name = 'Quiz';
  select id into fashion_id    from public.categories where name = 'Fashion';

  -- DAY 1 — Opening Ceremony + warm-up games
  insert into public.games (day, start_time, category_id, event_name, team_a, team_b, score_a, score_b, status, winner) values
  (1, (festival_start + interval '9 hours 30 minutes')::timestamptz,  football_id,   'Football – Group A',    'Ashoka Block',  'Birla Block',  2, 1, 'completed', 'Ashoka Block'),
  (1, (festival_start + interval '11 hours 00 minutes')::timestamptz, basketball_id, 'Basketball – Pool A',   'CVR Hostel',    'LBS Hall',     45, 38, 'completed', 'CVR Hostel'),
  (1, (festival_start + interval '14 hours 00 minutes')::timestamptz, dance_id,      'Group Dance – Round 1', 'Kaveri Block',  'Godavari Block', 78, 82, 'completed', 'Godavari Block'),
  (1, (festival_start + interval '16 hours 00 minutes')::timestamptz, quiz_id,       'General Quiz – Round 1','Narmada Hall',  'Brahmaputra Block', 35, 28, 'completed', 'Narmada Hall'),
  (1, (festival_start + interval '18 hours 30 minutes')::timestamptz, singing_id,    'Solo Singing – Heat 1', 'Ravi Shankar',  'Priya Menon',  72, 68, 'completed', 'Ravi Shankar');

  -- DAY 2 — Sports Fiesta
  insert into public.games (day, start_time, category_id, event_name, team_a, team_b, score_a, score_b, status, winner) values
  (2, (festival_start + 1 + interval '8 hours 00 minutes')::timestamptz,  cricket_id,   'Cricket T10 – Group A',  'Ashoka Block',  'CVR Hostel',   67, 72, 'completed', 'CVR Hostel'),
  (2, (festival_start + 1 + interval '9 hours 30 minutes')::timestamptz,  volleyball_id,'Volleyball – Pool A',    'LBS Hall',      'Kaveri Block', 2,  1,  'completed', 'LBS Hall'),
  (2, (festival_start + 1 + interval '11 hours 00 minutes')::timestamptz, badminton_id, 'Badminton – Men Singles', 'Arjun Patel',   'Kunal Sharma', 2,  1,  'completed', 'Arjun Patel'),
  (2, (festival_start + 1 + interval '14 hours 00 minutes')::timestamptz, football_id,  'Football – Group B',     'Narmada Hall',  'Godavari Block',1,  1,  'completed', null),
  (2, (festival_start + 1 + interval '16 hours 00 minutes')::timestamptz, tug_id,       'Tug of War – Boys',      'Ashoka Block',  'Birla Block',  0,  0,  'upcoming',  null),
  (2, (festival_start + 1 + interval '17 hours 30 minutes')::timestamptz, athletics_id, '100m Sprint – Men',      'Rahul Singh',   'Aditya Kumar', 0,  0,  'upcoming',  null);

  -- DAY 3 — Cultural Night
  insert into public.games (day, start_time, category_id, event_name, team_a, team_b, score_a, score_b, status, winner) values
  (3, (festival_start + 2 + interval '10 hours 00 minutes')::timestamptz, art_id,       'Poster Making',          'Kaveri Block',  'Brahmaputra Block', 0, 0, 'upcoming', null),
  (3, (festival_start + 2 + interval '11 hours 30 minutes')::timestamptz, debate_id,    'Debate – Semi Final',    'CVR Hostel',    'LBS Hall',     0,  0,  'upcoming',  null),
  (3, (festival_start + 2 + interval '14 hours 00 minutes')::timestamptz, drama_id,     'One Act Play',           'Ashoka Block',  'Narmada Hall', 0,  0,  'upcoming',  null),
  (3, (festival_start + 2 + interval '16 hours 00 minutes')::timestamptz, music_id,     'Band Performance',       'The Acoustics', 'Bass Drop',    0,  0,  'upcoming',  null),
  (3, (festival_start + 2 + interval '18 hours 00 minutes')::timestamptz, fashion_id,   'Hostel Fashion Walk',    'Kaveri Block',  'Godavari Block', 0, 0,  'upcoming',  null),
  (3, (festival_start + 2 + interval '20 hours 00 minutes')::timestamptz, dance_id,     'Group Dance – Semi Final','Ashoka Block', 'CVR Hostel',   0,  0,  'upcoming',  null);

  -- DAY 4 — Grand Showdown
  insert into public.games (day, start_time, category_id, event_name, team_a, team_b, score_a, score_b, status, winner) values
  (4, (festival_start + 3 + interval '9 hours 00 minutes')::timestamptz,  cricket_id,   'Cricket T10 – Semi Final','CVR Hostel',   'LBS Hall',     0,  0,  'upcoming',  null),
  (4, (festival_start + 3 + interval '11 hours 00 minutes')::timestamptz, basketball_id,'Basketball – Semi Final', 'Ashoka Block', 'Narmada Hall', 0,  0,  'upcoming',  null),
  (4, (festival_start + 3 + interval '13 hours 00 minutes')::timestamptz, football_id,  'Football – Semi Final',  'Ashoka Block',  'LBS Hall',     0,  0,  'upcoming',  null),
  (4, (festival_start + 3 + interval '15 hours 30 minutes')::timestamptz, tt_id,        'TT – Men Doubles Final', 'Kaveri Block',  'CVR Hostel',   0,  0,  'upcoming',  null),
  (4, (festival_start + 3 + interval '17 hours 00 minutes')::timestamptz, singing_id,   'Solo Singing – Grand Final','Top 2 Teams','', 0,  0,  'upcoming',  null);

  -- DAY 5 — Finals & Closing
  insert into public.games (day, start_time, category_id, event_name, team_a, team_b, score_a, score_b, status, winner) values
  (5, (festival_start + 4 + interval '9 hours 30 minutes')::timestamptz,  cricket_id,   'Cricket T10 – FINAL',    'TBD',           'TBD',          0,  0,  'upcoming',  null),
  (5, (festival_start + 4 + interval '11 hours 00 minutes')::timestamptz, football_id,  'Football – FINAL',       'TBD',           'TBD',          0,  0,  'upcoming',  null),
  (5, (festival_start + 4 + interval '14 hours 00 minutes')::timestamptz, dance_id,     'Group Dance – GRAND FINAL','TBD',         'TBD',          0,  0,  'upcoming',  null),
  (5, (festival_start + 4 + interval '16 hours 30 minutes')::timestamptz, basketball_id,'Basketball – FINAL',     'TBD',           'TBD',          0,  0,  'upcoming',  null),
  (5, (festival_start + 4 + interval '19 hours 00 minutes')::timestamptz, drama_id,     'Overall Champions – Felicitation', 'All Hostels', '-', 0, 0, 'upcoming', null);

end $$;


-- ── 8. SEED: SAMPLE ANNOUNCEMENTS ──────────────────────────

insert into public.announcements (title, body) values
  ('Welcome to Hostel Days 2026! 🎉', 'The biggest inter-hostel festival is here. 5 days, 25+ events, one champion. May the best batch win!'),
  ('Cricket & Football venues confirmed', 'All cricket matches will be held at Main Ground. Football matches shifted to the rear ground due to maintenance.'),
  ('Timetable Update – Day 2', 'Badminton Mixed Doubles added to Day 2 afternoon slot. Check the full schedule page.'),
  ('Registration Deadline Reminder', 'Last date for cultural event entries is tonight 10 PM. Contact coordinators immediately.');


-- ── 9. HELPER: Grant admin manually ────────────────────────
-- Run this after a user signs up to manually promote them:
--
-- update public.profiles
-- set is_admin = true
-- where id = (
--   select id from auth.users where email = 'admin@college.edu'
-- );


-- ── 10. VERIFY ──────────────────────────────────────────────
-- Run these to verify setup:
-- select count(*) from public.games;         -- should be 25
-- select count(*) from public.categories;    -- should be 16
-- select count(*) from public.announcements; -- should be 4
-- select * from public.games where status = 'completed' limit 5;
