# Parlios Template – Static + Netlify Functions (OpenAI-ready)

Pipeline **from zero** pour lancer des mini‑outils IA à grande échelle.
Stack: HTML/CSS (static) + Netlify Functions (Node) + GitHub Actions (CI/CD) + Playwright (smoke).

## 1) Démarrage
- Crée un repo GitHub neuf (ex: `parlios-stack`).
- Ajoute les secrets GitHub (Settings → Secrets and variables → Actions) :
  - `OPENAI_API_KEY` — clé OpenAI (compte Parlios)
  - `NETLIFY_AUTH_TOKEN` — token Netlify (Deploy)
  - `NETLIFY_SITE_ID` — Site ID Netlify de **parlios.fr** ou du site cible
- Connecte le repo à Netlify **ou** garde le déploiement 100% via GitHub Actions.

## 2) Dev local
```bash
# Option simple: servir le dossier pour test de front uniquement
python3 -m http.server 5173 --directory .

# Les functions Netlify ne tournent pas avec http.server.
# Pour tester la function localement, installe netlify-cli et lance:
# npm i -g netlify-cli
netlify dev
```

## 3) Déploiement
- Chaque push sur `main` déclenche:
  - build + déploiement Netlify (via `deploy.yml`), si variables `NETLIFY_*` configurées
  - tests Playwright (smoke) sur la page outil
- `_redirects` gère les alias courts.
- `netlify.toml` inclut CSP et config Functions.

## 4) Ajouter un nouvel outil IA
1. Crée `/tools/<slug>/index.html` avec les IDs standards: `#prompt`, `#tone`, `#go`, `#status`, `#result`.
2. Ajoute `/tools/<slug>/script.js` qui appelle la function correspondante.
3. Crée `/netlify/functions/<slug>.js` (handler Node) qui appelle l'API OpenAI.
4. Ajoute une entrée dans `data/tools.registry.json` avec `enabled: true`.
5. Ajoute `tests/<slug>.smoke.spec.ts`.
6. Push → CI → déploiement → smoke.

## 5) Repo Agent (GPT)
- Fichier `.github/workflows/agent.yml` : commente `/agent plan` sur une Issue → l’agent prépare un patch (branche + PR).
- Requiert `OPENAI_API_KEY` et permissions `contents: write` pour créer la branche/PR.
- **Toujours** review + merge manuel (garde-fous).

## 6) Structure
```
.
├─ data/tools.registry.json
├─ netlify/functions/generate-bio.js
├─ public/styles.css
├─ tools/ai-bio-booster/index.html
├─ tools/ai-bio-booster/script.js
├─ _redirects
├─ index.html
├─ netlify.toml
├─ tests/smoke.spec.ts
└─ .github/workflows/{deploy.yml, agent.yml}
```

— Parlios – prêt pour l'industrialisation des mini‑outils IA.
## Release Note — AI Bio Booster v1.0 (www.parlios.fr)
- ✅ Backend OK: /.netlify/functions/generate-bio → { ok: true, health: "generate-bio-ready" }
- ✅ POST OK: return { ok: true, bio: "<phrase>" }
- ✅ UI OK: /tools/ai-bio-booster/ → prompt → “Générer” → bio + statut “✅ Prêt”
- 🔐 Sécurité: HSTS + XFO + CSP durcie (connect-src → api.openai.com)
- 🌐 Redirects: apex → www + .ca → .fr
# Procédure Parfaite v1.0 — Ajouter un outil IA (5 minutes)

**Pattern standard**
- Front: `/tools/<slug>/index.html` (+ IDs: #prompt, #tone, #go, #status, #result)
- Script: `/tools/<slug>/script.js` → POST `/.netlify/functions/<slug>`
- Function: `/netlify/functions/<slug>.js` → OpenAI (lit `OPENAI_API_KEY` côté Netlify)
- Registry: `data/tools.registry.json` → entrée { slug, name, description, enabled: true }
- Test: `tests/<slug>.smoke.spec.ts` (Playwright)
- SEO: title+meta sur la page
- Sécurité: CSP/HSTS dans netlify.toml (connect-src vers api.openai.com)

**Étapes**
1) `new-tool <slug> "<Name>" "<Description>"`  ← (script PS fourni)
2) Commit & push → CI déploie Netlify
3) Checks:
   - Health: `GET /.netlify/functions/<slug>` → `{ ok: true, health: "<slug>-ready" }`
   - POST: `POST /.netlify/functions/<slug>` → `{ ok: true, <payload> }`
   - UI: formulaire → Générer → ✅ + output
4) Ajout sur la home/index (si nécessaire) et sitemap (si géré statique)
5) PR Agent (optionnel): créer une Issue `/agent plan add: outil "<slug>"`

**Runbook incident**
- 502/401 function → `OPENAI_API_KEY` manquant/incorrect dans Netlify (runtime)
- Actions fail → `NETLIFY_AUTH_TOKEN` / `NETLIFY_SITE_ID` dans GitHub (CI)
- 405 → mauvaise méthode HTTP
- 404 page → check du chemin `/tools/<slug>/index.html`
- CORS → bloc dédié dans netlify.toml ok

## Release Note — Headline Wizard v1.0 (www.parlios.fr)
- ✅ Backend OK: /.netlify/functions/headline-wizard → { ok: true, health: "headline-wizard-ready" }
- ✅ POST OK: return { ok: true, output: "<titre>" }
- ✅ UI OK: /tools/headline-wizard/ → “Générer” → ✅ + titre
- 🧱 Runtime: CommonJS (Netlify), bundler esbuild
- 🔐 Policy: CSP/HSTS ok, connect-src → api.openai.com
- 🧽 CI fix: BOM UTF-8 supprimé (toml sans BOM) + .gitattributes (LF)
