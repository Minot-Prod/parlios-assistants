document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("agent-form");
  const statusEl = document.getElementById("status");
  const resultEl = document.getElementById("result");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const context = (document.getElementById("context") || {}).value || "";
    const goal = (document.getElementById("goal") || {}).value || "";
    const constraints = (document.getElementById("constraints") || {}).value || "";
    const brief = (document.getElementById("brief") || {}).value || "";

    const payload = {
      toolId: "rapporteur-performance",
      data: {
        context,
        goal,
        constraints,
        brief
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

      statusEl.textContent = "Réponse générée par l’agent ✅";

      if (data && typeof data.result === "string") {
        resultEl.textContent = data.result;
      } else if (data && data.output) {
        resultEl.textContent = data.output;
      } else {
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
