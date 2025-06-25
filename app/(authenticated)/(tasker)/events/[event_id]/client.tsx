"use client";

import { EventResolution } from "./event-resolution";
import { useEvent } from "@/lib/use-event";
import dayjs from "dayjs";
import { useEventSessions } from "@/lib/use-event-sessions";
import { EventOutcomePrediction } from "./event-outcome-prediction";

function EventSessionsTable({
  eventSessions,
}: {
  className?: string;
  eventSessions: ReturnType<typeof useEventSessions>;
}) {
  if (eventSessions.loading) {
    return <div>Loading sessions...</div>;
  }

  if (eventSessions.error) {
    return <div>Error loading sessions: {eventSessions.error}</div>;
  }

  if (!eventSessions.data || eventSessions.data.length === 0) {
    return <div>No sessions found for this event.</div>;
  }

  return (
    <div className="border p-4 rounded-md border-muted-foreground">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Remote Viewer</th>
            <th className="text-left">Session submitted at</th>
          </tr>
        </thead>
        <tbody>
          {eventSessions.data.map((session) => (
            <tr key={session.id}>
              <td>{session.remote_viewer_email}</td>
              <td>{dayjs(session.created_at).format("DD.MM.YYYY HH:mm")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EventClient({ event_id }: { event_id: string }) {
  const event = useEvent({ event_id });
  const eventSessions = useEventSessions({ event_id });

  if (event.loading) {
    return <div>Loading...</div>;
  }

  if (event.error) {
    return <div>Error: {event.error}</div>;
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

      <EventSessionsTable eventSessions={eventSessions} />

      <div className="mb-4" />

      {eventSessions.data && eventSessions.data.length > 0 ? (
        <EventOutcomePrediction event_id={event_id} />
      ) : null}
      <div className="mb-4" />
      <EventResolution event_id={event_id} />
    </div>
  );
}
