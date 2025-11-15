export const BRAND = {
  name: "Parlios",
  tagline: "Optimise ton temps. LibÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ton potentiel. Partage ton monde.",
  colors: {
    bg: "#0b0f17",
    card: "#121826",
    text: "#e6edf3",
    accent: "#78e3fd",
    accent2: "#b388ff",
    border: "#1f2a3a"
  }
};

export const API = {
  bio: "/.netlify/functions/ai-bio",
  headline: "/.netlify/functions/headline",
  summary: "/.netlify/functions/summary"
};

export const TOOLS = [
  {
    slug: "ai-bio-booster",
    name: "AI Bio Booster",
    description: "Optimise ta bio LinkedIn/X en 15 secondes.",
    endpoint: API.bio
  },
  {
    slug: "headline-wizard",
    name: "Headline Wizard",
    description: "GÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re un titre cliquable (CTR++) pour posts et pages.",
    endpoint: API.headline
  },
  {
    slug: "smart-summary",
    name: "Smart Summary",
    description: "RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©sume nÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢importe quel texte avec actions suivantes.",
    endpoint: API.summary
  }
];

