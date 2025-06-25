"use server";

import { parse } from "qs";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import z from "zod";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  remote_viewing_instructions: z
    .string()
    .min(1, "Remote viewing instructions are required"),
  outcomes: z
    .array(
      z.object({
        description: z.string().min(1, "Outcome description is required"),
      })
    )
    .min(2, "At least 2 outcomes are required"),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEvent(_prevState: unknown, formData: FormData) {
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

  console.log("parsingResults", parsingResults);

  if (parsingResults.success === false) {
    return { success: false, message: String(parsingResults.error) };
  }

  const { name, description, remote_viewing_instructions, outcomes } =
    parsingResults.data;

  const pictureDescriptionsSchema = z.object({
    pictureDescriptions: z.array(z.string().min(350)).length(outcomes.length),
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
        content: `Generate for me ${outcomes.length} photo descriptions (photo prompts) that will later be used by DALL-E. These picture descriptions are going to be used for Associative Remote Viewing session, so it's very important that these descriptions are lengthy, very very detailed, and that they are as different from each other as possible. We want to be easily able to distinguish between them, so keep every photo about something completely different. Make sure the prompts are for realistic looking photographs.`,
      },
    ],
    text: {
      format: zodTextFormat(pictureDescriptionsSchema, "pictureDescriptions"),
    },
  });

  const { pictureDescriptions } = openaiResponse.output_parsed!;

  const eventsInsertResults = await supabase
    .from("events")
    .insert([
      {
        name,
        description,
        remote_viewing_instructions,
        owner_id: getUserResults.data.user.id,
        owner_email: getUserResults.data.user.email,
      },
    ])
    .select();

  if (eventsInsertResults.error) {
    console.error("Error inserting event:", eventsInsertResults.error);
    return { success: false, message: "Failed to create event." };
  }

  const eventOutcomesInsertResults = await supabase
    .from("event_outcomes")
    .insert(
      outcomes.map((outcome, index) => ({
        event_id: eventsInsertResults.data[0].id,
        description: outcome.description,
        picture_description: pictureDescriptions[index],
      }))
    )
    .select();

  if (eventOutcomesInsertResults.error) {
    console.error(
      "Error inserting event outcomes:",
      eventOutcomesInsertResults.error
    );
    return { success: false, message: "Failed to create event outcomes." };
  }

  return { success: true, message: "Event created!" };
}
