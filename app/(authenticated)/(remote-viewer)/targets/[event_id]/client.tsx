"use client";

import dayjs from "dayjs";
import { CreateSessionForm } from "./create-session-form";
import { useEventResolutionWithPicture } from "@/lib/use-event-resolution";
import { useRemoteViewerEventSession } from "@/lib/use-remote-viewer-event-session";
import { useUser } from "@/lib/use-user";
import { useEvent } from "@/lib/use-event";

export const TargetClient = ({ event_id }: { event_id: string }) => {
  const event = useEvent({ event_id });
  const user = useUser();
  const eventSession = useRemoteViewerEventSession({
    event_id,
    remote_viewer_id: user.data?.user?.id,
  });
  const eventResolution = useEventResolutionWithPicture({ event_id });

  if (event.loading || eventSession.loading || eventResolution.loading) {
    return <div>Loading...</div>;
  }

  if (!event.data) {
    return <div>Error: Event not found</div>;
  }

  return (
    <div>
      <div className="text-center">Target ID</div>
      <div className="text-center text-6xl font-bold mb-4">
        {event.data.id.split("-")[0]}
      </div>
      <div className="text-xs">
        {dayjs(event.data.created_at).format("DD.MM.YYYY HH:mm")}
      </div>
      <div className="text-xs mb-4">{event.data.owner_email}</div>
      <div className="text-2xl mb-4">
        {event.data.remote_viewing_instructions}
      </div>
      <div className="border border-foreground rounded-md p-4 mb-4">
        {eventSession.data ? (
          <>
            <div className="text-xs">
              {dayjs(eventSession.data.created_at).format("DD.MM.YYYY HH:mm")}
            </div>
            <div className="text-xs mb-4">
              {eventSession.data.remote_viewer_email}
            </div>
            <div className="text-2xl">{eventSession.data.description}</div>
          </>
        ) : (
          <CreateSessionForm
            event_id={event_id}
            onSuccess={() => eventSession.refetch()}
          />
        )}
      </div>
      {eventResolution.data ? (
        <div className="border border-foreground rounded-md p-4">
          <div className="text-xs mb-2">
            {dayjs(eventResolution.data.created_at).format("DD.MM.YYYY HH:mm")}
          </div>
          <img
            src={`data:image/png;base64,${eventResolution.data.picture_base64}`}
            alt="Event Resolution"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      ) : null}
    </div>
  );
};
