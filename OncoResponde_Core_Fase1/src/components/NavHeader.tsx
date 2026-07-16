import { useNavigate } from 'react-router-dom';
export default function NavHeader({title}:{title:string}){const nav=useNavigate();return <header className="nav-header"><button onClick={()=>nav(-1)}>← Volver</button><h1>{title}</h1><button onClick={()=>nav('/')}>⌂ Hoy</button></header>}
