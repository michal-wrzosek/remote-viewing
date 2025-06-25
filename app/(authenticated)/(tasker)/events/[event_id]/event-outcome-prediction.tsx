import { useEventOutcomePrediction } from "@/lib/use-event-outcome-prediction";
import { CreateEventOutcomePredictionForm } from "./create-event-outcome-prediction-form";
import { useEventOutcome } from "@/lib/use-event-outcome";
import { useCallback } from "react";
import dayjs from "dayjs";

function EventOutcomePredictionDetails({
  data,
}: {
  data: NonNullable<ReturnType<typeof useEventOutcomePrediction>["data"]>;
}) {
  const eventOutcome = useEventOutcome({ id: data.best_matching_outcome_id });

  if (eventOutcome.loading) {
    return <div>Loading best matching outcome...</div>;
  }

  if (eventOutcome.error) {
    return <div>Error loading best matching outcome: {eventOutcome.error}</div>;
  }

  if (!eventOutcome.data) {
    return <div>No matching outcome found.</div>;
  }

  return (
    <div>
      <div className="text-xs">
        {dayjs(data.created_at).format("DD.MM.YYYY HH:mm")}
      </div>
      <div className="text-2xl">
        Outcome prediction ({data.matching_percentage}% sure):{" "}
        {eventOutcome.data.description}
      </div>
    </div>
  );
}

export const EventOutcomePrediction = ({ event_id }: { event_id: string }) => {
  const eventOutcomePrediction = useEventOutcomePrediction({ event_id });

  const handleFormSuccess = useCallback(() => {
    eventOutcomePrediction.refetch();
  }, [eventOutcomePrediction]);

  if (eventOutcomePrediction.loading) {
    return <div>Loading prediction...</div>;
  }

  if (eventOutcomePrediction.error) {
    return <div>Error loading prediction: {eventOutcomePrediction.error}</div>;
  }

  return (
    <div className="border p-4 rounded-md border-muted-foreground">
      {eventOutcomePrediction.data ? (
        <EventOutcomePredictionDetails data={eventOutcomePrediction.data} />
      ) : (
        <CreateEventOutcomePredictionForm
          event_id={event_id}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};
