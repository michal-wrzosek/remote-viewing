import { useEventResolutionWithPicture } from "@/lib/use-event-resolution";
import { CreateEventResolutionForm } from "./create-event-resolution-form";
import { useCallback } from "react";

export function EventResolution({ event_id }: { event_id: string }) {
  const eventResolution = useEventResolutionWithPicture({ event_id });

  const handleFormSuccess = useCallback(() => {
    eventResolution.refetch();
  }, [eventResolution]);

  if (eventResolution.loading) {
    return <p>Loading event resolution...</p>;
  }

  if (eventResolution.error) {
    return <p>Error loading event resolution: {eventResolution.error}</p>;
  }

  return (
    <div className="border p-4 rounded-md border-muted-foreground">
      {eventResolution.data ? (
        <div>
          <img
            src={`data:image/png;base64,${eventResolution.data.picture_base64}`}
            alt="Event Resolution"
          />
        </div>
      ) : (
        <CreateEventResolutionForm
          event_id={event_id}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
