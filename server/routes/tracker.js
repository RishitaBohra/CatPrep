import express from 'express';
import TrackerState from '../models/TrackerState.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

const today = () => new Date().toISOString().slice(0, 10);
function weekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
function daysLeft(catDate) {
  if (!catDate) return null;
  const now = new Date();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const exam = new Date(catDate + 'T00:00:00');
  return Math.max(0, Math.ceil((exam - todayDate) / 86400000));
}
function phaseFor(days) {
  if (days === null) return 'BUILD PHASE';
  if (days > 60) return 'BUILD PHASE';
  if (days > 30) return 'ACCELERATION PHASE';
  if (days > 14) return 'FINAL LAP';
  return 'WAR ROOM';
}
function targetStatus(item, days) {
  const rem = Math.max(item.total - item.done, 0);
  const perDay = days ? rem / days : 999;
  const rate = item.period === 'week' ? perDay * 7 : perDay;
  const goal = item.daily > 0 ? item.daily : 1;
  if (rem === 0) return { color: 'green', label: 'COMPLETE' };
  if (rate <= goal) return { color: 'green', label: 'ON TRACK' };
  if (rate <= goal * 3) return { color: 'amber', label: 'PUSH A BIT' };
  return { color: 'red', label: 'BEHIND' };
}

async function getOrCreate(userId) {
  let state = await TrackerState.findOne({ user: userId });
  if (!state) state = await TrackerState.create({ user: userId });
  return state;
}

function applyResets(state) {
  const t = today();
  let changed = false;
  if (state.lastMissionDate !== t) {
    state.mission.forEach((m) => (m.done = false));
    state.lastMissionDate = t;
    changed = true;
  }
  const w = weekStart();
  if (state.lastWeeklyMissionDate !== w) {
    state.weeklyMission.forEach((m) => (m.done = false));
    state.lastWeeklyMissionDate = w;
    changed = true;
  }
  return changed;
}

function updateStreak(state) {
  const t = today();
  if (state.lastActive === t) return; // already counted today
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.toISOString().slice(0, 10);
  state.streak = state.lastActive === y ? state.streak + 1 : 1;
  state.lastActive = t;
}

const ACHIEVEMENTS = [
  { emoji: '🔥', name: 'First Blood', hint: 'Log your first bit of progress in the app' },
  { emoji: '🧱', name: '50 Setter', hint: 'Complete 50 DILR sets (since you started using this app)' },
  { emoji: '💯', name: 'Century', hint: 'Complete 100 DILR sets (since you started using this app)' },
  { emoji: '⚡', name: 'Mock Machine', hint: 'Complete 10 SIMCATs (since you started using this app)' },
  { emoji: '🚀', name: 'Final Lap', hint: 'Reach 30 days remaining' },
  { emoji: '🏆', name: 'CAT Ready', hint: 'Complete all major targets' }
];

function computeAchievements(state, days) {
  const baseline = state.achBaseline || new Map();
  const base = (name) => baseline.get(name) || 0;
  const dilr = state.targets.find((x) => x.name === 'DILR Sets') || { done: 0, total: 1 };
  const sim = state.targets.find((x) => x.name === 'SIMCATs') || { done: 0, total: 1 };
  const allDone = state.targets.length > 0 && state.targets.every((x) => x.done >= x.total);
  const unlocked = [
    state.targets.some((x) => x.done > base(x.name)),
    dilr.done - base('DILR Sets') >= 50,
    dilr.done - base('DILR Sets') >= 100,
    sim.done - base('SIMCATs') >= 10,
    days !== null && days <= 30,
    allDone
  ];
  return ACHIEVEMENTS.map((a, i) => ({ ...a, unlocked: unlocked[i] }));
}

const DAYS = ['mon','tue','wed','thu','fri','sat','sun'];

function serialize(state) {
  const days = daysLeft(state.catDate);
  const achBaseline = Object.fromEntries(state.achBaseline || []);
  // Convert weeklySchedule subdocument to plain object
  const ws = state.weeklySchedule || {};
  const weeklySchedule = {};
  for (const d of DAYS) {
    weeklySchedule[d] = (ws[d] || []).map(item => ({ t: item.t, done: item.done }));
  }
  return {
    catDate: state.catDate,
    days,
    phase: phaseFor(days),
    streak: state.streak,
    xp: state.xp,
    mission: state.mission,
    weeklyMission: state.weeklyMission,
    weeklySchedule,
    targets: state.targets.map((x) => ({ ...x.toObject(), status: targetStatus(x, days) })),
    mocks: state.mocks,
    learningLog: state.learningLog,
    achievements: computeAchievements(state, days),
    achBaseline
  };
}

