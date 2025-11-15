exports.handler = async (event) => {
  const cors = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,OPTIONS",
    "access-control-allow-headers": "Content-Type,Authorization",
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors };
  }
  return {
    statusCode: 200,
    headers: { ...cors, "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ ok: true, kind: "function-cjs", ts: Date.now() }),
  };
};