
Param(
  [string]$RepoRoot = "."
)

Write-Host "=== Parlios Next Front Setup (Next Platform) ===" -ForegroundColor Cyan
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Ensure degit and netlify-cli exist hints
Write-Host "Assurez-vous d'avoir Node.js, npm et Git installés." -ForegroundColor Yellow
Write-Host "Si besoin: npm i -g degit netlify-cli" -ForegroundColor Yellow

# Create branch
Push-Location $RepoRoot
git checkout -b "feat/next-front"

# Scaffold Next platform inside /web if missing
if (!(Test-Path "web/app")) {
  Write-Host "Installation du template Netlify Next Platform dans /web..." -ForegroundColor Cyan
  npx degit netlify-templates/next-platform-starter web
} else {
  Write-Host "/web existe déjà, on continue avec l'intégration." -ForegroundColor Yellow
}

# Ensure npm install
Push-Location "web"
npm install
Pop-Location

# Copy data file and favicons/manifest if present at repo root
if (Test-Path "data/tools.registry.json") {
  New-Item -ItemType Directory -Force -Path "web/data" | Out-Null
  Copy-Item "data/tools.registry.json" "web/data/tools.registry.json" -Force
} else {
  Write-Warning "data/tools.registry.json introuvable à la racine: créez-le puis relancez ce script."
}

$favicons = @(
  "favicon.ico", "favicon-16x16.png", "favicon-32x32.png",
  "apple-touch-icon.png"
)
$androids = Get-ChildItem -Path . -Filter "android-chrome-*.png" -ErrorAction SilentlyContinue

foreach ($f in $favicons) {
  if (Test-Path $f) { Copy-Item $f "web/public/" -Force }
}
foreach ($f in $androids) {
  Copy-Item $f.FullName "web/public/" -Force
}
if (Test-Path "site.webmanifest") {
  Copy-Item "site.webmanifest" "web/public/site.webmanifest" -Force
}

# Write project files from bundle into repo
function Copy-FromBundle($relPath) {
  $src = Join-Path "$PSScriptRoot" $relPath
  $dst = Join-Path "$RepoRoot" $relPath
  $dstDir = Split-Path $dst -Parent
  New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
  Copy-Item $src $dst -Force
}

Copy-FromBundle "web/lib/tools.ts"
Copy-FromBundle "web/components/ToolCard.tsx"
Copy-FromBundle "web/app/tools/page.tsx"
Copy-FromBundle "web/app/tools/[slug]/page.tsx"
Copy-FromBundle "web/app/api/health/route.ts"
Copy-FromBundle "netlify.toml"

# Build
Write-Host "Build Next.js..." -ForegroundColor Cyan
Push-Location "web"
npm run build
Pop-Location

# Commit
git add -A
git commit -m "feat(front): Next.js + catalogue outils (ISR)"
Write-Host "Branche prête: feat/next-front" -ForegroundColor Green

# Optional: quick health check (will work after deploy)
Write-Host "Après déploiement Netlify, testez:" -ForegroundColor Cyan
Write-Host 'Invoke-RestMethod -Uri "https://www.parlios.fr/.netlify/functions/health"' -ForegroundColor Magenta

Pop-Location
