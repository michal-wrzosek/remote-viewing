"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { parse } from "qs";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import OpenAI from "openai";

const formSchema = z.object({
  event_id: z.string().min(1, "Event ID is required"),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEventOutcomePrediction(
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

  const { event_id } = parsingResults.data;

  const eventSessionsResponse = await supabase
    .from("event_sessions")
    .select("remote_viewer_email, description")
    .eq("event_id", event_id);

  if (eventSessionsResponse.error) {
    return {
      success: false,
      message: JSON.stringify(eventSessionsResponse.error),
    };
  }

  if (eventSessionsResponse.data.length === 0) {
    return {
      success: false,
      message: "No event sessions found for the specified event ID",
    };
  }

  const eventOutcomesResponse = await supabase
    .from("event_outcomes")
    .select("id, picture_description")
    .eq("event_id", event_id);

  if (eventOutcomesResponse.error) {
    return {
      success: false,
      message: JSON.stringify(eventOutcomesResponse.error),
    };
  }

  if (eventOutcomesResponse.data.length < 2) {
    return {
      success: false,
      message: "Not enough event outcomes found for the specified event ID",
    };
  }

  const eventOutcomePredictionSchema = z.object({
    bestMatchingPictureId: z.string(),
    matchingPercentage: z.number().min(0).max(100),
  });

  const openaiResponse = await openai.responses.parse({
    model: "gpt-4o",
    input: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: `As part of an Associative Remote Viewing project, I need you to analyze the following RV sessions. Based on the reported descriptions (they may be reported in different languages, like Polish for example, so don't be surprised). Pick the picture most matching the sessions. Also, provide the matching percentage (0-100).
        
        Remote Viewer Sessions:
        ${eventSessionsResponse.data
          .map(
            (session) =>
              `remote viewer: "${session.remote_viewer_email}" description: "${session.description}`
          )
          .join("\n")}"
        
        Picture Descriptions:
        ${eventOutcomesResponse.data
          .map(
            (outcome) =>
              `id: "${outcome.id}" description: "${outcome.picture_description}`
          )
          .join("\n")}"`,
      },
    ],
    text: {
      format: zodTextFormat(
        eventOutcomePredictionSchema,
        "pictureDescriptions"
      ),
    },
  });

  console.log("openaiResponse", openaiResponse.output_parsed);

  const { bestMatchingPictureId, matchingPercentage } =
    openaiResponse.output_parsed!;

  const insertResponse = await supabase
    .from("event_outcome_predictions")
    .insert({
      event_id,
      best_matching_outcome_id: bestMatchingPictureId,
      matching_percentage: matchingPercentage,
    });

  if (insertResponse.error) {
    return {
      success: false,
      message: JSON.stringify(insertResponse.error),
    };
  }

  return {
    success: true,
    message: "Event outcome prediction created successfully",
  };
}
