"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OpenAI from "openai";
import { parse } from "qs";
import { z } from "zod";

const formSchema = z.object({
  event_id: z.string().min(1, "Event ID is required"),
  event_outcome_id: z.string().min(1, "Event Outcome ID is required"),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEventResolution(
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

  const parsingResults = formSchema.safeParse(parse(encoded));

  if (parsingResults.success === false) {
    return {
      success: false,
      message: JSON.stringify(parsingResults.error),
    };
  }

  const { event_id, event_outcome_id } = parsingResults.data;

  const eventOutcomeResults = await supabase
    .from("event_outcomes")
    .select("picture_description")
    .eq("id", event_outcome_id)
    .single();

  if (eventOutcomeResults.error || !eventOutcomeResults.data) {
    return {
      success: false,
      message: JSON.stringify(eventOutcomeResults.error),
    };
  }

  const generatePictureResults = await openai.images.generate({
    model: "gpt-image-1",
    prompt: eventOutcomeResults.data.picture_description,
  });

  if (!generatePictureResults?.data?.[0]?.b64_json) {
    return {
      success: false,
      message: "Failed to generate picture",
    };
  }

  const eventResolutionResults = await supabase
    .from("event_resolutions")
    .insert([
      {
        event_id,
        event_outcome_id,
        picture_base64: generatePictureResults.data[0].b64_json,
      },
    ])
    .select()
    .single();

  if (eventResolutionResults.error) {
    return {
      success: false,
      message: JSON.stringify(eventResolutionResults.error),
    };
  }

  return {
    success: true,
    message: "Event session created successfully",
  };
}
