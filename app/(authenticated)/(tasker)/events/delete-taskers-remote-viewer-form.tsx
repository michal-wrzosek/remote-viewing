import { Button } from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import { deleteTaskersRemoteViewer } from "./delete-taskers-remote-viewer-action";
import { DeleteIcon } from "lucide-react";

export function DeleteTaskersRemoteViewerForm({
  remote_viewer_email,
  onSuccess,
}: {
  remote_viewer_email: string;
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    deleteTaskersRemoteViewer,
    {
      success: false,
      message: "",
    }
  );

  useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="remote_viewer_email"
        value={remote_viewer_email}
      />
      <Button type="submit" disabled={pending} size="sm" variant="destructive">
        <DeleteIcon /> {pending ? "Deleting..." : "Delete"}
      </Button>
    </form>
  );
}
