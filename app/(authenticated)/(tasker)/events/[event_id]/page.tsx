import { createClient } from "@/lib/supabase/server";
import { EventClient } from "./client";
import { redirect } from "next/navigation";

export default async function EventPage({
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

  return <EventClient event_id={event_id} />;
}
