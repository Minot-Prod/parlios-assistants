const { callOpenAI, json, preflight } = require("./_lib/llm");
exports.handler = async (event) => {
  if(event.httpMethod==="OPTIONS") return preflight();
  try{
    const { prompt="", tone="pro" } = JSON.parse(event.body||"{}");
    const system = "Tu es PMM. Rédige une proposition de valeur claire (Problème, Promesse, Preuves, CTA).";
    const user   = `Données: ${prompt}\nTon: ${tone}\nFormat: sections courtes (markdown).`;
    const out = await callOpenAI({ system, prompt:user, max_tokens:500 });
    return json(200,{ ok:true, output:out });
  }catch(e){ return json(500,{ ok:false, error:String(e.message||e) }); }
};