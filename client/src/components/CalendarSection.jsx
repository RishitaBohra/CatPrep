import { useState, useEffect } from 'react';

// Persist calendar data per-user in localStorage
function storageKey(year, month) {
  return `cat-cal-${year}-${String(month + 1).padStart(2, '0')}`;
}

function loadMonth(year, month) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(year, month)) || '{}');
  } catch {
    return {};
  }
}

function saveMonth(year, month, data) {
  localStorage.setItem(storageKey(year, month), JSON.stringify(data));
}

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const STATUS_CYCLE = [null, 'full', 'partial', 'missed'];
const STATUS_META  = {
  full:    { label: 'Full study day',    color: 'var(--green)',  bg: 'var(--green-bg)',  short: 'F' },
  partial: { label: 'Partial study day', color: 'var(--gold)',   bg: 'var(--amber-bg)', short: 'P' },
  missed:  { label: 'Missed day',        color: 'var(--red)',    bg: 'var(--red-bg)',   short: 'M' },
};

export default function CalendarSection() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [data,  setData]  = useState(() => loadMonth(today.getFullYear(), today.getMonth()));
  const [selected, setSelected] = useState(null); // date key 'YYYY-MM-DD'
  const [noteText, setNoteText] = useState('');

  // Reload when month/year changes
  useEffect(() => {
    setData(loadMonth(year, month));
    setSelected(null);
  }, [year, month]);

  function persist(next) {
    setData(next);
    saveMonth(year, month, next);
  }

  function dayKey(d) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function cycleStatus(d) {
    const k   = dayKey(d);
    const cur = data[k]?.status ?? null;
    const idx = STATUS_CYCLE.indexOf(cur);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    const entry = { ...(data[k] || {}), status: next };
    if (!next) delete entry.status;
    const next_data = { ...data, [k]: entry };
    if (!next) { delete next_data[k]; }
    persist(next_data);
  }

  function selectDay(d) {
    const k = dayKey(d);
    setSelected(k);
    setNoteText(data[k]?.note || '');
  }

  function saveNote() {
    if (!selected) return;
    const trimmed = noteText.trim();
    const entry = { ...(data[selected] || {}) };
    if (trimmed) entry.note = trimmed;
    else delete entry.note;
    if (!entry.status && !entry.note) {
      const nd = { ...data };
      delete nd[selected];
      persist(nd);
    } else {
      persist({ ...data, [selected]: entry });
    }
    setSelected(null);
    setNoteText('');
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  // Build grid
  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Stats
  const full    = Object.values(data).filter(v => v?.status === 'full').length;
  const partial = Object.values(data).filter(v => v?.status === 'partial').length;
  const missed  = Object.values(data).filter(v => v?.status === 'missed').length;
  const noted   = Object.values(data).filter(v => v?.note).length;

  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const selectedEntry = selected ? (data[selected] || {}) : null;

  return (
    <div className="card">
      {/* ── Header ── */}
      <div className="card-head">
        <div className="card-title">Study Calendar</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-sm" onClick={prevMonth}>‹</button>
          <span style={{ fontSize: 14, fontWeight: 600, minWidth: 130, textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </span>
          <button className="btn btn-sm" onClick={nextMonth}>›</button>
        </div>
      </div>

      {/* ── Monthly stats row ── */}
      <div className="cal-stats">
        <div className="cal-stat" style={{ color: 'var(--green)' }}>
          <span className="cal-stat-num">{full}</span>
          <span className="cal-stat-lbl">Full days</span>
        </div>
        <div className="cal-stat" style={{ color: 'var(--gold)' }}>
          <span className="cal-stat-num">{partial}</span>
          <span className="cal-stat-lbl">Partial</span>
        </div>
        <div className="cal-stat" style={{ color: 'var(--red)' }}>
          <span className="cal-stat-num">{missed}</span>
          <span className="cal-stat-lbl">Missed</span>
        </div>
        <div className="cal-stat" style={{ color: 'var(--violet)' }}>
          <span className="cal-stat-num">{noted}</span>
          <span className="cal-stat-lbl">Notes</span>
        </div>
      </div>

      {/* ── Day headers ── */}
      <div className="cal-grid">
        {DAYS.map(d => (
          <div key={d} className="cal-day-header">{d}</div>
        ))}

        {/* Empty cells */}
        {cells.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} className="cal-cell empty" />;

          const k       = dayKey(d);
          const entry   = data[k] || {};
          const status  = entry.status;
          const meta    = status ? STATUS_META[status] : null;
          const isToday = k === todayKey && year === today.getFullYear() && month === today.getMonth();
          const hasNote = !!entry.note;

          return (
            <div
              key={d}
              className={`cal-cell${isToday ? ' today' : ''}${selected === k ? ' selected' : ''}`}
              style={meta ? { background: meta.bg, borderColor: meta.color } : {}}
            >
              <button
                className="cal-num"
                style={meta ? { color: meta.color } : isToday ? { color: 'var(--violet)', fontWeight: 700 } : {}}
                onClick={() => cycleStatus(d)}
                title={meta ? `${meta.label} — click to change` : 'Click to mark study day'}
              >
                {d}
              </button>
              {status && (
                <div className="cal-badge" style={{ background: meta.color }}>
                  {meta.short}
                </div>
              )}
              {hasNote && (
                <div className="cal-note-dot" title={entry.note} />
              )}
              <button
                className="cal-note-btn"
                onClick={() => selectDay(d)}
                title="Add / view note"
              >
                +
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div className="cal-legend">
        <span className="tiny">Click date to cycle: </span>
        {Object.entries(STATUS_META).map(([k, v]) => (
          <span key={k} className="cal-legend-item" style={{ color: v.color }}>
            <span className="cal-legend-dot" style={{ background: v.color }} />
            {v.label}
          </span>
        ))}
      </div>

      {/* ── Note panel ── */}
      {selected && (
        <div className="cal-note-panel">
          <div className="cal-note-header">
            <span style={{ fontWeight: 600, fontSize: 13 }}>
              Note for {selected}
            </span>
            <button className="btn btn-sm" onClick={() => setSelected(null)}>✕</button>
          </div>
          {selectedEntry?.status && (
            <div style={{ marginBottom: 8, fontSize: 12, color: STATUS_META[selectedEntry.status]?.color }}>
              Marked as: {STATUS_META[selectedEntry.status]?.label}
            </div>
          )}
          <textarea
            className="inp"
            rows={3}
            placeholder="What did you study? Any key takeaways or blockers?"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-sm" onClick={() => setSelected(null)}>Cancel</button>
            <button className="btn btn-sm btn-primary" onClick={saveNote}>Save note</button>
          </div>
        </div>
      )}
    </div>
  );
}
