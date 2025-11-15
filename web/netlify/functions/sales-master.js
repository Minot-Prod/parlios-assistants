/**
 * Parlios – Sales Master Function
 * Génère un message de vente (email, DM, follow-up, script) à partir du contexte fourni.
 */

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing OPENAI_API_KEY env var" })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" })
    };
  }

  const { format, tone, offer, prospect, goal } = payload;

  const userPrompt = `
Tu es "Sales Master", l'assistant de vente de Parlios.

Contexte :
- Offre : ${offer || "(non précisé)"}
- Prospect : ${prospect || "(non précisé)"}
- Objectif : ${goal || "(non précisé)"}
- Type de message : ${format || "email"}
- Tonalité : ${tone || "pro"}

Tâche :
1. Rédige un message unique, prêt à copier-coller.
2. Garde un ton clair, simple, orienté bénéfices.
3. Ajoute un call-to-action explicite et facile à répondre.
4. Pas de blabla méta sur l'IA ou le fait que tu es un modèle.

Commence directement par le message final, sans explication autour.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un copywriter B2B très expérimenté. Tu écris des messages courts, clairs, orientés business, sans bullshit."
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        body: text
      };
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ result })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) })
    };
  }
};
