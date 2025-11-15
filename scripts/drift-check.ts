/**
 * drift-check.ts — vérifie que chaque component.status:present du manifest a un sélecteur visible
 * NB: on mappe ids -> data-testid/id/sélecteur de fortune. Ajuster si besoin.
 */
import fs from "fs";
import yaml from "js-yaml";
import { chromium } from "playwright";

type Comp = { id: string; status: string };
type Manifest = { site: { homepage: { components: Comp[] } } };

const manifest = yaml.load(fs.readFileSync("parlios.agent.yaml", "utf8")) as Manifest;
const targets = (manifest.site?.homepage?.components || [])
  .filter(c => c.status === "present")
  .map(c => c.id);

const SELECTORS: Record<string,string[]> = {
  header: ["header"],
  footer: ["footer"],
  hero: ["[data-testid='hero']"],
  tools_grid: ["[data-testid='tools_grid']", "[data-testid='pricing']"],
  manifesto_panel: ["[data-testid='manifesto_panel']"]
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.DRIFT_URL ?? "http://localhost:8888"); // Netlify preview or local
  let missing: string[] = [];

  for (const t of targets) {
    const sels = SELECTORS[t] || [];
    let ok = false;
    for (const s of sels) {
      const el = page.locator(s);
      if (await el.first().isVisible().catch(()=>false)) { ok = true; break; }
    }
    if (!ok) missing.push(t);
  }

  await browser.close();
  if (missing.length) {
    console.error("Drift detected: missing components -> " + missing.join(", "));
    process.exit(1);
  } else {
    console.log("No drift — all homepage components present.");
  }
})();
