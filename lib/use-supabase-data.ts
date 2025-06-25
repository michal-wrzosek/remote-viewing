import {
  AuthError,
  PostgrestError,
  SupabaseClient,
} from "@supabase/supabase-js";
import { createClient } from "./supabase/client";
import { useData } from "./use-data";
import { useMemo } from "react";

export const useSupabaseData = <T>({
  fetch,
}: {
  fetch?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: SupabaseClient<any, "public", any>
  ) => Promise<{ data: T | null; error: PostgrestError | AuthError | null }>;
}): { data?: T; error?: string; loading: boolean; refetch: () => void } => {
  const fetchMemo = useMemo(
    () =>
      fetch
        ? async () => {
            const supabase = createClient();

            return await fetch(supabase);
          }
        : undefined,
    [fetch]
  );

  return useData({
    fetch: fetchMemo,
  });
};