// GET current state (applies daily/weekly resets first)
router.get('/', async (req, res) => {
  const state = await getOrCreate(req.userId);
  if (!state.achBaseline || state.achBaseline.size === 0) {
    state.targets.forEach((x) => state.achBaseline.set(x.name, x.done));
  }
  applyResets(state);
  await state.save();
  res.json(serialize(state));
});

// Set CAT exam date
router.put('/settings', async (req, res) => {
  const { catDate } = req.body;
  if (!catDate) return res.status(400).json({ error: 'catDate is required' });
  const state = await getOrCreate(req.userId);
  state.catDate = catDate;
  await state.save();
  res.json(serialize(state));
});

// Toggle a daily mission item (+/-20 XP)
router.patch('/mission/:index', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const idx = Number(req.params.index);
  const item = state.mission[idx];
  if (!item) return res.status(404).json({ error: 'Mission item not found' });
  item.done = !item.done;
  state.xp = Math.max(0, state.xp + (item.done ? 20 : -20));
  if (item.done) updateStreak(state);
  await state.save();
  res.json(serialize(state));
});

// Toggle a weekly mission item (+/-50 XP)
router.patch('/weekly-mission/:index', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const idx = Number(req.params.index);
  const item = state.weeklyMission[idx];
  if (!item) return res.status(404).json({ error: 'Weekly mission item not found' });
  item.done = !item.done;
  state.xp = Math.max(0, state.xp + (item.done ? 50 : -50));
  if (item.done) updateStreak(state);
  await state.save();
  res.json(serialize(state));
});

// Targets CRUD
router.post('/targets', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const { name, emoji, done, total, daily, period } = req.body;
  state.targets.push({
    name: name || 'New Target',
    emoji: emoji || '🔹',
    done: Math.max(0, +done || 0),
    total: Math.max(0, +total || 50),
    daily: Math.max(1, +daily || 1),
    period: period === 'week' ? 'week' : 'day'
  });
  await state.save();
  res.json(serialize(state));
});

router.put('/targets/:index', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const idx = Number(req.params.index);
  const target = state.targets[idx];
  if (!target) return res.status(404).json({ error: 'Target not found' });
  const { name, emoji, done, total, daily, period } = req.body;
  if (name !== undefined) target.name = name;
  if (emoji !== undefined) target.emoji = emoji;
  if (done !== undefined) target.done = Math.max(0, +done);
  if (total !== undefined) target.total = Math.max(0, +total);
  if (daily !== undefined) target.daily = Math.max(1, +daily);
  if (period !== undefined) target.period = period === 'week' ? 'week' : 'day';
  await state.save();
  res.json(serialize(state));
});

// Increment/decrement a target's "done" count (+/-10 XP), used by the +/- buttons
router.patch('/targets/:index/increment', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const idx = Number(req.params.index);
  const target = state.targets[idx];
  if (!target) return res.status(404).json({ error: 'Target not found' });
  const delta = req.body.delta === -1 ? -1 : 1;
  const before = target.done;
  target.done = Math.max(0, Math.min(target.total, target.done + delta));
  if (target.done > before) {
    state.xp = Math.max(0, state.xp + 10);
    updateStreak(state);
  } else if (target.done < before) {
    state.xp = Math.max(0, state.xp - 10);
  }
  await state.save();
  res.json(serialize(state));
});

router.delete('/targets/:index', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const idx = Number(req.params.index);
  if (!state.targets[idx]) return res.status(404).json({ error: 'Target not found' });
  state.targets.splice(idx, 1);
  await state.save();
  res.json(serialize(state));
});

// Mock scores
router.post('/mocks', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const { name, score } = req.body;
  state.mocks.push({ name: name || 'New Mock', score: +score || 0 });
  if (state.mocks.length > 7) state.mocks.shift();
  state.xp = Math.max(0, state.xp + 25);
  updateStreak(state);
  await state.save();
  res.json(serialize(state));
});

