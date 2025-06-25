"use client";

import { useActionState, useEffect } from "react";
import { createEventResolution } from "./create-event-resolution-action";
import { useEventOutcomes } from "@/lib/use-event-outcomes";
import { Button } from "@/components/ui/button";

export const CreateEventResolutionForm = ({
  event_id,
  onSuccess,
}: {
  event_id: string;
  onSuccess?: () => void;
}) => {
  const eventOutcomes = useEventOutcomes({ event_id });

  const [state, formAction, pending] = useActionState(createEventResolution, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  if (eventOutcomes.loading) {
    return <p>Loading event outcomes...</p>;
  }

  if (eventOutcomes.error) {
    return <p>Error loading event outcomes: {eventOutcomes.error}</p>;
  }

  if (!eventOutcomes.data || eventOutcomes.data.length === 0) {
    return <p>No event outcomes available.</p>;
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="event_id" value={event_id} />
      {eventOutcomes.data.map((outcome) => (
        <label key={outcome.id} className="block mb-2">
          <input
            type="radio"
            name="event_outcome_id"
            value={outcome.id}
            className="mr-2"
          />
          {outcome.description}
        </label>
      ))}
      <Button type="submit" disabled={pending} className="w-full">
        {pending
          ? "Generating the picture..."
          : "Generate the picture for the real outcome"}
      </Button>
      {state.message && <p>{JSON.stringify(state.message)}</p>}
    </form>
  );
};
