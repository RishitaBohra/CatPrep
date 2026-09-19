import { useState } from 'react';

export default function MockCard({ mocks, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const max = Math.max(...mocks.map((m) => m.score), 100);

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || score === '') return;
    onAdd({ name: name.trim(), score: +score });
    setName('');
    setScore('');
    setShowForm(false);
  }

  return (
    <div className="card">
      <div className="cardhead">
        <div className="title">📈 Mock Performance</div>
        <div className="tiny">Recent scores</div>
      </div>

      <div className="chart">
        {mocks.map((m, i) => (
          <div className="barwrap" key={i}>
            <div className="bar" style={{ height: `${(m.score / max) * 85}px` }} />
            <div className="barlabel">{m.name.replace('SIMCAT ', 'S')}</div>
          </div>
        ))}
      </div>

      <div className="mocks">
        {mocks.slice().reverse().map((m, i) => {
          const realIndex = mocks.length - 1 - i;
          return (
            <div className="mock" key={realIndex}>
              <span>{m.name}</span>
              <span className="score">{m.score}</span>
              <button className="logdel" onClick={() => onDelete(realIndex)}>✕</button>
            </div>
          );
        })}
      </div>

      {showForm ? (
        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 8, marginTop: 10 }}>
          <input placeholder="Mock name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: 9, borderRadius: 9, border: '1px solid var(--border)', background: '#0f111c', color: 'inherit' }} required />
          <input type="number" placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} style={{ padding: 9, borderRadius: 9, border: '1px solid var(--border)', background: '#0f111c', color: 'inherit' }} required />
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
            <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn primary">Add score</button>
          </div>
        </form>
      ) : (
        <button className="btn" style={{ marginTop: 10 }} onClick={() => setShowForm(true)}>＋ Add mock score</button>
      )}
    </div>
  );
}
