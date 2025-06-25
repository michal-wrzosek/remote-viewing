"use client";

import { createClient } from "@/lib/supabase/client";
import { useActionState, useCallback, useEffect, useState } from "react";
import { createUsersRemoteViewer, deleteUsersRemoteViewer } from "./actions";

interface UsersRemoteViewer {
  user_id: string;
  remote_viewer_email: string;
  created_at: string;
}

interface UsersRemoteViewers {
  data?: UsersRemoteViewer[];
  error?: string;
  loading: boolean;
}

function UsersRemoteViewer({
  usersRemoteViewer,
  onDelete,
}: {
  usersRemoteViewer: UsersRemoteViewer;
  onDelete: () => void;
}) {
  const [state, formAction, pending] = useActionState(deleteUsersRemoteViewer, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) onDelete();
  }, [state.success, onDelete]);

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="remote_viewer_email"
        value={usersRemoteViewer.remote_viewer_email}
      />
      <div>
        {usersRemoteViewer.remote_viewer_email} - {usersRemoteViewer.created_at}
      </div>
      <div>
        <button type="submit" disabled={pending}>
          {pending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </form>
  );
}

export function UsersRemoteViewersClient() {
  const [state, formAction, pending] = useActionState(createUsersRemoteViewer, {
    success: false,
    message: "",
    count: 0,
  });

  const [usersRemoteViewers, setUsersRemoteViewers] =
    useState<UsersRemoteViewers>({
      data: undefined,
      error: undefined,
      loading: true,
    });

  const fetchUsersRemoteViewers = useCallback(async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("users_remote_viewers")
      .select();

    if (error) {
      setUsersRemoteViewers({
        data: undefined,
        error: error.message,
        loading: false,
      });
      return;
    }

    setUsersRemoteViewers({ data, error: undefined, loading: false });
  }, []);

  useEffect(() => {
    fetchUsersRemoteViewers();
  }, [state.count, fetchUsersRemoteViewers]);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      {usersRemoteViewers.loading ? (
        <div>Loading...</div>
      ) : usersRemoteViewers.error ? (
        <div>Error: {usersRemoteViewers.error}</div>
      ) : usersRemoteViewers.data ? (
        <div>
          {usersRemoteViewers.data.map((usersRemoteViewer) => (
            <UsersRemoteViewer
              key={usersRemoteViewer.remote_viewer_email}
              usersRemoteViewer={usersRemoteViewer}
              onDelete={() => fetchUsersRemoteViewers()}
            />
          ))}
        </div>
      ) : null}

      <form action={formAction}>
        <div>
          <input type="email" name="remote_viewer_email" />
        </div>
        <div>
          <button type="submit" disabled={pending}>
            {pending ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
