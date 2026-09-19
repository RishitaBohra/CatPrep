import { useState } from 'react';

export default function LearningLogSection({ entries, onAdd, onDelete }) {
  const [text, setText] = useState('');

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Learning Log</div>
        <span className="card-badge">{entries.length} entries</span>
      </div>

      <p className="tiny" style={{ marginBottom: 14 }}>
        Capture key takeaways, mistakes to avoid, and breakthrough moments. This log is preserved even on reset.
      </p>

      {entries.length > 0 && (
        <div className="log-list">
          {entries.map((x, i) => (
            <div className="log-entry" key={i}>
              <span className="log-date">{x.date}</span>
              <span className="log-text">{x.text}</span>
              <button className="log-del" onClick={() => onDelete(i)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: entries.length ? 16 : 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <textarea
          className="inp"
          placeholder="Write a key insight, concept, or mistake to remember…"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
        />
        <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-end' }} onClick={submit} disabled={!text.trim()}>
          Add entry
        </button>
      </div>
    </div>
  );
}
