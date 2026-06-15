-- Migration: Clerk text ids -> Supabase Auth uuid user_id
-- Only run this if you already applied the older clerk_id schema.

alter table if exists public.profiles rename column clerk_id to user_id;
alter table if exists public.notifications rename column clerk_id to user_id;
alter table if exists public.announcement_likes rename column clerk_id to user_id;
alter table if exists public.bookmarks rename column clerk_id to user_id;
alter table if exists public.event_rsvps rename column clerk_id to user_id;
alter table if exists public.club_members rename column clerk_id to user_id;

-- Fresh installs should use schema.sql directly instead of this file.
