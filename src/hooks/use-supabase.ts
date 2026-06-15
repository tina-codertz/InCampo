import { getSupabaseClient } from "@/lib/supabase";
import { useAuth } from "@/providers/auth-provider";

export function useSupabase() {
  return getSupabaseClient();
}

export function useUserId() {
  const { userId } = useAuth();
  return userId;
}
