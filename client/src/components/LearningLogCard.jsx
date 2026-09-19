import { useState } from 'react';

export default function LearningLogCard({ entries, onAdd, onDelete }) {
  const [text, setText] = useState('');

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  }

  return (
    <div className="card">
      <div className="cardhead">
        <div className="title">📝 Learning Log</div>
        <div className="tiny">Kept even on reset</div>
      </div>

      {entries.length === 0 ? (
        <div className="tiny">No entries yet. Add your first learning below.</div>
      ) : (
        <div>
          {entries.map((x, i) => (
            <div className="logentry" key={i}>
              <span className="logdate">{x.date}</span>
              <span className="logtext">{x.text}</span>
              <button className="logdel" onClick={() => onDelete(i)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <textarea
        className="field-input"
        placeholder="Write an important learning, mistake to avoid, or takeaway..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn" style={{ marginTop: 8 }} onClick={submit}>＋ Add entry</button>
    </div>
  );
}
