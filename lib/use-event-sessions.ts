import { SupabaseClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import { useSupabaseData } from "./use-supabase-data";
import { EventSession } from "./types";

export function useEventSessions({ event_id }: { event_id?: string }) {
  const fetch = useMemo(
    () =>
      event_id
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("event_sessions")
              .select(
                "id, created_at, description, event_id, remote_viewer_id, remote_viewer_email"
              )
              .eq("event_id", event_id)
              .order("created_at", { ascending: false })
        : undefined,
    [event_id]
  );

  return useSupabaseData<EventSession[]>({ fetch });
}
