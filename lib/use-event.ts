import { useMemo } from "react";
import { useSupabaseData } from "./use-supabase-data";
import { SupabaseClient } from "@supabase/supabase-js";
import { Event } from "./types";

export const useEvent = ({ event_id }: { event_id?: string }) => {
  const fetch = useMemo(
    () =>
      event_id
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("events")
              .select(
                "id, created_at, owner_id, owner_email, name, description, remote_viewing_instructions"
              )
              .eq("id", event_id)
              .single()
        : undefined,
    [event_id]
  );

  return useSupabaseData<Event>({
    fetch,
  });
};
