export function CreateTaskersRemoteViewersForm() {
  return (
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
  );
}
