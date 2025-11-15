/**
 * Parlios – Launch Factory Function
 * Produit un mini plan de lancement actionnable.
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

  const { launchType, duration, offer, audience, constraints } = payload;

  const userPrompt = `
Tu es "Launch Factory", l'assistant lancement de Parlios.

Contexte :
- Type de lancement : ${launchType || "(non précisé)"}
- Durée (jours) : ${duration || "(non précisé)"}
- Offre : ${offer || "(non précisé)"}
- Audience : ${audience || "(non précisé)"}
- Contraintes / canaux : ${constraints || "(non précisé)"}

Tâche :
1. Propose un plan de lancement clair, sur ${duration || "X"} jours.
2. Structure par jour ou par phase (Teasing / Ouverture / Relances / Clôture).
3. Pour chaque jour/phase : explique rapidement l’objectif + les actions concrètes.
4. Inclue les principaux canaux possibles (contenu, email, DM, éventuellement ads si compatible).
5. Sortie en texte simple, structuré avec titres et listes, mais pas de markdown compliqué.
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
            content: "Tu es un stratège de lancement. Tu vas droit au but, avec des plans simples, exécutables, adaptés à un solopreneur ou une petite équipe."
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
