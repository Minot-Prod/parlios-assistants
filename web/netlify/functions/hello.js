exports.handler = async () => ({
  statusCode: 200,
  headers: { "content-type": "text/plain; charset=utf-8" },
  body: "hello-ok",
});