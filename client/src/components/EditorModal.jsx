import { useState, useEffect } from 'react';

const inputStyle = { padding: 8, borderRadius: 9, border: '1px solid var(--border)', background: '#0f111c', color: 'inherit' };

function TaskListEditor({ items, setItems, placeholder }) {
  return (
    <div>
      {items.map((x, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 32px', gap: 7, margin: '7px 0' }}>
          <input
            style={inputStyle}
            value={x.t}
            placeholder={placeholder}
            onChange={(e) => {
              const copy = [...items];
              copy[i] = { ...copy[i], t: e.target.value };
              setItems(copy);
            }}
          />
          <select
            style={inputStyle}
            value={x.done ? 'true' : 'false'}
            onChange={(e) => {
              const copy = [...items];
              copy[i] = { ...copy[i], done: e.target.value === 'true' };
              setItems(copy);
            }}
          >
            <option value="false">Pending</option>
            <option value="true">Done</option>
          </select>
          <button className="btn" onClick={() => setItems(items.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <button className="btn" onClick={() => setItems([...items, { t: 'New task', done: false }])}>＋ Add</button>
    </div>
  );
}

export default function EditorModal({ open, state, onClose, onSave }) {
  const [catDate, setCatDate] = useState('');
  const [mission, setMission] = useState([]);
  const [weeklyMission, setWeeklyMission] = useState([]);
  const [targets, setTargets] = useState([]);
  const [mocks, setMocks] = useState([]);

  useEffect(() => {
    if (open && state) {
      setCatDate(state.catDate || '');
      setMission(state.mission || []);
      setWeeklyMission(state.weeklyMission || []);
      setTargets((state.targets || []).map(({ status, ...rest }) => rest));
      setMocks(state.mocks || []);
    }
  }, [open, state]);

  if (!open) return null;

  function save() {
    if (!catDate) return;
    onSave({ catDate, mission, weeklyMission, targets, mocks });
  }

  return (
    <div className="modal open">
      <div className="modalbox" style={{ maxWidth: 620, maxHeight: '90vh', overflow: 'auto' }}>
        <div className="cardhead">
          <div className="title">✏️ Edit Dashboard</div>
          <button className="btn" onClick={onClose}>✕</button>
        </div>
        <div className="tiny" style={{ marginBottom: 14 }}>
          Edit everything shown on the dashboard. Changes are saved when you click Save All Changes.
        </div>

        <div className="field">
          <label>CAT exam date</label>
          <input type="date" value={catDate} onChange={(e) => setCatDate(e.target.value)} />
        </div>

        <div className="title" style={{ marginTop: 18 }}>🎯 Today's Mission</div>
        <TaskListEditor items={mission} setItems={setMission} placeholder="Mission item" />

        <div className="title" style={{ marginTop: 20 }}>📌 Targets</div>
        {targets.map((x, i) => (
          <div key={i} style={{ border: '1px solid var(--border-soft)', borderRadius: 11, padding: 9, margin: '8px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 62px 62px 55px 78px 32px', gap: 6 }}>
              <input style={{ ...inputStyle, textAlign: 'center' }} value={x.emoji} onChange={(e) => { const c = [...targets]; c[i] = { ...c[i], emoji: e.target.value }; setTargets(c); }} />
              <input style={inputStyle} value={x.name} placeholder="Target name" onChange={(e) => { const c = [...targets]; c[i] = { ...c[i], name: e.target.value }; setTargets(c); }} />
              <input style={inputStyle} type="number" min="0" value={x.done} onChange={(e) => { const c = [...targets]; c[i] = { ...c[i], done: +e.target.value }; setTargets(c); }} />
              <input style={inputStyle} type="number" min="0" value={x.total} onChange={(e) => { const c = [...targets]; c[i] = { ...c[i], total: +e.target.value }; setTargets(c); }} />
              <input style={inputStyle} type="number" min="1" value={x.daily} onChange={(e) => { const c = [...targets]; c[i] = { ...c[i], daily: +e.target.value }; setTargets(c); }} />
              <select style={inputStyle} value={x.period} onChange={(e) => { const c = [...targets]; c[i] = { ...c[i], period: e.target.value }; setTargets(c); }}>
                <option value="day">/day</option>
                <option value="week">/week</option>
              </select>
              <button className="btn" onClick={() => setTargets(targets.filter((_, idx) => idx !== i))}>✕</button>
            </div>
            <div className="tiny" style={{ marginTop: 5 }}>Emoji · Name · Completed · Total · Target amount · per day/week</div>
          </div>
        ))}
        <button className="btn" onClick={() => setTargets([...targets, { name: 'New Target', emoji: '🔹', done: 0, total: 50, daily: 1, period: 'day' }])}>＋ Add target</button>

        <div className="title" style={{ marginTop: 20 }}>📆 This Week's Mission</div>
        <TaskListEditor items={weeklyMission} setItems={setWeeklyMission} placeholder="Weekly mission item" />

        <div className="title" style={{ marginTop: 20 }}>📈 Mock Scores</div>
        {mocks.map((x, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 32px', gap: 7, margin: '7px 0' }}>
            <input style={inputStyle} value={x.name} placeholder="Mock name" onChange={(e) => { const c = [...mocks]; c[i] = { ...c[i], name: e.target.value }; setMocks(c); }} />
            <input style={inputStyle} type="number" value={x.score} onChange={(e) => { const c = [...mocks]; c[i] = { ...c[i], score: +e.target.value }; setMocks(c); }} />
            <button className="btn" onClick={() => setMocks(mocks.filter((_, idx) => idx !== i))}>✕</button>
          </div>
        ))}
        <button className="btn" onClick={() => setMocks([...mocks, { name: 'New Mock', score: 0 }])}>＋ Add mock</button>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save}>Save All Changes</button>
        </div>
      </div>
    </div>
  );
}
