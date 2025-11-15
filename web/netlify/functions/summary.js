const { callOpenAI, json, preflight } = require("./_lib/llm");
exports.handler = async (event) => {
  if(event.httpMethod==="OPTIONS") return preflight();
  try{
    const { prompt="", tone="pro" } = JSON.parse(event.body||"{}");
    const system = "Tu es analyste. Résume en 5 points actionnables + 3 risques + 3 prochaines étapes (markdown).";
    const user   = `Texte: ${prompt}\nTon: ${tone}`;
    const out = await callOpenAI({ system, prompt:user, max_tokens:500 });
    return json(200,{ ok:true, output:out });
  }catch(e){ return json(500,{ ok:false, error:String(e.message||e) }); }
};