import { useState, useRef } from 'react';

const DAYS = [
  { key: 'mon', label: 'Monday',    short: 'Mon' },
  { key: 'tue', label: 'Tuesday',   short: 'Tue' },
  { key: 'wed', label: 'Wednesday', short: 'Wed' },
  { key: 'thu', label: 'Thursday',  short: 'Thu' },
  { key: 'fri', label: 'Friday',    short: 'Fri' },
  { key: 'sat', label: 'Saturday',  short: 'Sat' },
  { key: 'sun', label: 'Sunday',    short: 'Sun' },
];

function todayKey() {
  const idx = new Date().getDay(); // 0=Sun,1=Mon,...,6=Sat
  const map = ['sun','mon','tue','wed','thu','fri','sat'];
  return map[idx];
}

export default function WeeklyScheduleSection({ schedule, onToggle, onAdd, onDelete }) {
  const [activeDay, setActiveDay] = useState(todayKey);
  const [newTask, setNewTask] = useState('');
  const inputRef = useRef(null);

  // Ensure we always have a valid object even if server returns nothing
  const safeSchedule = schedule || {};

  const activeDayData = DAYS.find(d => d.key === activeDay);
  const items = safeSchedule[activeDay] || [];
  const done  = items.filter(x => x.done).length;
  const pct   = items.length ? Math.round((done / items.length) * 100) : 0;

  // Total across all days for the week summary
  const totalTasks = DAYS.reduce((s, d) => s + (safeSchedule[d.key]?.length || 0), 0);
  const totalDone  = DAYS.reduce((s, d) => s + (safeSchedule[d.key]?.filter(x => x.done).length || 0), 0);

  function handleAdd(e) {
    e?.preventDefault();
    const trimmed = newTask.trim();
    if (!trimmed) return;
    onAdd(activeDay, trimmed);
    setNewTask('');
    inputRef.current?.focus();
  }

  return (
    <div className="weekly-schedule-wrap">
      {/* Week summary bar */}
      <div className="card week-summary-card">
        <div className="card-head">
          <div className="card-title">📅 Weekly Schedule</div>
          <span className="card-badge">{totalDone}/{totalTasks} this week</span>
        </div>

        {/* Day tab selector */}
        <div className="day-tabs">
          {DAYS.map(d => {
            const dayItems = safeSchedule[d.key] || [];
            const dayDone  = dayItems.filter(x => x.done).length;
            const isToday  = d.key === todayKey();
            return (
              <button
                key={d.key}
                className={`day-tab${activeDay === d.key ? ' active' : ''}${isToday ? ' today' : ''}`}
                onClick={() => setActiveDay(d.key)}
              >
                <span className="day-tab-short">{d.short}</span>
                {dayItems.length > 0 && (
                  <span className="day-tab-count">{dayDone}/{dayItems.length}</span>
                )}
                {isToday && <span className="today-dot" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active day panel */}
      <div className="card day-panel">
        <div className="card-head">
          <div className="card-title">
            {activeDayData?.label}
            {activeDayData?.key === todayKey() && (
              <span className="today-chip">Today</span>
            )}
          </div>
          <span className="card-badge">{done}/{items.length}</span>
        </div>

        {items.length === 0 ? (
          <p className="tiny" style={{ marginBottom: 12, color: 'var(--ink-dim)' }}>
            No tasks for {activeDayData?.label} — add one below!
          </p>
        ) : (
          <div className="task-list">
            {items.map((item, i) => (
              <label key={i} className={`task-item${item.done ? ' done' : ''}`}>
                <div className="task-checkbox">{item.done ? '✓' : ''}</div>
                <input
                  type="checkbox"
                  hidden
                  checked={item.done}
                  onChange={() => onToggle(activeDay, i)}
                />
                <span className="task-text">{item.t}</span>
                <button
                  className="task-del"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(activeDay, i); }}
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
            placeholder={`＋ Add task for ${activeDayData?.label}…`}
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            aria-label={`Add task for ${activeDayData?.label}`}
          />
          <button type="submit" className="btn btn-primary btn-sm" disabled={!newTask.trim()}>
            Add
          </button>
        </form>

        {items.length > 0 && (
          <>
            <div className="mission-prog" style={{ marginTop: 12 }}>
              <div className="mission-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="mission-footer">
              <span className="xp-badge">⚡ +20 XP per task</span>
              <span>{pct}% complete</span>
            </div>
          </>
        )}
      </div>

      {/* Mini overview of all 7 days */}
      <div className="week-overview-grid">
        {DAYS.map(d => {
          const dayItems = safeSchedule[d.key] || [];
          const dayDone  = dayItems.filter(x => x.done).length;
          const dayPct   = dayItems.length ? Math.round((dayDone / dayItems.length) * 100) : 0;
          const isActive = d.key === activeDay;
          const isToday  = d.key === todayKey();
          return (
            <button
              key={d.key}
              className={`week-overview-card${isActive ? ' active' : ''}${isToday ? ' today' : ''}`}
              onClick={() => setActiveDay(d.key)}
            >
              <div className="week-ov-day">{d.short}</div>
              {isToday && <div className="week-ov-today-dot" />}
              <div className="week-ov-count">
                {dayItems.length === 0 ? '—' : `${dayDone}/${dayItems.length}`}
              </div>
              {dayItems.length > 0 && (
                <div className="week-ov-bar">
                  <div className="week-ov-fill" style={{ width: `${dayPct}%` }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
