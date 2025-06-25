import { SupabaseClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import { useSupabaseData } from "./use-supabase-data";
import { EventSession } from "./types";

export function useRemoteViewerEventSession({
  event_id,
  remote_viewer_id,
}: {
  event_id?: string;
  remote_viewer_id?: string;
}) {
  const fetch = useMemo(
    () =>
      event_id && remote_viewer_id
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("event_sessions")
              .select(
                "id, created_at, description, event_id, remote_viewer_id, remote_viewer_email"
              )
              .eq("event_id", event_id)
              .eq("remote_viewer_id", remote_viewer_id)
              .maybeSingle()
        : undefined,
    [event_id, remote_viewer_id]
  );

  return useSupabaseData<EventSession>({ fetch });
}
