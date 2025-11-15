exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: false, error: "Fonction non implémentée côté serveur." })
  };
};
