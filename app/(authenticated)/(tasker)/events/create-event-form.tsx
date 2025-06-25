"use client";

import { Button } from "@/components/ui/button";
import { createEvent } from "./create-event-action";
import { useActionState, useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState = { success: false, message: "" };

const defaultOutcomes = [
  { id: Date.now(), description: "" },
  { id: Date.now() + 1, description: "" },
];

export function CreateEventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState(
    createEvent,
    initialState
  );

  const [outcomes, setOutcomes] = useState(defaultOutcomes);

  useEffect(() => {
    if (state.success) {
      setOutcomes(defaultOutcomes);
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  const addOutcome = useCallback(() => {
    setOutcomes([...outcomes, { id: Date.now(), description: "" }]);
  }, [outcomes]);

  const removeOutcome = useCallback(
    (id: number) => {
      setOutcomes(outcomes.filter((o) => o.id !== id));
    },
    [outcomes]
  );

  const handleOutcomeChange = useCallback(
    (id: number, value: string) => {
      setOutcomes(
        outcomes.map((o) => (o.id === id ? { ...o, description: value } : o))
      );
    },
    [outcomes]
  );

  return (
    <form
      action={formAction}
      className="w-full flex flex-col gap-4 border rounded-md border-muted-foreground p-4"
    >
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="name">Event name (just for tasker)</Label>
        <Input id="name" name="name" placeholder="Event name" type="text" />
      </div>

      <div className="grid w-full items-center gap-3">
        <Label htmlFor="description">Description (just for tasker)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Event description"
          rows={5}
        />
      </div>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="remote_viewing_instructions">
          Remote Viewing Instructions
        </Label>
        <Textarea
          id="remote_viewing_instructions"
          name="remote_viewing_instructions"
          placeholder="Remote viewing instructions"
          rows={5}
        />
      </div>

      <div className="flex flex-col gap-8">
        {outcomes.map((outcome, idx) => (
          <div key={outcome.id} className="mb-3 flex items-center gap-2">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor={`outcomes[${idx}][description]`}>
                Outcome {idx + 1} description
              </Label>
              <Textarea
                name={`outcomes[${idx}][description]`}
                placeholder="Outcome description"
                value={outcome.description}
                onChange={(e) =>
                  handleOutcomeChange(outcome.id, e.target.value)
                }
                required
                rows={5}
              />
              <Button
                type="button"
                onClick={() => removeOutcome(outcome.id)}
                aria-label="Remove outcome"
                disabled={outcomes.length === 1}
                variant="destructive"
              >
                Remove this outcome
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" onClick={addOutcome} variant="outline">
        Add Outcome
      </Button>

      {state.message && (
        <div
          className={`mt-2 p-2 rounded ${
            state.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {state.message}
        </div>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating event..." : "Create event"}
      </Button>
    </form>
  );
}
