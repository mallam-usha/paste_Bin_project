import kv from "@/app/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  let content = "";
  let ttl_seconds: number | null = null;
  let max_views: number | null = null;

  if (contentType.includes("application/json")) {
    const body = await req.json();
    content = body.content;
    ttl_seconds = body.ttl_seconds ?? null;
    max_views = body.max_views ?? null;
  } else {
    const form = await req.formData();
    content = String(form.get("content") || "");
    ttl_seconds = form.get("ttl") ? Number(form.get("ttl")) : null;
    max_views = form.get("max_views")
      ? Number(form.get("max_views"))
      : null;
  }

  if (!content) {
    return Response.json({ error: "Content required" }, { status: 400 });
  }

  const id = nanoid(8);

  await kv.set(`paste:${id}`, {
    content,
    ttl_seconds,
    max_views,
    views: 0,
    createdAt: Date.now(),
  });

  return Response.json({ id });
}
