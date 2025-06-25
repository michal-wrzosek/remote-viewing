"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { parse } from "qs";
import z from "zod";

export async function deleteTaskersRemoteViewer(
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

  const parsingResults = z
    .object({ remote_viewer_email: z.string().email() })
    .safeParse(parse(encoded));

  if (parsingResults.success === false) {
    return {
      success: false,
      message: String(parsingResults.error),
    };
  }

  const { remote_viewer_email } = parsingResults.data;

  const { error } = await supabase
    .from("users_remote_viewers")
    .delete()
    .eq("user_id", getUserResults.data.user.id)
    .eq("remote_viewer_email", remote_viewer_email);

  if (error) {
    return {
      success: false,
      message: String(error),
    };
  }

  return {
    success: true,
    message: "Remote viewer deleted successfully",
  };
}
