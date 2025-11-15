const BASE_URL =
  process.env.PARLIOS_FUNCTION_BASE ||
  "https://www.parlios.fr/.netlify/functions";

const TOOL_MAP = {
  "sales-master": {
    path: "sales-master",
    method: "POST",
  },
  "content-studio": {
    path: "content-studio",
    method: "POST",
  },
  "acquisition-engine": {
    path: "acquisition-engine",
    method: "POST",
  },
  "launch-factory": {
    path: "launch-factory",
    method: "POST",
  },
};

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed, use POST" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const toolId = body.toolId;
    const input = body.input || {};

    if (!toolId || !TOOL_MAP[toolId]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Unknown or missing toolId: ${toolId}`,
        }),
      };
    }

    const toolConfig = TOOL_MAP[toolId];

    const resp = await fetch(`${BASE_URL}/${toolConfig.path}`, {
      method: toolConfig.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return {
      statusCode: resp.status || 200,
      body: JSON.stringify({
        ok: resp.ok,
        toolId,
        data,
      }),
    };
  } catch (err) {
    console.error("tool-hub error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "internal_error",
        message: err.message || String(err),
      }),
    };
  }
};
