/**
 * Parlios – Acquisition Engine Function
 * Génère des idées d’acquisition et de campagnes.
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

  const { stage, budget, offer, audience, current } = payload;

  const userPrompt = `
Tu es "Acquisition Engine", l'assistant acquisition de Parlios.

Contexte :
- Niveau actuel : ${stage || "(non précisé)"}
- Budget / ressources : ${budget || "(non précisé)"}
- Offre : ${offer || "(non précisé)"}
- Audience / ICP : ${audience || "(non précisé)"}
- Ce qui est déjà en place : ${current || "(non précisé)"}

Tâche :
1. Propose une liste d'idées d’acquisition priorisées (ex : cold DM, cold email, contenu, partenariats, ads, etc.).
2. Pour chaque idée, donne :
   - le canal
   - pourquoi c’est pertinent
   - une première action concrète à faire cette semaine.
3. Adapte les idées au niveau et au budget (pas de plan avec gros budget ads si budget faible).
4. Sortie en texte simple avec une liste claire (1., 2., 3., …).
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
            content: "Tu es un consultant acquisition pragmatique. Tu proposes des actions simples, testables rapidement, sans bullshit."
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
