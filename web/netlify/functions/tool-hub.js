import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BASE_SYSTEM_PROMPT = `
Tu es l'assistant IA de Parlios.
Tu parles en français naturel, clair, orienté business.
Tu réponds toujours avec du texte brut lisible (pas de JSON, pas de balises HTML).
Tu es concret, tu évites le bullshit marketing, tu proposes des actions précises.
`;

// Définition de chaque outil branché sur /tools/... qui appelle /.netlify/functions/tool-hub
const TOOLS = {
  // --- 1. Calendrier Social IA ---
  "calendrier-social-ia": {
    name: "Calendrier Social IA",
    prompt: (f) => `
Génère un calendrier éditorial de contenus pour les réseaux sociaux.

Contexte :
- Niche / activité : ${f.niche || "non précisée"}
- Plateforme principale : ${f.platform || "non précisée"}
- Objectif prioritaire : ${f.goal || "non précisé"}
- Ton / style : ${f.tone || "non précisé"}
- Infos complémentaires : ${f.extra || "aucune"}

Attendus :
- Plan sur 30 jours.
- Pour chaque jour : type de contenu (carrousel, reel, post texte…), hook, idée de contenu, CTA simple.
- Langue : français.
- Style : direct, simple, adapté aux solopreneurs / petites équipes.
`.trim(),
  },

  // --- 2. Rapporteur de Performance ---
  "rapporteur-performance": {
    name: "Rapporteur de Performance",
    prompt: (f) => `
Tu reçois des chiffres business et tu dois en faire un rapport clair et actionnable.

Données :
${f.rawMetrics || "Aucune donnée fournie."}

Contexte :
- Période : ${f.period || "non précisée"}
- Business : ${f.businessType || "non précisé"}
- Objectif principal : ${f.goal || "non précisé"}

Attendus :
1) Résumé en 5–7 lignes max : ce qui va bien, ce qui est inquiétant.
2) 3–5 KPIs clés que tu mets en avant (tu peux les reformuler à partir des chiffres).
3) Liste de 5 à 10 actions concrètes à lancer dès cette semaine, classées par priorité (Haute / Moyenne / Basse).
4) Ton : clair, cash, sans blabla.
`.trim(),
  },

  // --- 3. Text Booster IA ---
  "text-booster-ia": {
    name: "Text Booster IA",
    prompt: (f) => `
Tu optimises un texte existant pour le rendre plus clair et plus persuasif.

Texte de départ :
${f.text || "Aucun texte fourni."}

Contexte :
- Type de texte : ${f.textType || "non précisé"}
- Audience cible : ${f.audience || "non précisée"}
- Objectif principal : ${f.goal || "non précisé"}
- Niveau d'agressivité commerciale (1 = très soft, 5 = très direct) : ${f.aggressiveness || "3"}

Attendus :
1) Version améliorée du texte (en gardant le sens, mais plus clair et plus vendeur).
2) Optionnel : 3 variantes de hooks / premières phrases si pertinent.
3) Reste en français, style humain, sans promesses abusives.
`.trim(),
  },

  // --- 4. Landing Page IA ---
  "landing-page-ia": {
    name: "Landing Page IA",
    prompt: (f) => `
Tu conçois une structure complète de landing page de vente.

Contexte :
- Offre : ${f.offer || "non précisée"}
- Audience : ${f.audience || "non précisée"}
- Promesse principale : ${f.promise || "non précisée"}
- Objection principale : ${f.objection || "non précisée"}
- Call-to-action principal : ${f.cta || "non précisé"}

Attendus :
- Plan de landing page en sections, par exemple :
  HERO / PROBLÈME / POURQUOI C'EST URGENT / SOLUTION / CE QUE CONTIENT L'OFFRE /
  PREUVES / POUR QUI CE N'EST PAS FAIT / FAQ / CTA FINAL.
- Pour chaque section : titre, sous-titre éventuel, bullets ou phrases clés.
- Style : français, direct, concret, adapté aux solopreneurs / infopreneurs.
- Pas de HTML, juste du texte structuré avec des titres bien visibles (tu peux utiliser "###").
`.trim(),
  },

  // --- 5. Diagnostic d’Offre ---
  "diagnostic-offre": {
    name: "Diagnostic d'Offre",
    prompt: (f) => `
Tu analyses une offre et tu dis clairement si elle est compréhensible et vendable.

Contexte :
- Description de l'offre : ${f.offer || "non fournie"}
- Audience : ${f.audience || "non précisée"}
- Prix actuel : ${f.price || "non précisé"}
- Concurrents principaux : ${f.competitors || "non précisés"}

Attendus :
1) Diagnostic rapide : ce qui est clair, ce qui est flou, ce qui fait tiquer.
2) Analyse de l'alignement : offre / audience / prix (OK, sous-pricé, sur-pricé, incohérent…).
3) 3–5 pistes d'amélioration d'angle ou de promesse.
4) Proposition de 2–3 nouvelles formulations simples de promesse.
5) Ton : cash mais bienveillant, pas de jargon.
`.trim(),
  },

  // --- 6. Optimiseur d’Emails ---
  "optimiseur-email": {
    name: "Optimiseur d'Emails",
    prompt: (f) => `
Tu transformes un email brut en message plus clair et plus performant.

Contexte :
- Type d'email : ${f.emailType || "non précisé"}
- Objectif de l'email : ${f.goal || "non précisé"}
- Audience : ${f.audience || "non précisée"}

Email actuel ou idées brutes :
${f.rawEmail || "Aucun email fourni."}

Attendus :
1) 3 sujets d'email possibles.
2) Une version optimisée complète de l'email, en français.
3) Une mini check-list de ce qui a été amélioré (max 5 points).
Style : simple, humain, pas robotique.
`.trim(),
  },

  // --- 7. Coach Webinaire IA ---
  "coach-webinaire": {
    name: "Coach Webinaire IA",
    prompt: (f) => `
Tu construis le plan complet d'un webinaire de vente.

Contexte :
- Thème du webinaire : ${f.topic || "non précisé"}
- Durée : ${f.duration || "non précisée"}
- Audience cible : ${f.audience || "non précisée"}
- Offre à vendre : ${f.offer || "non précisée"}

Attendus :
1) Plan détaillé du webinaire avec timing approximatif par partie.
2) Pour chaque partie : objectif, idées de contenu, exemples éventuels.
3) Un pitch final structuré pour présenter l'offre et passer à l'action.
4) 3 questions à poser au public pour générer de l'engagement.
`.trim(),
  },

  // --- 8. Optimiseur Réseaux Courts ---
  "optimiseur-reseaux-courts": {
    name: "Optimiseur Réseaux Courts",
    prompt: (f) => `
Tu crées des scripts pour vidéos courtes (Reels, TikTok, Shorts).

Contexte :
- Plateforme principale : ${f.platform || "non précisée"}
- Style souhaité : ${f.style || "non précisé"}
- Audience : ${f.audience || "non précisée"}
- Thème / produit : ${f.topic || "non précisé"}

Attendus :
- 5 scripts de vidéos courtes.
- Pour chaque script : 
  - Hook (1 phrase),
  - Déroulé en 3–5 étapes (phrases courtes à dire),
  - Call-to-action final.
- Format adapté à la caméra facecam, français, ton naturel.
`.trim(),
  },

  // --- 9. Coach Prix & Offres ---
  "coach-prix-offres": {
    name: "Coach Prix & Offres",
    prompt: (f) => `
Tu aides à clarifier la structure d'offres et les prix.

Contexte :
- Offre actuelle : ${f.offer || "non précisée"}
- Audience : ${f.audience || "non précisée"}
- Prix actuel : ${f.price || "non précisé"}
- Objectif : ${f.goal || "non précisé"}

Attendus :
1) Diagnostic rapide : la grille actuelle fait-elle sens pour l'audience et le positionnement ?
2) Proposition d'une grille simple avec 2 à 4 niveaux d'offre (ex : entrée de gamme, core, premium, VIP).
3) Pour chaque niveau : prix suggéré, positionnement, à qui c'est destiné, principaux bénéfices.
4) 3 conseils pour mieux présenter ces prix (ancrage, bonus, garanties, etc.).
`.trim(),
  },

  // --- 10. Diagnostic Funnel Ads ---
  "diagnostic-funnel-ads": {
    name: "Diagnostic Funnel Ads",
    prompt: (f) => `
Tu analyses un funnel publicitaire (ads + landing) et tu donnes un diagnostic.

Contexte :
- Type d'ads : ${f.adsType || "non précisé"}
- Plateformes : ${f.platforms || "non précisées"}
- Message principal des ads : ${f.message || "non précisé"}
- Landing / offre derrière : ${f.landing || "non précisée"}
- Problèmes constatés : ${f.issues || "non précisés"}

Attendus :
1) Résumé : hypothèse principale sur pourquoi ça ne convertit pas.
2) Analyse par maillon : audience/targeting, créa, message, landing, offre, suivi.
3) 5 à 10 tests concrets à lancer :
   - ce qu'il faut modifier,
   - quoi mesurer,
   - dans quel ordre prioriser.
`.trim(),
  },

  // --- 11. Assistant Sales CRM ---
  "assistant-sales-crm": {
    name: "Assistant Sales CRM",
    prompt: (f) => `
Tu proposes une structure simple de CRM et de pipeline de vente.

Contexte :
- Type de business : ${f.businessType || "non précisé"}
- Volume de leads / mois : ${f.leadVolume || "non précisé"}
- Outil actuel : ${f.currentTool || "non précisé"}
- Process actuel : ${f.currentProcess || "non précisé"}

Attendus :
1) Proposition de colonnes de pipeline (de lead froid à client).
2) Système simple de tags / champs à créer.
3) Routine quotidienne et hebdo (quoi faire, à quelle fréquence).
4) 3 indicateurs à suivre pour savoir si le pipeline est sain.
`.trim(),
  },

  // --- 12. Créateur d’Arguments de Valeur ---
  "createur-arguments-valeur": {
    name: "Créateur d'Arguments de Valeur",
    prompt: (f) => `
Tu listes des arguments de valeur concrets pour une offre.

Contexte :
- Produit / service : ${f.product || "non précisé"}
- Audience : ${f.audience || "non précisée"}
- Problèmes principaux : ${f.problems || "non précisés"}
- Résultats promis : ${f.results || "non précisés"}

Attendus :
1) Liste des bénéfices concrets, classés en 3 catégories :
   - Argent / résultats mesurables
   - Temps / simplicité / confort
   - Émotion / statut / confiance
2) Pour chaque bénéfice : phrase courte + explication.
3) 5 accroches possibles qui mettent en avant 1 bénéfice majeur.
`.trim(),
  },

  // --- 13. Analyse Concurrents IA ---
  "analyse-concurrents": {
    name: "Analyse Concurrents IA",
    prompt: (f) => `
Tu analyses un petit paysage concurrentiel et tu proposes des angles différenciants.

Contexte :
- Concurrents : ${f.competitors || "non précisés"}
- Positionnement actuel : ${f.positioning || "non précisé"}
- Audience visée : ${f.audience || "non précisée"}

Attendus :
1) Résumé rapide : comment se positionnent globalement les concurrents.
2) Tableau textuel (pas besoin de vrai tableau) comparant :
   - Offres,
   - Prix (même approximatif),
   - Angle / promesse,
   - Ton / style.
3) 3 à 5 axes de différenciation clairs pour l'utilisateur (angles, fonctionnalités, audience, modèle économique...).
4) 2 pitchs de positionnement possibles, en 2–3 phrases chacun.
`.trim(),
  },
};

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method not allowed",
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return {
      statusCode: 400,
      body: "Invalid JSON body",
    };
  }

  const toolId = payload.toolId;
  const fields = payload.fields || {};

  if (!toolId || !TOOLS[toolId]) {
    return {
      statusCode: 400,
      body: `Unknown or missing toolId: ${toolId}`,
    };
  }

  const tool = TOOLS[toolId];
  const userPrompt = tool.prompt(fields);

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.8,
      messages: [
        { role: "system", content: BASE_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const result =
      completion.choices?.[0]?.message?.content?.trim() || "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    console.error("tool-hub error", err);
    return {
      statusCode: 500,
      body: `Erreur interne tool-hub: ${String(err)}`,
    };
  }
}
