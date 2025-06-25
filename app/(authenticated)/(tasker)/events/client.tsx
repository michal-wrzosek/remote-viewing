"use client";

import { Button } from "@/components/ui/button";
import { useEventResolution } from "@/lib/use-event-resolution";
import { useEventSessions } from "@/lib/use-event-sessions";
import { useTaskerEvents } from "@/lib/use-tasker-events";
import { useUser } from "@/lib/use-user";
import dayjs from "dayjs";
import Link from "next/link";
import { CreateEventForm } from "./create-event-form";
import { useCallback } from "react";
import { TaskersRemoteViewers } from "./taskers-remote-viewers";

const EventSessionCount = ({ event_id }: { event_id: string }) => {
  const eventSessions = useEventSessions({ event_id });

  if (eventSessions.loading) {
    return "Loading...";
  }

  return eventSessions.data ? eventSessions.data.length : "0";
};

const EventResolutionDate = ({ event_id }: { event_id: string }) => {
  const eventResolution = useEventResolution({ event_id });

  if (eventResolution.loading) {
    return "Loading...";
  }

  return eventResolution.data
    ? dayjs(eventResolution.data.created_at).format("DD.MM.YYYY HH:mm")
    : "-";
};

export const EventsClient = () => {
  const user = useUser();
  const events = useTaskerEvents({ owner_id: user?.data?.user?.id });

  const handleFormSuccess = useCallback(() => {
    events.refetch();
  }, [events]);

  if (events.loading || user.loading) {
    return <div>Loading...</div>;
  }

  if (events.error || user.error) {
    return <div>Error: {events.error ?? user.error}</div>;
  }

  if (!user.data?.user) {
    return <div>Error loading user</div>;
  }

  if (!events.data) {
    return <div>Error loading events</div>;
  }

  return (
    <div className="flex flex-col justify-center h-full">
      <CreateEventForm onSuccess={handleFormSuccess} />

      <div className="mb-8" />

      <TaskersRemoteViewers tasker_id={user.data.user.id} />

      <div className="mb-8" />

      <h1 className="text-2xl font-bold mb-12">My events</h1>

      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left">Event ID</th>
            <th className="text-left">Name</th>
            <th className="text-left">Created</th>
            <th className="text-left">Resolved</th>
            <th className="text-right">Nr of sessions</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.data?.map((event) => (
            <tr key={event.id}>
              <td>{event.id.split("-")[0]}</td>
              <td>{event.name}</td>
              <td>{dayjs(event.created_at).format("DD.MM.YYYY HH:mm")}</td>
              <td>
                <EventResolutionDate event_id={event.id} />
              </td>
              <td className="text-right">
                <EventSessionCount event_id={event.id} />
              </td>
              <td className="text-right">
                <Button asChild size="sm" variant={"outline"}>
                  <Link href={`/events/${event.id}`}>View</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
