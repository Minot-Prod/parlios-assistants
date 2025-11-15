/**
 * Parlios – Content Studio Function
 * Génère des contenus pour réseaux sociaux à partir du contexte fourni.
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

  const { platform, contentType, audience, angle, cta } = payload;

  const userPrompt = `
Tu es "Content Studio", l'assistant contenu de Parlios.

Contexte :
- Plateforme : ${platform || "(non précisé)"}
- Format : ${contentType || "(non précisé)"}
- Audience : ${audience || "(non précisé)"}
- Angle / idée centrale : ${angle || "(non précisé)"}
- Call-to-action : ${cta || "(non précisé)"}

Tâche :
1. Génère un seul contenu principal, directement prêt à publier.
2. Adapte la longueur et le rythme à la plateforme.
3. Mets en avant des bénéfices concrets, pas de jargon creux.
4. Intègre le call-to-action de manière naturelle.
5. Pas de préambule ni d’explication, uniquement le contenu final.
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
            content: "Tu es un créateur de contenu senior. Tu connais bien LinkedIn, Instagram, TikTok, X et YouTube Shorts. Tu écris simple, clair, impactant."
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
