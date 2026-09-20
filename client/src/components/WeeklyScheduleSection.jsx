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
  const map = ['sun','mon','tue','wed','thu','fri','sat'];
  return map[new Date().getDay()];
}

// Returns Monday of the current week
function weekMonday(offsetWeeks = 0) {
  const d = new Date();
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff + offsetWeeks * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmt(d) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function weekRangeLabel(offsetWeeks = 0) {
  const mon = weekMonday(offsetWeeks);
  const sun = new Date(mon);
  sun.setDate(sun.getDate() + 6);
  return `${fmt(mon)} – ${fmt(sun)}`;
}

function dateForDayKey(key, offsetWeeks = 0) {
  const keyIdx = ['mon','tue','wed','thu','fri','sat','sun'].indexOf(key);
  if (keyIdx === -1) return null;
  const mon = weekMonday(offsetWeeks);
  const d = new Date(mon);
  d.setDate(d.getDate() + keyIdx);
  return d;
}

function formatFullDate(d) {
  return d.toLocaleDateString('en-IN', {
    weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'
  });
}

export default function WeeklyScheduleSection({
  schedule, nextWeekSchedule,
  onToggle, onAdd, onDelete,
  onToggleNext, onAddNext, onDeleteNext,
}) {
  const [weekOffset, setWeekOffset]   = useState(0); // 0 = this week, 1 = next week
  const [activeDay, setActiveDay]     = useState(todayKey);
  const [newTask, setNewTask]         = useState('');
  const inputRef = useRef(null);

  const isNextWeek    = weekOffset === 1;
  const safeSchedule  = (isNextWeek ? nextWeekSchedule : schedule) || {};

  const activeDayData = DAYS.find(d => d.key === activeDay);
  const items  = safeSchedule[activeDay] || [];
  const done   = items.filter(x => x.done).length;
  const pct    = items.length ? Math.round((done / items.length) * 100) : 0;

  const totalTasks = DAYS.reduce((s, d) => s + (safeSchedule[d.key]?.length || 0), 0);
  const totalDone  = DAYS.reduce((s, d) => s + (safeSchedule[d.key]?.filter(x => x.done).length || 0), 0);

  // handlers depending on which week is active
  const handleToggle = isNextWeek ? onToggleNext : onToggle;
  const handleAdd_   = isNextWeek ? onAddNext    : onAdd;
  const handleDelete = isNextWeek ? onDeleteNext  : onDelete;

  function handleAdd(e) {
    e?.preventDefault();
    const trimmed = newTask.trim();
    if (!trimmed) return;
    handleAdd_(activeDay, trimmed);
    setNewTask('');
    inputRef.current?.focus();
  }

  return (
    <div className="weekly-schedule-wrap">

      {/* ─── Week switcher ─── */}
      <div className="week-switcher">
        <button
          className={`week-sw-btn${weekOffset === 0 ? ' active' : ''}`}
          onClick={() => { setWeekOffset(0); setActiveDay(todayKey()); }}
        >
          <span className="week-sw-icon">📅</span>
          <span className="week-sw-text">This Week</span>
        </button>
        <button
          className={`week-sw-btn${weekOffset === 1 ? ' active' : ''}`}
          onClick={() => { setWeekOffset(1); setActiveDay('mon'); }}
        >
          <span className="week-sw-icon">📆</span>
          <span className="week-sw-text">Next Week</span>
          {/* show count badge if next week has tasks */}
          {(() => {
            const nws = nextWeekSchedule || {};
            const n = DAYS.reduce((s, d) => s + (nws[d.key]?.length || 0), 0);
            return n > 0 ? <span className="week-sw-badge">{n}</span> : null;
          })()}
        </button>
      </div>

      {/* ─── Week summary card ─── */}
      <div className="card week-summary-card">
        <div className="card-head">
          <div>
            <div className="card-title">
              {isNextWeek ? '📆 Next Week' : '📅 This Week'}
              {isNextWeek && (
                <span className="next-week-chip">Planning Ahead</span>
              )}
            </div>
            <div className="mission-date">{weekRangeLabel(weekOffset)}</div>
          </div>
          <span className="card-badge">{totalDone}/{totalTasks}</span>
        </div>

        {/* Day tabs */}
        <div className="day-tabs">
          {DAYS.map(d => {
            const dayItems = safeSchedule[d.key] || [];
            const dayDone  = dayItems.filter(x => x.done).length;
            const isToday  = !isNextWeek && d.key === todayKey();
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

      {/* ─── Active day panel ─── */}
      <div className="card day-panel">
        <div className="card-head">
          <div>
            <div className="card-title">
              {activeDayData?.label}
              {!isNextWeek && activeDayData?.key === todayKey() && (
                <span className="today-chip">Today</span>
              )}
              {isNextWeek && (
                <span className="next-week-chip">Next Week</span>
              )}
            </div>
            {(() => {
              const d = dateForDayKey(activeDay, weekOffset);
              return d ? <div className="mission-date">{formatFullDate(d)}</div> : null;
            })()}
          </div>
          <span className="card-badge">{done}/{items.length}</span>
        </div>

        {items.length === 0 ? (
          <p className="tiny" style={{ marginBottom: 12, color: 'var(--ink-dim)' }}>
            No tasks for {activeDayData?.label}
            {isNextWeek ? ' next week' : ''} — add one below!
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
                  onChange={() => handleToggle(activeDay, i)}
                />
                <span className="task-text">{item.t}</span>
                <button
                  className="task-del"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(activeDay, i); }}
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
            placeholder={`＋ Add task for ${activeDayData?.label}${isNextWeek ? ' (next week)' : ''}…`}
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
              <div
                className="mission-fill"
                style={{
                  width: `${pct}%`,
                  background: isNextWeek
                    ? 'linear-gradient(90deg, var(--gold), #f59e0b)'
                    : undefined,
                }}
              />
            </div>
            <div className="mission-footer">
              <span className="xp-badge">⚡ +20 XP per task</span>
              <span>{pct}% complete</span>
            </div>
          </>
        )}

        {/* Next-week note */}
        {isNextWeek && (
          <p className="tiny" style={{ marginTop: 10, color: 'var(--ink-faint)' }}>
            💡 Tasks added here will auto-load into this week's schedule when next Monday arrives.
          </p>
        )}
      </div>

      {/* ─── Mini 7-day overview ─── */}
      <div className="week-overview-grid">
        {DAYS.map(d => {
          const dayItems = safeSchedule[d.key] || [];
          const dayDone  = dayItems.filter(x => x.done).length;
          const dayPct   = dayItems.length ? Math.round((dayDone / dayItems.length) * 100) : 0;
          const isActive = d.key === activeDay;
          const isToday  = !isNextWeek && d.key === todayKey();
          return (
            <button
              key={d.key}
              className={`week-overview-card${isActive ? ' active' : ''}${isToday ? ' today' : ''}${isNextWeek ? ' next-week' : ''}`}
              onClick={() => setActiveDay(d.key)}
            >
              <div className="week-ov-day">{d.short}</div>
              {isToday && <div className="week-ov-today-dot" />}
              <div className="week-ov-count">
                {dayItems.length === 0 ? '—' : `${dayDone}/${dayItems.length}`}
              </div>
              {dayItems.length > 0 && (
                <div className="week-ov-bar">
                  <div
                    className="week-ov-fill"
                    style={{
                      width: `${dayPct}%`,
                      background: isNextWeek ? 'var(--gold)' : undefined,
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
