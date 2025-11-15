export const runtime = "edge";

export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, service: "parlios", runtime: "next-edge" }),
    { headers: { "content-type": "application/json" } }
  );
}
