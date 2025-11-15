param(
  [Parameter(Mandatory=$true)][string]$slug,
  [Parameter(Mandatory=$true)][string]$name,
  [Parameter(Mandatory=$true)][string]$description
)

# 0) Normalisation
$slug = $slug.Trim().ToLower()
$toolDir = "tools/$slug"
$funcFile = "netlify/functions/$slug.js"
$testFile = "tests/$slug.smoke.spec.ts"
$registry = "data/tools.registry.json"

# 1) Dossiers
New-Item -ItemType Directory -Force -Path $toolDir | Out-Null
New-Item -ItemType Directory -Force -Path "netlify/functions" | Out-Null
New-Item -ItemType Directory -Force -Path "tests" | Out-Null

# 2) Page HTML
@"
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${name}</title>
  <meta name="description" content="${description}">
  <link rel="stylesheet" href="/public/styles.css">
  <script src="/tools/${slug}/script.js" defer></script>
</head>
<body>
  <main class="container">
    <header class="hero">
      <h1>${name} ⚡</h1>
      <p>${description}</p>
    </header>

    <section class="card">
      <label for="prompt">Entrée</label>
      <textarea id="prompt" placeholder="Décris ton besoin en 1-2 phrases."></textarea>

      <div class="row">
        <span class="label-inline">Ton:</span>
        <select id="tone">
          <option>LinkedIn</option>
          <option>Site pro</option>
          <option>Instagram</option>
          <option>Sober</option>
          <option>Punchy</option>
        </select>
        <button id="go">Générer</button>
      </div>

      <p id="status"></p>
      <pre id="result"></pre>
    </section>
  </main>
</body>
</html>
"@ | Set-Content -Encoding UTF8 "$toolDir/index.html"

# 3) Script front
@"
const \$ = (q) => document.querySelector(q);

async function callAPI(prompt, tone) {
  const res = await fetch("/.netlify/functions/${slug}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, tone })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Request failed");
  }
  return res.json();
}

window.addEventListener("DOMContentLoaded", () => {
  const promptEl = $("#prompt");
  const toneEl   = $("#tone");
  const btn      = $("#go");
  const statusEl = $("#status");
  const resultEl = $("#result");

  btn.addEventListener("click", async () => {
    const prompt = promptEl.value.trim();
    const tone   = toneEl.value;
    if (!prompt || prompt.length < 8) {
      statusEl.textContent = "Ajoute un minimum de contexte 👇";
      return;
    }
    statusEl.textContent = "Génération en cours...";
    resultEl.textContent = "";
    try {
      const data = await callAPI(prompt, tone);
      if (!data.ok) throw new Error(data.error || "Erreur API");
      resultEl.textContent = data.output || data.bio || JSON.stringify(data);
      statusEl.textContent = "✅ Prêt";
    } catch (e) {
      statusEl.textContent = "❌ " + (e.message || "Erreur");
    }
  });
});
"@ | Set-Content -Encoding UTF8 "$toolDir/script.js"

# 4) Function backend
@"
export async function handler(event) {
  if (event.httpMethod === 'GET') {
    return resp(200, { ok: true, health: '${slug}-ready' });
  }
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return resp(405, { ok:false, error:'Method not allowed' });
  }
  try {
    const { prompt, tone } = JSON.parse(event.body || '{}');
    if (!prompt || prompt.length < 8) {
      return resp(400, { ok:false, error:'Prompt requis' });
    }
    const sys = `Tu es un assistant de rédaction concis. Ton: \${tone || 'LinkedIn'}. Réponds court, utile.`;
    const usr = `Contexte: \${prompt}. Donne une seule sortie.`;

    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role:'system', content: sys }, { role:'user', content: usr }],
        temperature: 0.7
      })
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return resp(502, { ok:false, error:\`OpenAI: \${text}\` });
    }

    const j = await upstream.json();
    const output = j.choices?.[0]?.message?.content?.trim() || '';
    if(!output) return resp(500, { ok:false, error:'Réponse vide' });
    return resp(200, { ok:true, output }, true);
  } catch (e) {
    return resp(500, { ok:false, error: e.message || 'Erreur serveur' });
  }
}

function corsHeaders(){
  return {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers':'Content-Type, Authorization',
    'Access-Control-Allow-Methods':'POST, OPTIONS'
  };
}
function resp(status, obj, withCors=false){
  const h = { "Content-Type":"application/json" };
  if (withCors) Object.assign(h, corsHeaders());
  return { statusCode: status, headers: h, body: JSON.stringify(obj) };
}
"@ | Set-Content -Encoding UTF8 $funcFile

# 5) Test Playwright
@"
import { test, expect } from '@playwright/test';
test('${slug} smoke', async ({ page }) => {
  await page.goto('/tools/${slug}/');
  await page.locator('#prompt').fill('Contexte test rapide');
  await page.locator('#tone').selectOption({ label: 'LinkedIn' });
  await page.getByRole('button', { name: 'Générer' }).click();
  await expect(page.locator('#status')).toContainText('✅');
  await expect(page.locator('#result')).not.toBeEmpty();
});
"@ | Set-Content -Encoding UTF8 $testFile

# 6) Registry update
if (Test-Path $registry) {
  $json = Get-Content $registry -Raw | ConvertFrom-Json
} else {
  $json = @{ tools = @() } | ConvertTo-Json | ConvertFrom-Json
}
if (-not $json.tools) { $json | Add-Member -NotePropertyName tools -NotePropertyValue @() }
if (-not ($json.tools | Where-Object { $_.slug -eq $slug })) {
  $obj = [PSCustomObject]@{ slug=$slug; name=$name; description=$description; enabled=$true }
  $json.tools += $obj
}
($json | ConvertTo-Json -Depth 5) | Set-Content -Encoding UTF8 $registry

Write-Host "✅ Tool scaffolded: $slug"
