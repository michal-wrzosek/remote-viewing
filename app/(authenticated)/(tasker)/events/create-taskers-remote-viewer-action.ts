"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { parse } from "qs";
import z from "zod";

const formSchema = z.object({
  remote_viewer_email: z.string().email(),
});

export async function createTaskersRemoteViewer(
  prevState: { success: boolean; message: string; count: number },
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

  const parsingResults = formSchema.safeParse(parse(encoded));

  if (parsingResults.success === false) {
    return {
      success: false,
      message: parsingResults.error.message,
      count: prevState.count + 1,
    };
  }

  const { remote_viewer_email } = parsingResults.data;

  const { error } = await supabase
    .from("users_remote_viewers")
    .insert([{ user_id: getUserResults.data.user.id, remote_viewer_email }])
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
      count: prevState.count + 1,
    };
  }

  return {
    success: true,
    message: "Remote viewer created successfully",
    count: prevState.count + 1,
  };
}
