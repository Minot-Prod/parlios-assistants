exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ok: false,
      error:
        "Cette fonction n'est pas encore implémentée côté serveur. Contacte le support Parlios.",
    }),
  };
};
