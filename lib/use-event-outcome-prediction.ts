import { SupabaseClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import { useSupabaseData } from "./use-supabase-data";
import { EventOutcomePrediction } from "./types";

export function useEventOutcomePrediction({ event_id }: { event_id?: string }) {
  const fetch = useMemo(
    () =>
      event_id
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("event_outcome_predictions")
              .select(
                "id, created_at, event_id, best_matching_outcome_id, matching_percentage"
              )
              .eq("event_id", event_id)
              .maybeSingle()
        : undefined,
    [event_id]
  );

  return useSupabaseData<EventOutcomePrediction>({
    fetch,
  });
}
