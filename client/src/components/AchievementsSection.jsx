export default function AchievementsSection({ achievements }) {
  const unlocked = achievements.filter(a => a.unlocked).length;
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Achievements</div>
        <span className="card-badge">{unlocked}/{achievements.length}</span>
      </div>

      {achievements.length === 0 ? (
        <p className="tiny">Complete tasks and targets to unlock achievements!</p>
      ) : (
        <div className="ach-grid">
          {achievements.map((a, i) => (
            <div key={i} className={`ach-item ${a.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="ach-title">{a.name}</div>
              <div className="ach-desc">{a.unlocked ? 'Unlocked!' : `Locked — ${a.hint}`}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
