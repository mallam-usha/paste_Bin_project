import kv from "@/app/lib/db";
import { now } from "@/app/lib/time";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const paste = await kv.get<any>(`paste:${params.id}`);
  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const currentTime = now(req).getTime();

  if (paste.ttl_seconds) {
    const expiresAt = paste.createdAt + paste.ttl_seconds * 1000;
    if (currentTime > expiresAt) {
      return Response.json({ error: "Expired" }, { status: 404 });
    }
  }

  if (paste.max_views && paste.views >= paste.max_views) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
    }

  paste.views += 1;
  await kv.set(`paste:${params.id}`, paste);

  return Response.json({
    content: paste.content,
    remaining_views: paste.max_views
      ? paste.max_views - paste.views
      : null,
    expires_at: paste.ttl_seconds
      ? new Date(
          paste.createdAt + paste.ttl_seconds * 1000
        ).toISOString()
      : null,
  });
}
