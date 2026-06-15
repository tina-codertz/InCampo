import type { AppSupabaseClient } from "@/lib/supabase";

type EngagementContext = {
  clerkId: string;
  client: AppSupabaseClient;
};

let engagementContext: EngagementContext | null = null;

export function setEngagementContext(context: EngagementContext | null) {
  engagementContext = context;
}

export function getEngagementContext() {
  return engagementContext;
}
