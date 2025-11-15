# Parlios Next Front Bundle

Ce bundle contient les fichiers nécessaires pour finaliser le pivot vers Next.js (template Netlify `next-platform-starter`).
**À extraire à la racine du dépôt** (`Minot-Prod/parlios-stack`).

## Contenu
- `web/app/tools/page.tsx` : liste des outils (ISR=60s)
- `web/app/tools/[slug]/page.tsx` : fiche outil
- `web/app/api/health/route.ts` : endpoint santé (Edge)
- `web/lib/tools.ts` : chargement du registre d'outils
- `web/components/ToolCard.tsx` : composant carte
- `netlify.toml` : configuration Netlify (plugin Next.js)
- `setup.ps1` : script PowerShell qui automatise l'installation, la copie d'assets et le commit.

## Usage rapide
1. Extraire à la racine du repo.
2. Dans PowerShell : `.\setup.ps1 -RepoRoot .`
3. Ouvrir une PR ou merger la branche `feat/next-front` puis déployer sur Netlify.
