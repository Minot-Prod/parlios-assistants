const jsonH = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const { OPENAI_API_KEY, OPENAI_MODEL = 'gpt-4o-mini' } = process.env;

async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) return { ok: false, error: 'OPENAI_API_KEY manquante (back non configuré)' };
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': Bearer , 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'Tu es Parlios, assistant de rédaction clair et concis.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return { ok: false, error: j?.error?.message || 'Erreur OpenAI' };
  const text = (j?.choices?.[0]?.message?.content || '').trim();
  return { ok: true, result: text };
}

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers: jsonH, body: JSON.stringify({ ok:false, error: 'Method Not Allowed' }) };
    const { toolId = '', data = {} } = JSON.parse(event.body || '{}');
    const routes = {
      'headline-wizard': () => callOpenAI(Génère 10 titres accrocheurs en français. Contexte: ),
      'value-prop': () => callOpenAI(Propose 5 propositions de valeur claires. Contexte: ),
      'ai-bio-booster': () => callOpenAI(Rédige une bio courte (500 caractères max). Contexte: )
    };
    const fn = routes[toolId];
    if (!fn) return { statusCode: 400, headers: jsonH, body: JSON.stringify({ ok:false, error:'toolId inconnu' }) };
    const res = await fn();
    return { statusCode: 200, headers: jsonH, body: JSON.stringify(res) };
  } catch (e) {
    console.error('tool-hub failure', e);
    return { statusCode: 500, headers: jsonH, body: JSON.stringify({ ok:false, error: 'Erreur interne' }) };
  }
};
