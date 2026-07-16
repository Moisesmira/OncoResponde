import { Link } from 'react-router-dom';
import OncoBox from '../components/OncoBox';
import { useAppStore } from '../store/useAppStore';
const rec:any={bien:['Muévete','Aliméntate mejor','Mi Camino'],regular:['Descansa mejor','Encuentra calma','Mi Camino'],preocupado:['Respira','Cómo te sientes','Háblame'],apoyo:['Un minuto para ti','Respira','Teléfonos de apoyo']};
export default function Today(){const{mood,setMood}=useAppStore();const hour=new Date().getHours();const greet=hour<12?'Buenos días':hour<20?'Buenas tardes':'Buenas noches';return <main>
<section className="hero"><img src="/assets/camino.png" alt="Persona caminando por un sendero"/><div className="hero-overlay"><h1>{greet}</h1><p>Estoy aquí para ayudarte a comprender mejor lo que estás viviendo.</p></div></section>
<section className="card featured"><h2>💙 Háblame</h2><p>Cuéntame qué necesitas o qué te preocupa.</p><div className="row"><Link className="button" to="/hablame">🎤 Hablar</Link><Link className="button secondary" to="/oncoayuda">✍️ Escribir</Link></div></section>
<section className="card"><h2>¿Cómo te encuentras hoy?</h2><div className="moods">{[['bien','Bien'],['regular','Regular'],['preocupado','Preocupado'],['apoyo','Necesito apoyo']].map(([id,label])=><button className={mood===id?'active':''} onClick={()=>setMood(id as any)} key={id}>{label}</button>)}</div>{mood&&<div className="recommend"><div className="energy"><span/><span/><span className={mood==='bien'?'on':''}/></div><h3>Tu plan para hoy</h3>{rec[mood].map((x:string)=><span className="chip" key={x}>{x}</span>)}</div>}</section>
<OncoBox context="hoy"/>
<section><h2>Todo lo que puede ayudarte</h2><div className="grid">{[['/perfil','Cuéntame sobre tu cáncer'],['/cuidate','Cuídate'],['/calma','Encuentra calma'],['/camino','Mi Camino'],['/preparate','Prepárate'],['/familia','Familia'],['/fuentes','Fuentes fiables'],['/ajustes','Ajustes']].map(([to,label],i)=><Link className={'tile t'+(i%5)} to={to} key={to}><strong>{label}</strong><span>→</span></Link>)}</div></section>
</main>}
