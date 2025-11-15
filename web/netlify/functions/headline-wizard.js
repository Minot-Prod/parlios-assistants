/**
 * Netlify function for the "headline-wizard" tool.
 *
 * This handler receives a POST request with a JSON body containing
 * a "prompt" and an optional "tone". It returns a simple, generated
 * headline using the provided prompt. In production you should
 * integrate this with your preferred AI provider (e.g. OpenAI or
 * Anthropic) and handle authentication via environment variables.
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
    const output = `Titre accrocheur généré pour "${prompt}" avec le ton ${tone || 'neutre'}.`;
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