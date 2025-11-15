const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
const resp = (code, body, withCors=false) => ({
  statusCode: code,
  headers: { "Content-Type":"application/json; charset=utf-8", ...(withCors ? cors : {}) },
  body: JSON.stringify(body)
});
export async function handler(event) {
  if (event.httpMethod === "GET") return resp(200, { ok:true, health:"summary-ready" });
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: cors, body: "" };
  if (event.httpMethod !== "POST") return resp(405, { ok:false, error:"Method not allowed" }, true);
  try {
    const { prompt = "" } = JSON.parse(event.body || "{}");
    if (prompt.length < 12) return resp(400, { ok:false, error:"Prompt requis (ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¥12 chars)" }, true);
    const summary = `RÃƒÆ’Ã‚Â©sumÃƒÆ’Ã‚Â© ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ${prompt.slice(0, 160)}ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦`;
    const actions = ["Partager sur X", "Exporter en Markdown", "CrÃƒÆ’Ã‚Â©er une todo"];
    return resp(200, { ok:true, summary, actions }, true);
  } catch (e) {
    return resp(500, { ok:false, error: String(e?.message || e) }, true);
  }
};





