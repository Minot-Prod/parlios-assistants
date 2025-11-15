export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({ ok: true, kind: "next", ts: Date.now() });
}
