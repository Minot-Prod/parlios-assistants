document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tool-form");
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "⏳ Analyse des concurrents…";
    outputEl.textContent = "";

    const fields = {
      competitors: document.getElementById("competitors").value,
      positioning: document.getElementById("positioning").value,
      audience: document.getElementById("audience").value
    };

    try {
      const res = await fetch("/.netlify/functions/tool-hub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: "analyse-concurrents", fields })
      });

      if (!res.ok) {
        const text = await res.text();
        statusEl.textContent = "❌ Erreur côté serveur";
        outputEl.textContent = text;
        return;
      }

      const data = await res.json();
      statusEl.textContent = "✅ Analyse générée";
      outputEl.textContent = data.result || "(Réponse vide)";
    } catch (err) {
      console.error(err);
      statusEl.textContent = "❌ Erreur réseau ou fonction";
      outputEl.textContent = String(err);
    }
  });
});
