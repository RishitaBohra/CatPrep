import { useState } from 'react';

const EMPTY_FORM = { name: '', emoji: '🔹', total: 50, daily: 1, period: 'day' };

const inp = {
  padding: '9px 12px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-xs)',
  background: 'var(--bg-input)',
  color: 'var(--ink)',
  fontSize: 13,
  outline: 'none',
  width: '100%',
  transition: 'var(--transition)',
};

export default function TargetsSection({ targets, days, onIncrement, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function upd(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.total) return;
    onAdd({ ...form, name: form.name.trim(), total: +form.total, daily: +form.daily || 1, done: 0 });
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Your Targets</div>
        <button className="btn btn-sm btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Cancel' : '＋ Add target'}
        </button>
      </div>

      {targets.length === 0 && !showForm && (
        <p className="tiny">No targets yet. Add one to start tracking your long-term prep goals.</p>
      )}

      <div className="target-list">
        {targets.map((x, i) => {
          const pct = x.total ? Math.min((x.done / x.total) * 100, 100) : 0;
          const rem = Math.max(x.total - x.done, 0);
          const perDay = days ? rem / days : 0;
          const unit = x.period === 'week' ? 'week' : 'day';
          const rate = (x.period === 'week' ? perDay * 7 : perDay).toFixed(1);
          const st = x.status || { color: 'green', label: 'ON TRACK' };
          return (
            <div key={i}>
              <div className="target-header">
                <span className="target-name">{x.emoji} {x.name}</span>
                <span className="target-count">{x.done} / {x.total}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="target-meta">
                <span>{rem} left · ~{rate}/{unit} needed</span>
                <span className={`status-badge ${st.color}`}>{st.label}</span>
              </div>
              <div className="target-actions">
                <button className="btn btn-sm" onClick={() => onIncrement(i, -1)}>−</button>
                <button className="btn btn-sm btn-primary" onClick={() => onIncrement(i, 1)}>＋ Done</button>
                <button className="btn btn-sm btn-danger" style={{ marginLeft: 'auto' }} onClick={() => onDelete(i)}>Remove</button>
              </div>
              {i < targets.length - 1 && <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />}
            </div>
          );
        })}
      </div>

      {showForm && (
        <form className="add-form" onSubmit={submit}>
          <div className="form-row" style={{ alignItems: 'center' }}>
            <div style={{ flex: '0 0 52px' }}>
              <label style={{ fontSize: 11, color: 'var(--ink-faint)', display: 'block', marginBottom: 4 }}>Emoji</label>
              <input style={{ ...inp, textAlign: 'center' }} value={form.emoji} onChange={e => upd('emoji', e.target.value)} maxLength={2} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: 'var(--ink-faint)', display: 'block', marginBottom: 4 }}>Target name *</label>
              <input style={inp} placeholder="e.g. RC Passages, DILR Sets…" value={form.name} onChange={e => upd('name', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label style={{ fontSize: 11, color: 'var(--ink-faint)', display: 'block', marginBottom: 4 }}>Total quantity</label>
              <input style={inp} type="number" min="1" value={form.total} onChange={e => upd('total', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--ink-faint)', display: 'block', marginBottom: 4 }}>My target per…</label>
              <input style={inp} type="number" min="1" value={form.daily} onChange={e => upd('daily', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--ink-faint)', display: 'block', marginBottom: 4 }}>Period</label>
              <select style={inp} value={form.period} onChange={e => upd('period', e.target.value)}>
                <option value="day">per day</option>
                <option value="week">per week</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-sm btn-primary">Add target</button>
          </div>
        </form>
      )}
    </div>
  );
}
