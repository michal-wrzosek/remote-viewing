import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TargetsClient } from "./client";

export default async function TargetsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return <TargetsClient />;
}
