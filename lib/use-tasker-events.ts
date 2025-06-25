import { useMemo } from "react";
import { useSupabaseData } from "./use-supabase-data";
import { SupabaseClient } from "@supabase/supabase-js";
import { Event } from "./types";

export const useTaskerEvents = ({ owner_id }: { owner_id?: string }) => {
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
              .order("created_at", { ascending: false })
        : undefined,
    [owner_id]
  );

  return useSupabaseData<Event[]>({
    fetch,
  });
};

export const useRemoteViewerEvents = ({
  remote_viewer_email,
}: {
  remote_viewer_email: string;
}) => {
  const fetch = useMemo(
    () =>
      remote_viewer_email
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("events")
              .select(
                "id, created_at, owner_id, owner_email, name, description, remote_viewing_instructions"
              )
              .eq("remote_viewer_email", remote_viewer_email)
              .order("created_at", { ascending: false })
        : undefined,
    [remote_viewer_email]
  );

  return useSupabaseData<Event[]>({
    fetch,
  });
};
