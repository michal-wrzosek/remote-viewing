"use client";

import { Button } from "@/components/ui/button";
import { useEventResolution } from "@/lib/use-event-resolution";
import { useTaskersEvents } from "@/lib/use-events";
import { useRemoteViewerEventSession } from "@/lib/use-remote-viewer-event-session";
import { useUser } from "@/lib/use-user";
import { useRemoteViewersTaskers } from "@/lib/use-users-remote-viewers";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";

const EventResolutionDate = ({ event_id }: { event_id: string }) => {
  const eventResolution = useEventResolution({ event_id });

  if (eventResolution.loading) {
    return "Loading...";
  }

  if (eventResolution.error) {
    return "Error loading resolution date";
  }

  return eventResolution.data
    ? dayjs(eventResolution.data.created_at).format("DD.MM.YYYY HH:mm")
    : "-";
};

const EventActions = ({ event_id }: { event_id: string }) => {
  const user = useUser();
  const eventSession = useRemoteViewerEventSession({
    event_id,
    remote_viewer_id: user.data?.user?.id,
  });

  if (eventSession.loading) {
    return <div>Loading...</div>;
  }

  if (eventSession.error) {
    return <div>Error: {eventSession.error}</div>;
  }

  return (
    <div>
      {eventSession.data ? (
        <Button asChild size="sm" variant={"outline"}>
          <Link href={`targets/${event_id}`}>View session</Link>
        </Button>
      ) : !eventSession.error ? (
        <Button asChild size="sm" variant={"outline"}>
          <Link href={`targets/${event_id}`}>Remote View</Link>
        </Button>
      ) : null}
    </div>
  );
};

export function TargetsClient() {
  const user = useUser();
  const remoteViewersTaskers = useRemoteViewersTaskers({
    remote_viewer_email: user.data?.user?.email,
  });
  const tasker_ids = useMemo(
    () => remoteViewersTaskers.data?.map((r) => r.user_id),
    [remoteViewersTaskers.data]
  );
  const events = useTaskersEvents({
    tasker_ids,
  });

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Remote Viewing Targets</h1>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Target ID</th>
            <th className="text-left">Creator</th>
            <th className="text-left">Created</th>
            <th className="text-left">Resolved</th>
            <th className="text-left">Instructions</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.data?.map((event) => (
            <tr key={event.id}>
              <td>{event.id.split("-")[0]}</td>
              <td>{event.owner_email}</td>
              <td>{dayjs(event.created_at).format("DD.MM.YYYY HH:mm")}</td>
              <td>
                <EventResolutionDate event_id={event.id} />
              </td>
              <td className="truncate max-w-8">
                {event.remote_viewing_instructions}
              </td>
              <td className="text-right">
                <EventActions event_id={event.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
