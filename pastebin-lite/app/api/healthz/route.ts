import kv from "@/app/lib/db";

export async function GET() {
  try {
    await kv.ping();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
