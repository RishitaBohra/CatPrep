import { useState, useRef } from 'react';

export default function MissionSection({ title, icon, items, xpNote, xpReset, onToggle, onAdd, onDelete }) {
  const [newTask, setNewTask] = useState('');
  const inputRef = useRef(null);
  const done = items.filter(x => x.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  function handleAdd(e) {
    e?.preventDefault();
    const trimmed = newTask.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewTask('');
    inputRef.current?.focus();
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">
          {title}
        </div>
        <span className="card-badge">{done}/{items.length}</span>
      </div>

      {items.length === 0 ? (
        <p className="tiny" style={{ marginBottom: 12 }}>No tasks yet — add your first one below!</p>
      ) : (
        <div className="task-list">
          {items.map((item, i) => (
            <label key={i} className={`task-item${item.done ? ' done' : ''}`}>
              <div className="task-checkbox">{item.done ? '✓' : ''}</div>
              <input
                type="checkbox"
                hidden
                checked={item.done}
                onChange={() => onToggle(i)}
              />
              <span className="task-text">{item.t}</span>
              <button
                className="task-del"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(i); }}
                aria-label="Remove task"
              >✕</button>
            </label>
          ))}
        </div>
      )}

      <form className="add-task-row" onSubmit={handleAdd}>
        <input
          ref={inputRef}
          className="add-task-input"
          placeholder="＋ Add a task and press Enter…"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          aria-label={`Add task to ${title}`}
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={!newTask.trim()}>
          Add
        </button>
      </form>

      {items.length > 0 && (
        <>
          <div className="mission-prog">
            <div className="mission-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="mission-footer">
            <span className="xp-badge">⚡ {xpNote}</span>
            <span>{pct}% complete · {xpReset}</span>
          </div>
        </>
      )}
    </div>
  );
}
