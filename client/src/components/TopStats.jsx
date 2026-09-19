export default function TopStats({ days, phase, xp, streak, onOpenSettings }) {
  return (
    <>
      <div className="card countdown">
        <div className="countdown-ring">
          <svg viewBox="0 0 200 200" width="0" height="0" aria-hidden="true">
            <defs>
              <circle id="ring-outer" cx="100" cy="100" r="94" />
            </defs>
          </svg>
          <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
            <circle cx="100" cy="100" r="92" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="1 7" />
            <circle cx="100" cy="100" r="78" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="1 5" opacity="0.6" />
          </svg>
          <div className="days">{days ?? '—'}</div>
        </div>
        <div className="days-label">Days to CAT day</div>
        <div className="phase">{phase}</div>
        <div style={{ marginTop: 16 }}>
          <button className="btn" onClick={onOpenSettings}>⚙ Set CAT date</button>
        </div>
      </div>

      <div className="xp" style={{ marginTop: 0 }}>
        <span>⚡ CAT XP</span>
        <b>{xp} XP</b>
      </div>

      <div className="card streak">
        {streak
          ? `🔥 ${streak} day${streak > 1 ? 's' : ''} prep streak — keep it going`
          : '🔥 Start your prep streak by completing a task today'}
      </div>
    </>
  );
}
