#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, '').split('=');
    return [k, rest.join('=')];
  })
);

const slug = (args.name || 'new-tool').toLowerCase().replace(/[^a-z0-9\-]/g, '-');
const title = args.title || 'Outil IA';
const desc  = args.desc  || 'Générateur IA prêt à l’emploi.';
const root  = process.cwd();

// 1) Netlify Function (CJS)
const fnDir = join(root, 'web', 'netlify', 'functions');
mkdirSync(fnDir, { recursive: true });
writeFileSync(join(fnDir, `${slug}.js`), `exports.handler = async (event) => {
  const cors = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "Content-Type,Authorization",
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors };
  }
  try {
    const { input = "" } = JSON.parse(event.body || "{}");
    let result = "Réponse générée (mock)";
    if (process.env.OPENAI_API_KEY) {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": \`Bearer \${process.env.OPENAI_API_KEY}\`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Assistant concis, utile." },
            { role: "user", content: input || "Démo." }
          ],
          temperature: 0.4,
        }),
      });
      const j = await r.json();
      result = j.choices?.[0]?.message?.content?.trim() || result;
    }
    return {
      statusCode: 200,
      headers: { ...cors, "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: true, tool: "${slug}", output: result }),
    };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ ok:false, error: e.message }) };
  }
};`, { encoding: 'utf8' });

// 2) Next.js page (app router)
const pageDir = join(root, 'web', 'app', 'tools', slug);
mkdirSync(pageDir, { recursive: true });
writeFileSync(join(pageDir, 'page.tsx'), `export const metadata = { title: "${title}" };

export default function Page() {
  return (
    <main style={{maxWidth: 760, margin: "40px auto", padding: 16}}>
      <h1 style={{fontSize: 28, fontWeight: 700}}>${title}</h1>
      <p style={{opacity: .8, marginBottom: 16}}>${desc}</p>
      <form id="f" onSubmit={async (e) => {
        e.preventDefault();
        const input = (document.getElementById('input') as HTMLTextAreaElement).value;
        const res = await fetch('/.netlify/functions/${slug}', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({ input }),
        });
        const data = await res.json();
        (document.getElementById('out') as HTMLTextAreaElement).value =
          (data.output || JSON.stringify(data, null, 2));
      }}>
        <label style={{display:'block', fontWeight:600}}>Entrée</label>
        <textarea id="input" rows={6} style={{width:'100%', marginBottom:12}}
          placeholder="Décris ce que tu veux générer..." />
        <button type="submit">Générer</button>
      </form>
      <label style={{display:'block', fontWeight:600, marginTop:16}}>Sortie</label>
      <textarea id="out" rows={8} style={{width:'100%'}} readOnly />
    </main>
  );
}
`, { encoding: 'utf8' });

console.log(`Scaffold OK → Function: netlify/functions/${slug}.js ; Page: app/tools/${slug}/page.tsx`);