router.delete('/mocks/:index', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const idx = Number(req.params.index);
  if (!state.mocks[idx]) return res.status(404).json({ error: 'Mock not found' });
  state.mocks.splice(idx, 1);
  await state.save();
  res.json(serialize(state));
});

// Learning log (kept across resets)
router.post('/learning-log', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Entry text is required' });
  state.learningLog.unshift({ text: text.trim(), date: today() });
  await state.save();
  res.json(serialize(state));
});

router.delete('/learning-log/:index', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const idx = Number(req.params.index);
  if (!state.learningLog[idx]) return res.status(404).json({ error: 'Entry not found' });
  state.learningLog.splice(idx, 1);
  await state.save();
  res.json(serialize(state));
});

// ── Weekly Schedule (day-by-day) routes ─────────────────────────────────────
// Add a task to a specific day
router.post('/weekly-schedule/:day', async (req, res) => {
  const { day } = req.params;
  if (!DAYS.includes(day)) return res.status(400).json({ error: 'Invalid day' });
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'text is required' });
  const state = await getOrCreate(req.userId);
  if (!state.weeklySchedule) state.weeklySchedule = {};
  state.weeklySchedule[day].push({ t: text.trim(), done: false });
  state.markModified('weeklySchedule');
  await state.save();
  res.json(serialize(state));
});

// Toggle a task in a specific day (+/-20 XP)
router.patch('/weekly-schedule/:day/:index', async (req, res) => {
  const { day } = req.params;
  if (!DAYS.includes(day)) return res.status(400).json({ error: 'Invalid day' });
  const state = await getOrCreate(req.userId);
  const idx = Number(req.params.index);
  const item = (state.weeklySchedule || {})[day]?.[idx];
  if (!item) return res.status(404).json({ error: 'Task not found' });
  item.done = !item.done;
  state.xp = Math.max(0, state.xp + (item.done ? 20 : -20));
  if (item.done) updateStreak(state);
  state.markModified('weeklySchedule');
  await state.save();
  res.json(serialize(state));
});

// Delete a task from a specific day
router.delete('/weekly-schedule/:day/:index', async (req, res) => {
  const { day } = req.params;
  if (!DAYS.includes(day)) return res.status(400).json({ error: 'Invalid day' });
  const state = await getOrCreate(req.userId);
  const idx = Number(req.params.index);
  if (!state.weeklySchedule?.[day]?.[idx]) return res.status(404).json({ error: 'Task not found' });
  state.weeklySchedule[day].splice(idx, 1);
  state.markModified('weeklySchedule');
  await state.save();
  res.json(serialize(state));
});

// Bulk save from the "Edit dashboard" modal
router.put('/bulk', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const { catDate, mission, weeklyMission, weeklySchedule, targets, mocks } = req.body;
  if (catDate) state.catDate = catDate;
  if (Array.isArray(mission)) state.mission = mission;
  if (Array.isArray(weeklyMission)) state.weeklyMission = weeklyMission;
  if (weeklySchedule && typeof weeklySchedule === 'object') {
    for (const d of DAYS) {
      if (Array.isArray(weeklySchedule[d])) state.weeklySchedule[d] = weeklySchedule[d];
    }
    state.markModified('weeklySchedule');
  }
  if (Array.isArray(targets)) state.targets = targets;
  if (Array.isArray(mocks)) state.mocks = mocks;
  await state.save();
  res.json(serialize(state));
});

// Reset dashboard (learning log is preserved, matching the original behaviour)
router.post('/reset', async (req, res) => {
  const state = await getOrCreate(req.userId);
  const fresh = new TrackerState({ user: req.userId });
  state.catDate = fresh.catDate;
  state.streak = 0;
  state.lastActive = null;
  state.xp = 0;
  state.lastMissionDate = today();
  state.lastWeeklyMissionDate = weekStart();
  state.mission = fresh.mission;
  state.weeklyMission = fresh.weeklyMission;
  state.targets = fresh.targets;
  state.mocks = [];
  state.achBaseline = new Map();
  // learningLog intentionally untouched
  await state.save();
  res.json(serialize(state));
});

export default router;
