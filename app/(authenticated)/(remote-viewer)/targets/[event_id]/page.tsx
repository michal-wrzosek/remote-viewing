import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TargetClient } from "./client";

export default async function TargetPage({
  params,
}: {
  params: Promise<{ event_id: string }>;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { event_id } = await params;

  return <TargetClient event_id={event_id} />;
}
