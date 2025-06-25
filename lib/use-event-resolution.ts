import { SupabaseClient } from "@supabase/supabase-js";
import { useSupabaseData } from "./use-supabase-data";
import { useCallback } from "react";
import { EventResolution } from "./types";

export const useEventResolution = ({ event_id }: { event_id: string }) => {
  const fetch = useCallback(
    async (supabase: SupabaseClient) =>
      await supabase
        .from("event_resolutions")
        .select("id, created_at, event_id, event_outcome_id")
        .eq("event_id", event_id)
        .maybeSingle(),
    [event_id]
  );

  return useSupabaseData<Omit<EventResolution, "picture_base64">>({
    fetch,
  });
};

export const useEventResolutionWithPicture = ({
  event_id,
}: {
  event_id: string;
}) => {
  const fetch = useCallback(
    async (supabase: SupabaseClient) =>
      await supabase
        .from("event_resolutions")
        .select("id, created_at, event_id, event_outcome_id, picture_base64")
        .eq("event_id", event_id)
        .maybeSingle(),
    [event_id]
  );

  return useSupabaseData<EventResolution>({
    fetch,
  });
};
