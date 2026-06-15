export const env = {
  clerkPublishableKey:
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
    process.env.EXPO_PUBLIC_CLERK_PUBLIC_KEY ??
    "",
  supabaseProjectId:
    process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID ??
    process.env["EXPO_PUBLIC_SUPABASE_PROJECT-ID"] ??
    "bcvonowwjiocomlwnmzb",
  supabaseUrl:
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID ?? process.env["EXPO_PUBLIC_SUPABASE_PROJECT-ID"] ?? "bcvonowwjiocomlwnmzb"}.supabase.co`,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
} as const;
