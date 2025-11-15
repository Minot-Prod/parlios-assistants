const \$ = (q) => document.querySelector(q);

async function callAPI(prompt, tone) {
  const res = await fetch("/.netlify/functions/headline-wizard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, tone })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Request failed");
  }
  return res.json();
}

window.addEventListener("DOMContentLoaded", () => {
  const promptEl = #prompt;
  const toneEl   = #tone;
  const btn      = #go;
  const statusEl = #status;
  const resultEl = #result;

  btn.addEventListener("click", async () => {
    const prompt = promptEl.value.trim();
    const tone   = toneEl.value;
    if (!prompt || prompt.length < 8) {
      statusEl.textContent = "Ajoute un minimum de contexte 👇";
      return;
    }
    statusEl.textContent = "Génération en cours...";
    resultEl.textContent = "";
    try {
      const data = await callAPI(prompt, tone);
      if (!data.ok) throw new Error(data.error || "Erreur API");
      resultEl.textContent = data.output || data.bio || JSON.stringify(data);
      statusEl.textContent = "✅ Prêt";
    } catch (e) {
      statusEl.textContent = "❌ " + (e.message || "Erreur");
    }
  });
});
