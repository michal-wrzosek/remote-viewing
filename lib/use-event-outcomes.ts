import { SupabaseClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import { useSupabaseData } from "./use-supabase-data";
import { EventOutcome } from "./types";

export function useEventOutcomes({ event_id }: { event_id?: string }) {
  const fetch = useMemo(
    () =>
      event_id
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("event_outcomes")
              .select(
                "id, created_at, event_id, description, picture_description"
              )
              .eq("event_id", event_id)
        : undefined,
    [event_id]
  );

  return useSupabaseData<EventOutcome[]>({
    fetch,
  });
}
