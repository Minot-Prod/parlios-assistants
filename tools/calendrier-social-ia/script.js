document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calendar-form");
  const statusEl = document.getElementById("status");
  const resultEl = document.getElementById("result");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const niche = (document.getElementById("niche") || {}).value || "";
    const platform = (document.getElementById("platform") || {}).value || "";
    const tone = (document.getElementById("tone") || {}).value || "";
    const frequency = (document.getElementById("frequency") || {}).value || "";
    const goal = (document.getElementById("goal") || {}).value || "";

    const payload = {
      toolId: "calendrier-social-ia",
      data: {
        niche,
        platform,
        tone,
        frequency,
        goal
      }
    };

    statusEl.textContent = "L’agent réfléchit…";
    if (submitBtn) submitBtn.disabled = true;
    resultEl.textContent = "";

    try {
      const response = await fetch("/.netlify/functions/tool-hub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        statusEl.textContent = "Erreur côté serveur. Essaie à nouveau dans quelques minutes.";
        resultEl.textContent = JSON.stringify(data, null, 2);
        return;
      }

      statusEl.textContent = "Calendrier généré par l’agent ✅";

      // Si le backend renvoie { result: "..." }
      if (data && typeof data.result === "string") {
        resultEl.textContent = data.result;
      } else if (data && data.output) {
        // fallback si tu renvoies output au lieu de result
        resultEl.textContent = data.output;
      } else {
        // debug brut si le format diffère
        resultEl.textContent = JSON.stringify(data, null, 2);
      }
    } catch (error) {
      console.error(error);
      statusEl.textContent = "Impossible de joindre l’agent. Vérifie ta connexion ou réessaie.";
      resultEl.textContent = "Erreur : " + (error && error.message ? error.message : String(error));
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
