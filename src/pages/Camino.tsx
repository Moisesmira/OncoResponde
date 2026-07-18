import { useMemo, useState } from 'react';
import NavHeader from '../components/NavHeader';
import OncoBox from '../components/OncoBox';

type CaminoEntry = { id: string; date: string; title: string; text: string; gratitude: string };
const KEY = 'oncoresponde_camino_entries_v1';

function loadEntries(): CaminoEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export default function Camino() {
  const [entries, setEntries] = useState<CaminoEntry[]>(loadEntries);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [gratitude, setGratitude] = useState('');

  const recentContext = useMemo(() => entries.slice(0, 3).map((entry) => `${entry.date}: ${entry.title || 'Entrada personal'}`).join(' · '), [entries]);

  const save = () => {
    if (!text.trim() && !gratitude.trim()) return;
    const next = [{ id: crypto.randomUUID(), date: new Date().toLocaleDateString('es-ES'), title: title.trim(), text: text.trim(), gratitude: gratitude.trim() }, ...entries];
    setEntries(next); localStorage.setItem(KEY, JSON.stringify(next));
    setTitle(''); setText(''); setGratitude('');
  };

  const remove = (id: string) => {
    const next = entries.filter((entry) => entry.id !== id);
    setEntries(next); localStorage.setItem(KEY, JSON.stringify(next));
  };

  return <main className="journey-page">
    <NavHeader title="Mi camino" />
    <section className="journey-hero">
      <span className="section-kicker">Tu espacio personal</span>
      <h1>Escribe lo que necesites recordar</h1>
      <p>Un diario privado para anotar emociones, pequeños avances, dudas o momentos importantes. Todo queda guardado únicamente en este dispositivo.</p>
    </section>

    <section className="card journey-form">
      <h2>Nueva entrada</h2>
      <label>Título opcional<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Por ejemplo: Después de la consulta" maxLength={80}/></label>
      <label>¿Qué quieres dejar por escrito?<textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe con tus propias palabras…" maxLength={2500}/></label>
      <label>Algo que hoy te ha ayudado<textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="Una persona, una conversación, un paseo, una noticia…" maxLength={500}/></label>
      <button type="button" onClick={save} disabled={!text.trim() && !gratitude.trim()}>Guardar entrada</button>
    </section>

    <section className="card">
      <div className="section-heading section-heading--compact"><div><span className="section-kicker">Tu diario</span><h2>Entradas recientes</h2></div><p>{entries.length} guardada{entries.length === 1 ? '' : 's'}</p></div>
      {entries.length ? <div className="journey-list">{entries.map((entry) => <article key={entry.id}>
        <div><small>{entry.date}</small><h3>{entry.title || 'Entrada personal'}</h3>{entry.text && <p>{entry.text}</p>}{entry.gratitude && <blockquote>Hoy me ayudó: {entry.gratitude}</blockquote>}</div>
        <button type="button" className="journey-delete" onClick={() => remove(entry.id)}>Eliminar</button>
      </article>)}</div> : <p className="muted">Aún no has escrito ninguna entrada. No hay una forma correcta de empezar.</p>}
    </section>

    <OncoBox contextId="camino" context={`Diario personal y acompañamiento emocional. Entradas recientes registradas: ${recentContext || 'ninguna'}. No interpretar ni diagnosticar; responder con escucha, validación y propuestas breves.`} title="Hablar sobre lo que estás viviendo" buttonLabel="Compartir con OncoResponde" />
  </main>;
}
