const { callOpenAI, json, preflight } = require("./_lib/llm");
exports.handler = async (event) => {
  if(event.httpMethod==="OPTIONS") return preflight();
  try{
    const { prompt="", tone="pro" } = JSON.parse(event.body||"{}");
    const system = "Tu es un rédacteur LinkedIn. Écris une bio concise (3–4 phrases) orientée résultats.";
    const user   = `Infos: ${prompt}\nTon: ${tone}\nInclure: crédibilité, compétences clés, preuve sociale, CTA soft.`;
    const out = await callOpenAI({ system, prompt:user, max_tokens:300 });
    return json(200,{ ok:true, output:out, bio:out });
  }catch(e){ return json(500,{ ok:false, error:String(e.message||e) }); }
};