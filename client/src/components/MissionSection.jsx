import { useState, useRef } from 'react';

// Format: "Saturday, 20 Sep 2026"
function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function MissionSection({
  title, icon, items,
  xpNote, xpReset,
  onToggle, onAdd, onDelete,
  // optional: today's scheduled tasks from WeeklySchedule
  scheduledItems, onToggleScheduled,
}) {
  const [newTask, setNewTask] = useState('');
  const inputRef = useRef(null);

  const schedItems = scheduledItems || [];
  const allItems   = [...schedItems, ...items];
  const done       = allItems.filter(x => x.done).length;
  const pct        = allItems.length ? Math.round((done / allItems.length) * 100) : 0;

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
        <div>
          <div className="card-title">{title}</div>
          <div className="mission-date">{formatDate()}</div>
        </div>
        <span className="card-badge">{done}/{allItems.length}</span>
      </div>

      {/* ── Scheduled tasks pulled from Weekly Schedule ── */}
      {schedItems.length > 0 && (
        <div className="sched-section">
          <div className="sched-label">📅 From Weekly Schedule</div>
          <div className="task-list">
            {schedItems.map((item, i) => (
              <label key={`sched-${i}`} className={`task-item sched-task${item.done ? ' done' : ''}`}>
                <div className="task-checkbox">{item.done ? '✓' : ''}</div>
                <input
                  type="checkbox"
                  hidden
                  checked={item.done}
                  onChange={() => onToggleScheduled?.(i)}
                />
                <span className="task-text">{item.t}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Custom mission tasks ── */}
      {schedItems.length > 0 && items.length > 0 && (
        <div className="sched-label" style={{ marginTop: 14, marginBottom: 4 }}>✏️ Extra Tasks</div>
      )}

      {items.length === 0 && schedItems.length === 0 ? (
        <p className="tiny" style={{ marginBottom: 12 }}>No tasks yet — add your first one below!</p>
      ) : items.length > 0 ? (
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
      ) : null}

      <form className="add-task-row" onSubmit={handleAdd}>
        <input
          ref={inputRef}
          className="add-task-input"
          placeholder="＋ Add an extra task and press Enter…"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          aria-label={`Add task to ${title}`}
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={!newTask.trim()}>
          Add
        </button>
      </form>

      {allItems.length > 0 && (
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
