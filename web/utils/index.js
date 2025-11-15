export function uploadDisabled() {
  // DÃ©sactive les uploads dans l'exemple (comportement sÃ»r par dÃ©faut)
  return true;
}

export function randomInt(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function uniqueName(prefix = "shape") {
  const rnd = Math.random().toString(36).slice(2, 8);
  const ts = Date.now().toString(36);
  return `${prefix}-${ts}-${rnd}`;
}

export function getNetlifyContext() {
  return {
    CONTEXT: process.env.CONTEXT || "dev",
    URL: process.env.URL || "",
    SITE_NAME: process.env.SITE_NAME || "parlios",
  };
}

// Utilitaire "safe" cÃ´tÃ© client/serveur, pas critique pour le build
export async function getResourceSize(_url) {
  try {
    // On renvoie une taille fictive sans faire de requÃªte rÃ©seau au build
    return { bytes: 0 };
  } catch {
    return { bytes: 0 };
  }
}

