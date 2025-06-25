import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { UsersRemoteViewersClient } from "./client";

export default async function UsersRemoteViewersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return <UsersRemoteViewersClient />;
}
