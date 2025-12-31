export default function Home() {
  return (
    <form method="POST" action="/api/pastes" style={{ padding: 20 }}>
      <h2>Create a Paste</h2>

      <textarea
        name="content"
        rows={10}
        cols={50}
        placeholder="Enter your text here"
        required
      />
      <br /><br />

      <input
        type="number"
        name="ttl_seconds"
        placeholder="TTL (seconds)"
      />
      <br /><br />

      <input
        type="number"
        name="max_views"
        placeholder="Max Views"
      />
      <br /><br />

      <button type="submit">Create Paste</button>
    </form>
  );
}