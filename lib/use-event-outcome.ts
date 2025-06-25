import { SupabaseClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import { useSupabaseData } from "./use-supabase-data";
import { EventOutcome } from "./types";

export function useEventOutcome({ id }: { id?: string }) {
  const fetch = useMemo(
    () =>
      id
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("event_outcomes")
              .select(
                "id, created_at, event_id, description, picture_description"
              )
              .eq("id", id)
              .single()
        : undefined,
    [id]
  );

  return useSupabaseData<EventOutcome>({
    fetch,
  });
}
