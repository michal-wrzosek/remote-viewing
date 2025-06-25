import { useMemo } from "react";
import { useSupabaseData } from "./use-supabase-data";
import { SupabaseClient } from "@supabase/supabase-js";
import { Event } from "./types";

export const useEvents = ({ owner_id }: { owner_id?: string }) => {
  const fetch = useMemo(
    () =>
      owner_id
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("events")
              .select(
                "id, created_at, owner_id, owner_email, name, description, remote_viewing_instructions"
              )
              .eq("owner_id", owner_id)
        : undefined,
    [owner_id]
  );

  return useSupabaseData<Event[]>({
    fetch,
  });
};

export const useTaskersEvents = ({ tasker_ids }: { tasker_ids?: string[] }) => {
  const fetch = useMemo(
    () =>
      tasker_ids
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("events")
              .select(
                "id, created_at, owner_id, owner_email, name, description, remote_viewing_instructions"
              )
              .in("owner_id", tasker_ids)
        : undefined,
    [tasker_ids]
  );

  return useSupabaseData<Event[]>({
    fetch,
  });
};
