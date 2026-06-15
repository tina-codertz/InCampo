-- Incampo Supabase schema (Supabase Auth)
-- Run in Supabase SQL Editor, then run seed.sql

create extension if not exists "pgcrypto";

-- Profiles (linked to Supabase auth.users)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  username text not null default '',
  class_year text not null default '',
  major text not null default '',
  university text not null default '',
  bio text not null default '',
  avatar_color text not null default '#8B5CF6',
  post_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Campus announcements
create table if not exists public.announcements (
  id text primary key,
  author_name text not null,
  author_initials text not null,
  author_color text not null default '#8B5CF6',
  is_urgent boolean not null default false,
  category text not null default 'Announcement',
  title text not null,
  body text not null,
  tags text[] not null default '{}',
  likes integer not null default 0,
  comments integer not null default 0,
  image_url text,
  created_at timestamptz not null default now()
);

-- Campus events
create table if not exists public.events (
  id text primary key,
  title text not null,
  category text not null,
  event_date text not null,
  event_time text not null,
  location text not null,
  attendees integer not null default 0,
  host text not null,
  description text not null,
  image_url text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Campus clubs
create table if not exists public.clubs (
  id text primary key,
  name text not null,
  category text not null,
  members integer not null default 0,
  description text not null,
  meeting_time text,
  location text,
  image_url text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- User notifications
create table if not exists public.notifications (
  id text primary key,
  user_id uuid references public.profiles (user_id) on delete cascade,
  type text not null check (type in ('like', 'reply', 'event', 'club')),
  title text not null,
  body text not null,
  section text not null default 'TODAY',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- User engagement tables
create table if not exists public.announcement_likes (
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  announcement_id text not null references public.announcements (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, announcement_id)
);

create table if not exists public.bookmarks (
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  content_type text not null check (content_type in ('announcement')),
  content_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, content_type, content_id)
);

create table if not exists public.event_rsvps (
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  event_id text not null references public.events (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

create table if not exists public.club_members (
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  club_id text not null references public.clubs (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, club_id)
);

-- Indexes
create index if not exists idx_announcements_created_at on public.announcements (created_at desc);
create index if not exists idx_events_created_at on public.events (created_at desc);
create index if not exists idx_clubs_created_at on public.clubs (created_at desc);
create index if not exists idx_notifications_user_id on public.notifications (user_id, created_at desc);

-- Updated_at trigger for profiles
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(
      new.raw_user_meta_data ->> 'username',
      split_part(new.email, '@', 1),
      ''
    )
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.clubs enable row level security;
alter table public.notifications enable row level security;
alter table public.announcement_likes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.club_members enable row level security;

-- Public read for campus content
drop policy if exists "Public read announcements" on public.announcements;
create policy "Public read announcements"
on public.announcements for select
using (true);

drop policy if exists "Public read events" on public.events;
create policy "Public read events"
on public.events for select
using (true);

drop policy if exists "Public read clubs" on public.clubs;
create policy "Public read clubs"
on public.clubs for select
using (true);

-- Profiles: users manage their own row
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
on public.profiles for select
using (user_id = auth.uid());

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
on public.profiles for insert
with check (user_id = auth.uid());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Notifications: user-scoped
drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications"
on public.notifications for select
using (user_id is null or user_id = auth.uid());

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
on public.notifications for update
using (user_id is null or user_id = auth.uid())
with check (user_id is null or user_id = auth.uid());

-- Engagement: user-scoped
drop policy if exists "Users manage own likes" on public.announcement_likes;
create policy "Users manage own likes"
on public.announcement_likes for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users manage own bookmarks" on public.bookmarks;
create policy "Users manage own bookmarks"
on public.bookmarks for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users manage own rsvps" on public.event_rsvps;
create policy "Users manage own rsvps"
on public.event_rsvps for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users manage own club memberships" on public.club_members;
create policy "Users manage own club memberships"
on public.club_members for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
