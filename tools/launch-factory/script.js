document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tool-form");
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "⏳ Génération du plan…";
    outputEl.textContent = "";

    const payload = {
      launchType: document.getElementById("launchType").value,
      duration: document.getElementById("duration").value,
      offer: document.getElementById("offer").value,
      audience: document.getElementById("audience").value,
      constraints: document.getElementById("constraints").value
    };

    try {
      const res = await fetch("/.netlify/functions/launch-factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        statusEl.textContent = "❌ Erreur côté serveur";
        outputEl.textContent = text;
        return;
      }

      const data = await res.json();
      statusEl.textContent = "✅ Plan généré";
      outputEl.textContent = data.result || "(Réponse vide)";
    } catch (err) {
      console.error(err);
      statusEl.textContent = "❌ Erreur réseau ou fonction";
      outputEl.textContent = String(err);
    }
  });
});
