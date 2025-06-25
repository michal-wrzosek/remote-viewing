import { useActionState, useEffect } from "react";
import { createSession } from "./create-session-form-action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface EventSessionNewClientProps {
  event_id: string;
  onSuccess: () => void;
}

export const CreateSessionForm = ({
  event_id,
  onSuccess,
}: EventSessionNewClientProps) => {
  const [state, formAction, pending] = useActionState(createSession, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="w-full flex flex-col">
      <input type="hidden" name="event_id" value={event_id} />
      <div className="grid w-full items-center gap-3 mb-4">
        <Label htmlFor="description">Session description</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={10}
          disabled={pending}
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving the report..." : "Create RV session report"}
      </Button>
      {state.message && <p>{JSON.stringify(state.message)}</p>}
    </form>
  );
};
