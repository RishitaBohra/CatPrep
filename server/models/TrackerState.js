import mongoose from 'mongoose';

const missionItemSchema = new mongoose.Schema(
  { t: { type: String, required: true }, done: { type: Boolean, default: false } },
  { _id: false }
);

const targetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    emoji: { type: String, default: '🔹' },
    done: { type: Number, default: 0 },
    total: { type: Number, default: 50 },
    daily: { type: Number, default: 1 },
    period: { type: String, enum: ['day', 'week'], default: 'day' }
  },
  { _id: false }
);

const mockSchema = new mongoose.Schema(
  { name: { type: String, required: true }, score: { type: Number, required: true } },
  { _id: false }
);

const learningEntrySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) }
  },
  { _id: false }
);

const dayScheduleSchema = new mongoose.Schema(
  {
    mon: { type: [missionItemSchema], default: () => [] },
    tue: { type: [missionItemSchema], default: () => [] },
    wed: { type: [missionItemSchema], default: () => [] },
    thu: { type: [missionItemSchema], default: () => [] },
    fri: { type: [missionItemSchema], default: () => [] },
    sat: { type: [missionItemSchema], default: () => [] },
    sun: { type: [missionItemSchema], default: () => [] },
  },
  { _id: false }
);

const trackerStateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    catDate: { type: String, default: '2026-11-29' },
    streak: { type: Number, default: 0 },
    lastActive: { type: String, default: null },
    xp: { type: Number, default: 0 },
    lastMissionDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    lastWeeklyMissionDate: { type: String, default: null },
    mission: {
      type: [missionItemSchema],
      default: () => [
        { t: '4 DILR Sets', done: false },
        { t: '4 RCs', done: false },
        { t: '20 VARC Questions', done: false },
        { t: '30 QA Questions', done: false },
        { t: 'SIMCAT / Mock Analysis', done: false }
      ]
    },
    weeklyMission: {
      type: [missionItemSchema],
      default: () => [
        { t: '1 Full SIMCAT + Analysis', done: false },
        { t: 'Revise all error-log entries', done: false },
        { t: 'Finish 1 weak-area topic', done: false }
      ]
    },
    weeklySchedule:     { type: dayScheduleSchema, default: () => ({}) },
    nextWeekSchedule:   { type: dayScheduleSchema, default: () => ({}) },
    targets: {
      type: [targetSchema],
      default: () => [
        { name: 'DILR Sets', emoji: '📊', done: 0, total: 250, daily: 4, period: 'day' },
        { name: 'SIMCATs', emoji: '📝', done: 0, total: 40, daily: 3, period: 'week' },
        { name: 'QA Practice', emoji: '📐', done: 0, total: 300, daily: 30, period: 'day' },
        { name: 'VARC RCs', emoji: '📚', done: 0, total: 100, daily: 4, period: 'day' },
        { name: 'Sectional Tests', emoji: '🧠', done: 0, total: 30, daily: 1, period: 'week' }
      ]
    },
    mocks: { type: [mockSchema], default: () => [] },
    learningLog: { type: [learningEntrySchema], default: () => [] },
    achBaseline: { type: Map, of: Number, default: () => ({}) }
  },
  { timestamps: true }
);

export default mongoose.model('TrackerState', trackerStateSchema);
