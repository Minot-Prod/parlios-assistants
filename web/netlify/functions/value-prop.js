/**
 * Netlify function for the "value-prop" tool.
 *
 * Accepts a POST request with JSON containing a "prompt" and optional "tone".
 * Generates a simple proposition de valeur. Replace the placeholder
 * generation logic with calls to an AI service for real use.
 */
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' })
    };
  }
  try {
    const { prompt, tone } = JSON.parse(event.body || '{}');
    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: 'Missing or invalid "prompt"' })
      };
    }
    // Placeholder generation logic. Replace with actual AI call.
    const output = `Proposition de valeur générée pour "${prompt}" avec le ton ${tone || 'neutre'}.`;
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, output })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message || 'Unexpected error' })
    };
  }
};