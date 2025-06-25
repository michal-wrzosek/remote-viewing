import { useActionState, useEffect } from "react";
import { createTaskersRemoteViewer } from "./create-taskers-remote-viewer-action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateTaskersRemoteViewerForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    createTaskersRemoteViewer,
    {
      success: false,
      message: "",
      count: 0,
    }
  );

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="w-full flex flex-col gap-2">
      <Input
        id="remote_viewer_email"
        name="remote_viewer_email"
        placeholder="Remote Viewer Email"
        type="email"
      />
      <div>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Adding Remote Viewer..." : "Add Remote Viewer"}
        </Button>
      </div>
      {state.message && (
        <div
          className={`text-sm ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </div>
      )}
    </form>
  );
}
