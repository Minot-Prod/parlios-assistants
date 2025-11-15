const { OPENAI_API_KEY } = process.env;

function preflight(){ return { statusCode:204, headers:{ "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"Content-Type", "Access-Control-Allow-Methods":"POST,OPTIONS" } }; }
function json(status, body){ return { statusCode:status, headers:{ "Content-Type":"application/json; charset=utf-8", "Access-Control-Allow-Origin":"*" }, body:JSON.stringify(body) }; }

async function callOpenAI({ system, prompt, model="gpt-4o-mini", temperature=0.7, max_tokens=600 }){
  if(!OPENAI_API_KEY) throw new Error("MISSING_OPENAI_API_KEY");
  const res = await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${OPENAI_API_KEY}` },
    body:JSON.stringify({ model, temperature, max_tokens, messages:[ {role:"system",content:system||""}, {role:"user",content:prompt||""} ] })
  });
  if(!res.ok){ const txt = await res.text(); throw new Error(`UPSTREAM_${res.status}:${txt}`); }
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content||"").trim();
}

module.exports = { callOpenAI, json, preflight };