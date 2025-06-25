import { useState } from "react";

export function EventForm() {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [remoteViewingInstructions, setRemoteViewingInstructions] =
    useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      eventName,
      description,
      remoteViewingInstructions,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="event-name" className="block text-sm font-medium">
          Event Name
        </label>
        <input
          id="event-name"
          type="text"
          required
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label
          htmlFor="remote-viewing-instructions"
          className="block text-sm font-medium"
        >
          Remote Viewing Instructions
        </label>
        <textarea
          id="remote-viewing-instructions"
          required
          value={remoteViewingInstructions}
          onChange={(e) => setRemoteViewingInstructions(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
        />
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
        Create Event
      </button>
    </form>
  );
}
