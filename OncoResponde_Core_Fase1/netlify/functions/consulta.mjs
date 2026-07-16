const sources=[
  {name:'Sociedad Española de Oncología Médica (SEOM)',url:'https://seom.org/'},
  {name:'National Cancer Institute (NCI)',url:'https://www.cancer.gov/'},
  {name:'NCCN Guidelines for Patients',url:'https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients'}
];
export default async (req)=>{
  if(req.method!=='POST') return new Response(JSON.stringify({error:'Método no permitido'}),{status:405});
  const key=process.env.OPENAI_API_KEY;if(!key)return new Response(JSON.stringify({error:'OPENAI_API_KEY no está configurada en Netlify'}),{status:500});
  try{
    const {question,context}=await req.json();
    if(!question?.trim())return new Response(JSON.stringify({error:'La pregunta está vacía'}),{status:400});
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),24000);
    const prompt=`Eres OncoResponde, un educador sanitario para pacientes oncológicos y familiares. Orientación, no diagnóstico. Nunca sustituyas al equipo sanitario. No solicites datos identificativos. Contexto: ${context||'general'}. Responde en español claro, empático y no paternalista. Devuelve JSON válido con: summary (1 frase), answer (máximo 180 palabras), actions (3 recomendaciones prácticas), whenToConsult (cuándo contactar con el equipo o urgencias). Pregunta: ${question}`;
    const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-5-mini',input:prompt,max_output_tokens:500}),signal:controller.signal});
    clearTimeout(timeout);const raw=await r.json();if(!r.ok)throw new Error(raw?.error?.message||'Error de OpenAI');
    const text=raw.output_text||raw.output?.flatMap(x=>x.content||[]).map(x=>x.text||'').join('')||'';
    const cleaned=text.replace(/^```json\s*|\s*```$/g,'').trim();
    const parsed=JSON.parse(cleaned);
    return new Response(JSON.stringify({...parsed,sources}),{headers:{'Content-Type':'application/json'}});
  }catch(e){return new Response(JSON.stringify({error:e.name==='AbortError'?'La consulta ha tardado demasiado.':e.message||'Error inesperado'}),{status:500,headers:{'Content-Type':'application/json'}})}
};
