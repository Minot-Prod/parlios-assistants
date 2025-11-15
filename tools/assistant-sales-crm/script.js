document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tool-form");
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "⏳ Génération de la structure CRM…";
    outputEl.textContent = "";

    const fields = {
      businessType: document.getElementById("businessType").value,
      leadVolume: document.getElementById("leadVolume").value,
      currentTool: document.getElementById("currentTool").value,
      currentProcess: document.getElementById("currentProcess").value
    };

    try {
      const res = await fetch("/.netlify/functions/tool-hub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: "assistant-sales-crm", fields })
      });

      if (!res.ok) {
        const text = await res.text();
        statusEl.textContent = "❌ Erreur côté serveur";
        outputEl.textContent = text;
        return;
      }

      const data = await res.json();
      statusEl.textContent = "✅ Structure CRM générée";
      outputEl.textContent = data.result || "(Réponse vide)";
    } catch (err) {
      console.error(err);
      statusEl.textContent = "❌ Erreur réseau ou fonction";
      outputEl.textContent = String(err);
    }
  });
});
