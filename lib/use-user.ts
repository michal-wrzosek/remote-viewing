import { SupabaseClient, User } from "@supabase/supabase-js";
import { useSupabaseData } from "./use-supabase-data";
import { useCallback } from "react";

export const useUser = () => {
  const fetch = useCallback(
    async (supabase: SupabaseClient) => await supabase.auth.getUser(),
    []
  );

  return useSupabaseData<{ user: User | null }>({
    fetch,
  });
};
