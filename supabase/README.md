# Supabase setup for Incampo

## 1. Run the schema

In your Supabase project, open **SQL Editor** and run:

1. `supabase/schema.sql` — creates tables and RLS policies
2. `supabase/seed.sql` — inserts campus content and demo notifications

## 2. Connect Clerk to Supabase (recommended)

For authenticated reads/writes (profiles, likes, RSVPs, club joins):

1. In **Clerk Dashboard** → **JWT Templates**, create a template named `supabase`
2. Use Supabase's Clerk integration settings for the signing key / claims
3. In **Supabase Dashboard** → **Authentication** → **Providers**, enable third-party auth for Clerk

The app requests `getToken({ template: "supabase" })` first, then falls back to the default Clerk session token.

## 3. Environment variables

Ensure `.env` includes:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_SUPABASE_PROJECT_ID=your-project-id
```

Optional:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
```

## 4. Fallback behavior

If Supabase is not configured or tables are empty, the app automatically falls back to local mock data so development still works offline.

## 5. User-specific data

- Profiles are upserted on sign-in and when saving **Edit Profile**
- Likes, bookmarks, RSVPs, and club joins sync to Supabase when signed in
- Notifications with `clerk_id = null` in seed data are visible to all signed-in users (demo broadcast alerts)

To attach notifications to your account after seeding:

```sql
update public.notifications
set clerk_id = 'your_clerk_user_id'
where clerk_id is null;
```
