/**
 * Netlify function for the "ai-bio-booster" tool.
 *
 * Accepts a POST request with a JSON body containing a "prompt"
 * and optional "tone". Generates a simple biography based on the
 * provided prompt. For production usage, integrate an AI provider
 * like OpenAI or Anthropic and handle errors appropriately.
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
    const bio = `Voici une courte bio pour "${prompt}" avec un ton ${tone || 'neutre'}.`;
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, bio })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message || 'Unexpected error' })
    };
  }
};