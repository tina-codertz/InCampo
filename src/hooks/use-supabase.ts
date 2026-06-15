import { useAuth } from "@clerk/clerk-expo";
import { useMemo } from "react";

import { createSupabaseClient } from "@/lib/supabase";
import type { AppSupabaseClient } from "@/lib/supabase";

async function getClerkAccessToken(
  getToken: ReturnType<typeof useAuth>["getToken"]
) {
  const supabaseToken = await getToken({ template: "supabase" });
  if (supabaseToken) {
    return supabaseToken;
  }

  return (await getToken()) ?? null;
}

export function useSupabase(): AppSupabaseClient {
  const { getToken, isSignedIn } = useAuth();

  return useMemo(
    () =>
      createSupabaseClient(async () => {
        if (!isSignedIn) {
          return null;
        }

        return getClerkAccessToken(getToken);
      }),
    [getToken, isSignedIn]
  );
}

export function useClerkUserId() {
  const { userId, isSignedIn } = useAuth();
  return isSignedIn ? userId : null;
}
