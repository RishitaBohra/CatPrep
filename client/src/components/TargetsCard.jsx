import { useState } from 'react';

export default function TargetsCard({ targets, days, onIncrement, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', emoji: '🔹', total: 50, daily: 1, period: 'day' });

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.total) return;
    onAdd({ ...form, name: form.name.trim(), total: +form.total, daily: +form.daily || 1, done: 0 });
    setForm({ name: '', emoji: '🔹', total: 50, daily: 1, period: 'day' });
    setShowForm(false);
  }

  return (
    <div className="card">
      <div className="cardhead">
        <div className="title">📌 Your Targets</div>
        <div className="tiny">Overall progress</div>
      </div>

      {targets.map((x, i) => {
        const pct = x.total ? Math.min((x.done / x.total) * 100, 100) : 0;
        const rem = Math.max(x.total - x.done, 0);
        const perDay = days ? rem / days : 0;
        const unit = x.period === 'week' ? 'week' : 'day';
        const rate = (x.period === 'week' ? perDay * 7 : perDay).toFixed(1);
        const st = x.status || { color: 'green', label: 'ON TRACK' };
        return (
          <div className="target" key={i}>
            <div className="targettop">
              <span className="targetname">{x.emoji} {x.name}</span>
              <span className="numbers">{x.done} / {x.total}</span>
            </div>
            <div className="progress"><div className="fill" style={{ width: `${pct}%` }} /></div>
            <div className="meta">
              <span>{rem} left · ~{rate}/{unit} needed</span>
              <span className={`status ${st.color}`}>{st.label}</span>
            </div>
            <div className="tiny" style={{ marginTop: 6 }}>My target: {x.daily || 1} / {unit}</div>
            <div style={{ marginTop: 7, display: 'flex', gap: 8 }}>
              <button className="btn" onClick={() => onIncrement(i, -1)}>−</button>
              <button className="btn" onClick={() => onIncrement(i, 1)}>＋ Mark done</button>
              <button className="btn danger" style={{ marginLeft: 'auto' }} onClick={() => onDelete(i)}>Remove</button>
            </div>
          </div>
        );
      })}

      {showForm ? (
        <form onSubmit={submit} style={{ border: '1px solid var(--border-soft)', borderRadius: 12, padding: 12, marginTop: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: 8 }}>
            <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} style={{ textAlign: 'center', padding: 9, borderRadius: 9, border: '1px solid var(--border)', background: '#0f111c', color: 'inherit' }} />
            <input placeholder="Target name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ padding: 9, borderRadius: 9, border: '1px solid var(--border)', background: '#0f111c', color: 'inherit' }} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 8 }}>
            <input type="number" min="1" placeholder="Total" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} style={{ padding: 9, borderRadius: 9, border: '1px solid var(--border)', background: '#0f111c', color: 'inherit' }} />
            <input type="number" min="1" placeholder="Per period" value={form.daily} onChange={(e) => setForm({ ...form, daily: e.target.value })} style={{ padding: 9, borderRadius: 9, border: '1px solid var(--border)', background: '#0f111c', color: 'inherit' }} />
            <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} style={{ padding: 9, borderRadius: 9, border: '1px solid var(--border)', background: '#0f111c', color: 'inherit' }}>
              <option value="day">/day</option>
              <option value="week">/week</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn primary">Add target</button>
          </div>
        </form>
      ) : (
        <button className="btn" onClick={() => setShowForm(true)}>＋ Add target</button>
      )}
    </div>
  );
}
