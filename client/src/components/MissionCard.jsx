export default function MissionCard({ title, icon, items, xpNote, footNote, onToggle }) {
  const done = items.filter((x) => x.done).length;
  return (
    <div className="card">
      <div className="cardhead">
        <div className="title">{icon} {title}</div>
        <div className="tiny">{done} / {items.length}</div>
      </div>
      <div className="mission">
        {items.map((item, i) => (
          <label key={i} className={`task${item.done ? ' done' : ''}`}>
            <input type="checkbox" checked={item.done} onChange={() => onToggle(i)} />
            <span>{item.t}</span>
          </label>
        ))}
      </div>
      <div className="mission-foot">
        <span>{xpNote}</span>
        <span>{footNote}</span>
      </div>
    </div>
  );
}
