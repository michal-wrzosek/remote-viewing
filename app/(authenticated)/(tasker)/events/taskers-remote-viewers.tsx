import { useTaskersRemoteViewers } from "@/lib/use-users-remote-viewers";
import { useCallback } from "react";
import { CreateTaskersRemoteViewerForm } from "./create-taskers-remote-viewer-form";
import { TaskerRemoteViewer } from "@/lib/types";
import { DeleteTaskersRemoteViewerForm } from "./delete-taskers-remote-viewer-form";
import dayjs from "dayjs";

function TaskersRemoteViewer({
  taskersRemoteViewer,
  onDelete,
}: {
  taskersRemoteViewer: TaskerRemoteViewer;
  onDelete: () => void;
}) {
  return (
    <tr>
      <td className="py-1 pl-4 first:pl-0">
        {taskersRemoteViewer.remote_viewer_email}
      </td>
      <td className="py-1 pl-4 first:pl-0">
        {dayjs(taskersRemoteViewer.created_at).format("DD.MM.YYYY HH:mm")}
      </td>
      <td className="py-1 pl-4 first:pl-0">
        <DeleteTaskersRemoteViewerForm
          remote_viewer_email={taskersRemoteViewer.remote_viewer_email}
          onSuccess={onDelete}
        />
      </td>
    </tr>
  );
}

export function TaskersRemoteViewers({ tasker_id }: { tasker_id: string }) {
  const taskersRemoteViewers = useTaskersRemoteViewers({ tasker_id });

  const handleDelete = useCallback(() => {
    taskersRemoteViewers.refetch();
  }, [taskersRemoteViewers]);

  const handleCreate = useCallback(() => {
    taskersRemoteViewers.refetch();
  }, [taskersRemoteViewers]);

  if (taskersRemoteViewers.loading) {
    return <div>Loading Remote Viewers...</div>;
  }

  if (taskersRemoteViewers.error) {
    return (
      <div>Error loading Remote Viewers: {taskersRemoteViewers.error}</div>
    );
  }

  if (!taskersRemoteViewers.data) {
    return <div>Error loading Remote Viewers</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 border rounded-md border-muted-foreground p-4">
      <h1 className="text-2xl font-bold">My Remote Viewers</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th className="py-1 pl-4 first:pl-0 text-left">
                Remote Viewer Email
              </th>
              <th className="py-1 pl-4 first:pl-0 text-left">Created At</th>
              <th className="py-1 pl-4 first:pl-0 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskersRemoteViewers.data.map((taskersRemoteViewer) => (
              <TaskersRemoteViewer
                key={taskersRemoteViewer.remote_viewer_email}
                taskersRemoteViewer={taskersRemoteViewer}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <CreateTaskersRemoteViewerForm onSuccess={handleCreate} />
    </div>
  );
}
