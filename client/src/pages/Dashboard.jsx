import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import QuoteFlashcard from '../components/QuoteFlashcard';
import MissionSection from '../components/MissionSection';
import TargetsSection from '../components/TargetsSection';
import MockSection from '../components/MockSection';
import AchievementsSection from '../components/AchievementsSection';
import LearningLogSection from '../components/LearningLogSection';
import CalendarSection from '../components/CalendarSection';
import WeeklyScheduleSection from '../components/WeeklyScheduleSection';
import SettingsModal from '../components/SettingsModal';

const NAV = [
  { id: 'home',         label: 'Home',            short: 'Home'    },
  { id: 'mission',      label: "Today's Mission",  short: 'Today'   },
  { id: 'weekly',       label: 'Weekly Goals',     short: 'Weekly'  },
  { id: 'calendar',     label: 'Calendar',         short: 'Cal'     },
  { id: 'targets',      label: 'Targets',          short: 'Targets' },
  { id: 'mocks',        label: 'Mock Scores',      short: 'Mocks'   },
  { id: 'achievements', label: 'Achievements',     short: 'Awards'  },
  { id: 'log',          label: 'Learning Log',     short: 'Log'     },
];

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getState(token);
      setState(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 60000);
    return () => clearInterval(id);
  }, [refresh]);

  async function withRefresh(fn) {
    try {
      const data = await fn();
      setState(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        Loading your dashboard…
      </div>
    );
  }

  if (!state) {
    return (
      <div className="loading-screen">
        <span style={{ color: 'var(--red)' }}>{error || 'Could not load dashboard.'}</span>
      </div>
    );
  }

  const todayDone = state.mission.filter(x => x.done).length;
  const weeklyDone = state.weeklyMission.filter(x => x.done).length;

  function getPageTitle() {
    const n = NAV.find(n => n.id === activeTab);
    return n ? n.label : 'Home';
  }

  function getPageSub() {
    const subs = {
      home: 'Your CAT prep at a glance',
      mission: "Set and track today's tasks",
      weekly: 'Plan your week ahead',
      calendar: 'Track your study days month by month',
      targets: 'Long-term preparation targets',
      mocks: 'Track mock test performance',
      achievements: 'Milestones unlocked',
      log: 'Knowledge you want to remember',
    };
    return subs[activeTab] || '';
  }

  return (
    <div className="app-shell">
      {/* ─── MOBILE BACKDROP OVERLAY ─── */}
      {sidebarOpen && (
        <div className="mobile-nav-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── SIDEBAR / SIDE NAVBAR ─── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-appname">
            CAT Prep
            <small>Personal Tracker</small>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <span className="nav-label">Menu</span>

        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(item.id);
              setSidebarOpen(false);
            }}
          >
            <span className="nav-full-label">{item.label}</span>
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="user-chip">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || '?'}</div>
            <span className="user-name">{user?.name || 'Aspirant'}</span>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSidebarOpen(false);
              setSettingsOpen(true);
            }}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Settings
          </button>
          <button
            className="btn btn-ghost btn-sm btn-danger"
            onClick={() => {
              setSidebarOpen(false);
              logout();
            }}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Log out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              title="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <div className="main-header-title">{getPageTitle()}</div>
              <div className="main-header-sub">{getPageSub()}</div>
            </div>
          </div>
          <div className="header-actions">
            {error && <span className="tiny" style={{ color: 'var(--red)' }}>⚠ {error}</span>}
            <div className="user-avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </header>

        <div className="page-body">
          {/* HOME */}
          {activeTab === 'home' && (
            <>
              <QuoteFlashcard />

              {/* Streak */}
              <div className="streak-banner">
                {state.streak
                  ? `${state.streak} day${state.streak > 1 ? 's' : ''} prep streak — keep going!`
                  : 'Start your streak — complete a task today!'}
              </div>

              {/* XP */}
              <div className="xp-row">
                <span className="xp-lbl">CAT XP</span>
                <div className="xp-track">
                  <div className="xp-fill" style={{ width: `${Math.min((state.xp % 500) / 500 * 100, 100)}%` }} />
                </div>
                <span className="xp-val">{state.xp} XP</span>
              </div>

              {/* Stat pills */}
              <div className="stats-row">
                <div className="stat-pill violet">
                  <div className="stat-glow" />
                  <div className="stat-pill-label">Days to CAT</div>
                  <div className="stat-pill-value">{state.days ?? '—'}</div>
                  <div className="stat-pill-sub">{state.phase}</div>
                </div>
                <div className="stat-pill gold">
                  <div className="stat-glow" />
                  <div className="stat-pill-label">Today's Tasks</div>
                  <div className="stat-pill-value">{todayDone}/{state.mission.length}</div>
                  <div className="stat-pill-sub">tasks done</div>
                </div>
                <div className="stat-pill green">
                  <div className="stat-glow" />
                  <div className="stat-pill-label">Weekly Goals</div>
                  <div className="stat-pill-value">{weeklyDone}/{state.weeklyMission.length}</div>
                  <div className="stat-pill-sub">completed</div>
                </div>
              </div>

              {/* Quick preview — today's mission */}
              {state.mission.length > 0 && (
                <div className="card">
                  <div className="card-head">
                    <div className="card-title">Today at a Glance</div>
                    <button className="btn btn-sm" onClick={() => setActiveTab('mission')}>View all →</button>
                  </div>
                  <div className="task-list">
                    {state.mission.slice(0, 3).map((item, i) => (
                      <label key={i} className={`task-item${item.done ? ' done' : ''}`}>
                        <div className="task-checkbox">{item.done ? '✓' : ''}</div>
                        <input
                          type="checkbox"
                          hidden
                          checked={item.done}
                          onChange={() => withRefresh(() => api.toggleMission(token, i))}
                        />
                        <span className="task-text">{item.t}</span>
                      </label>
                    ))}
                  </div>
                  {state.mission.length > 3 && (
                    <p className="tiny" style={{ marginTop: 10 }}>
                      +{state.mission.length - 3} more tasks…
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* TODAY'S MISSION */}
          {activeTab === 'mission' && (
            <MissionSection
              title="Today's Mission"
              icon="🎯"
              items={state.mission}
              xpNote="+20 XP per task"
              xpReset="resets daily"
              onToggle={(i) => withRefresh(() => api.toggleMission(token, i))}
              onAdd={(text) =>
                withRefresh(() =>
                  api.bulkSave(token, {
                    ...state,
                    mission: [...state.mission, { t: text, done: false }],
                  })
                )
              }
              onDelete={(i) =>
                withRefresh(() =>
                  api.bulkSave(token, {
                    ...state,
                    mission: state.mission.filter((_, idx) => idx !== i),
                  })
                )
              }
            />
          )}

          {/* WEEKLY SCHEDULE (day-by-day) */}
          {activeTab === 'weekly' && (
            <WeeklyScheduleSection
              schedule={state.weeklySchedule}
              onToggle={(day, i) => withRefresh(() => api.toggleScheduleTask(token, day, i))}
              onAdd={(day, text) => withRefresh(() => api.addScheduleTask(token, day, text))}
              onDelete={(day, i) => withRefresh(() => api.deleteScheduleTask(token, day, i))}
            />
          )}

          {/* CALENDAR */}
          {activeTab === 'calendar' && (
            <CalendarSection />
          )}

          {/* TARGETS */}
          {activeTab === 'targets' && (
            <TargetsSection
              targets={state.targets}
              days={state.days}
              onIncrement={(i, delta) => withRefresh(() => api.incrementTarget(token, i, delta))}
              onAdd={(t) => withRefresh(() => api.addTarget(token, t))}
              onDelete={(i) => withRefresh(() => api.deleteTarget(token, i))}
            />
          )}

          {/* MOCKS */}
          {activeTab === 'mocks' && (
            <MockSection
              mocks={state.mocks}
              onAdd={(m) => withRefresh(() => api.addMock(token, m))}
              onDelete={(i) => withRefresh(() => api.deleteMock(token, i))}
            />
          )}

          {/* ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <AchievementsSection achievements={state.achievements} />
          )}

          {/* LEARNING LOG */}
          {activeTab === 'log' && (
            <LearningLogSection
              entries={state.learningLog}
              onAdd={(text) => withRefresh(() => api.addLearning(token, text))}
              onDelete={(i) => withRefresh(() => api.deleteLearning(token, i))}
            />
          )}
        </div>
      </main>

      <SettingsModal
        open={settingsOpen}
        catDate={state.catDate}
        onClose={() => setSettingsOpen(false)}
        onSave={(date) => {
          withRefresh(() => api.setSettings(token, date));
          setSettingsOpen(false);
        }}
      />
    </div>
  );
}
