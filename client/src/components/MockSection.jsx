import { useState } from 'react';

export default function MockSection({ mocks, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const max = mocks.length ? Math.max(...mocks.map(m => m.score), 100) : 100;

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || score === '') return;
    onAdd({ name: name.trim(), score: +score });
    setName(''); setScore(''); setShowForm(false);
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Mock Performance</div>
        <button className="btn btn-sm btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Cancel' : '＋ Add score'}
        </button>
      </div>

      {mocks.length === 0 && !showForm && (
        <p className="tiny" style={{ marginBottom: 12 }}>No mock scores yet. Add your first SIMCAT or mock result!</p>
      )}

      {mocks.length > 0 && (
        <div className="mock-chart">
          {mocks.map((m, i) => {
            const h = Math.max((m.score / max) * 88, 5);
            return (
              <div className="mock-bar-wrap" key={i}>
                <div className="mock-bar-val">{m.score}</div>
                <div className="mock-bar" style={{ height: `${h}px` }} />
                <div className="mock-bar-label">{m.name.replace('SIMCAT ', 'S').replace('Mock ', 'M')}</div>
              </div>
            );
          })}
        </div>
      )}

      {mocks.length > 0 && (
        <div className="mock-list">
          {mocks.slice().reverse().map((m, i) => {
            const realIndex = mocks.length - 1 - i;
            return (
              <div className="mock-row" key={realIndex}>
                <span className="mock-row-name">{m.name}</span>
                <span className="mock-row-score">{m.score}</span>
                <button className="mock-row-del" onClick={() => onDelete(realIndex)}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submit}
          style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 8, marginTop: 14 }}
        >
          <input
            className="inp"
            placeholder="Mock name (e.g. SIMCAT 12)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="inp"
            type="number"
            placeholder="Score"
            value={score}
            onChange={e => setScore(e.target.value)}
            required
          />
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-sm btn-primary">Save score</button>
          </div>
        </form>
      )}
    </div>
  );
}
