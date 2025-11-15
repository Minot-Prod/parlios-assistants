const { callOpenAI, json, preflight } = require("./_lib/llm");
exports.handler = async (event) => {
  if(event.httpMethod==="OPTIONS") return preflight();
  try{
    const { prompt="", tone="pro" } = JSON.parse(event.body||"{}");
    const system = "Tu es un copywriter senior. Génère 10 titres clairs, orientés bénéfices, sans putaclic.";
    const user   = `Contexte: ${prompt}\nTon: ${tone}\nContraintes: 60 caractères max; FR; variété.`;
    const out = await callOpenAI({ system, prompt:user, max_tokens:400 });
    return json(200,{ ok:true, output:out });
  }catch(e){ return json(500,{ ok:false, error:String(e.message||e) }); }
};