# Supabase setup for Incampo

## 1. Run the schema

In your Supabase project, open **SQL Editor** and run:

1. `supabase/schema.sql` — creates tables, auth trigger, and RLS policies
2. `supabase/seed.sql` — inserts campus content and demo notifications

## 2. Enable auth providers

In **Supabase Dashboard** → **Authentication** → **Providers**:

- Enable **Email** (email + password)
- Optional: enable **Google** for OAuth sign-in

For Google OAuth in Expo, add your app redirect URL from `makeRedirectUri()` to:

- Supabase → Authentication → URL Configuration → Redirect URLs
- Google Cloud Console → OAuth client → Authorized redirect URIs

## 3. Environment variables

Ensure `.env` includes:

```env
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

- Auth is handled entirely by **Supabase Auth**
- A `profiles` row is auto-created on signup via database trigger
- Likes, bookmarks, RSVPs, and club joins sync when signed in
- Notifications with `user_id = null` in seed data are visible to all signed-in users (demo broadcast alerts)

To attach notifications to your account after seeding:

```sql
update public.notifications
set user_id = 'your_supabase_user_uuid'
where user_id is null;
```
