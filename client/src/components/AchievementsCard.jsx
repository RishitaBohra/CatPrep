export default function AchievementsCard({ achievements }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  return (
    <div className="card">
      <div className="cardhead">
        <div className="title">🏆 Achievements</div>
        <div className="tiny">{unlockedCount} / {achievements.length} unlocked</div>
      </div>
      <div className="achgrid">
        {achievements.map((a, i) => (
          <div className={`ach ${a.unlocked ? 'unlocked' : 'lock'}`} key={i}>
            <b>{a.emoji} {a.name}</b>
            <div>{a.unlocked ? 'Unlocked' : `🔒 ${a.hint}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
