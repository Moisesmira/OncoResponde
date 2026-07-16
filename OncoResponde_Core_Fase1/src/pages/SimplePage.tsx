import NavHeader from '../components/NavHeader';import OncoBox from '../components/OncoBox';
export default function SimplePage({title,children}:{title:string;children?:React.ReactNode}){return <main><NavHeader title={title}/><section className="card">{children||<p>Este módulo está preparado para la siguiente fase del desarrollo.</p>}</section><OncoBox context={title}/></main>}
