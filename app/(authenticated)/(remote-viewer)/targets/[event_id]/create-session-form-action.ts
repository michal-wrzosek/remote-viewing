"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { parse } from "qs";
import { z } from "zod";

const formSchema = z.object({
  event_id: z.string().min(1, "Event ID is required"),
  description: z.string().min(1, "Description is required"),
});

export async function createSession(
  _prevState: { success: boolean; message: string },
  formData: FormData
) {
  const supabase = await createClient();

  const getUserResults = await supabase.auth.getUser();
  if (getUserResults.error || !getUserResults.data?.user) {
    redirect("/auth/login");
  }

  const entries = Object.fromEntries(formData.entries());

  const stringEntries: Record<string, string> = Object.fromEntries(
    Object.entries(entries).map(([k, v]) => [k, String(v)])
  );

  const encoded = new URLSearchParams(stringEntries).toString();

  // Here you would parse the encoded data and insert it into your database
  // For example:
  const parsingResults = formSchema.safeParse(parse(encoded));

  if (parsingResults.success === false) {
    return {
      success: false,
      message: JSON.stringify(parsingResults.error),
    };
  }

  const { event_id, description } = parsingResults.data;

  const { error } = await supabase
    .from("event_sessions")
    .insert([
      {
        event_id,
        description,
        remote_viewer_id: getUserResults.data.user.id,
        remote_viewer_email: getUserResults.data.user.email,
      },
    ])
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: JSON.stringify(error),
    };
  }

  return {
    success: true,
    message: "Event session created successfully",
  };
}
