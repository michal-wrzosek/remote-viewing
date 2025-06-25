import { useActionState, useEffect } from "react";
import { createEventOutcomePrediction } from "./create-event-outcome-prediction-action";
import { Button } from "@/components/ui/button";
import { useEventSessions } from "@/lib/use-event-sessions";

export function CreateEventOutcomePredictionForm({
  event_id,
  onSuccess,
}: {
  event_id: string;
  onSuccess?: () => void;
}) {
  const eventSessions = useEventSessions({ event_id });
  const [formState, formAction, pending] = useActionState(
    createEventOutcomePrediction,
    {
      success: false,
      message: "",
    }
  );

  useEffect(() => {
    if (formState.success) {
      onSuccess?.();
    }
  }, [formState.success, onSuccess]);

  if (eventSessions.loading) {
    return <div>Loading sessions...</div>;
  }

  if (eventSessions.error) {
    return <div>Error loading sessions: {eventSessions.error}</div>;
  }

  if (!eventSessions.data || eventSessions.data.length === 0) {
    return (
      <Button type="submit" disabled={true} className="w-full">
        {`Can't predict without sessions`}
      </Button>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="event_id" value={event_id} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending
          ? "Predicting..."
          : "Predict the outcome based on the sessions"}
      </Button>
      {formState.success ? (
        <p className="text-green-500">{formState.message}</p>
      ) : formState.message ? (
        <p className="text-red-500">{formState.message}</p>
      ) : null}
    </form>
  );
}
