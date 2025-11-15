document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tool-form");
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "⏳ Génération en cours…";
    outputEl.textContent = "";

    const fields = {
      textType: document.getElementById("textType").value,
      context: document.getElementById("context").value,
      tone: document.getElementById("tone").value
    };

    try {
      const res = await fetch("/.netlify/functions/tool-hub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: "text-booster-ia", fields })
      });

      if (!res.ok) {
        const text = await res.text();
        statusEl.textContent = "❌ Erreur côté serveur";
        outputEl.textContent = text;
        return;
      }

      const data = await res.json();
      statusEl.textContent = "✅ Texte généré";
      outputEl.textContent = data.result || "(Réponse vide)";
    } catch (err) {
      console.error(err);
      statusEl.textContent = "❌ Erreur réseau ou fonction";
      outputEl.textContent = String(err);
    }
  });
});
