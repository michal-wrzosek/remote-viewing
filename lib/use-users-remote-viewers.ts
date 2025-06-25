import { SupabaseClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import { useSupabaseData } from "./use-supabase-data";
import { UserRemoteViewer } from "./types";

export function useTaskersRemoteViewers({ tasker_id }: { tasker_id?: string }) {
  const fetch = useMemo(
    () =>
      tasker_id
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("users_remote_viewers")
              .select("user_id, remote_viewer_email, created_at")
              .eq("user_id", tasker_id)
              .order("created_at", { ascending: false })
        : undefined,
    [tasker_id]
  );

  return useSupabaseData<UserRemoteViewer[]>({ fetch });
}

export function useRemoteViewersTaskers({
  remote_viewer_email,
}: {
  remote_viewer_email?: string;
}) {
  const fetch = useMemo(
    () =>
      remote_viewer_email
        ? async (supabase: SupabaseClient) =>
            await supabase
              .from("users_remote_viewers")
              .select("user_id, remote_viewer_email, created_at")
              .eq("remote_viewer_email", remote_viewer_email)
              .order("created_at", { ascending: false })
        : undefined,
    [remote_viewer_email]
  );

  return useSupabaseData<UserRemoteViewer[]>({ fetch });
}
