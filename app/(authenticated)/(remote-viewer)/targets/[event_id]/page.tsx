import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TargetClient } from "./client";

export default async function TargetPage({
  params,
}: {
  params: { event_id: string };
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return <TargetClient event_id={params.event_id} />;
}
