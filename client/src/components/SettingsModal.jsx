import { useState, useEffect } from 'react';

export default function SettingsModal({ open, catDate, onClose, onSave }) {
  const [date, setDate] = useState(catDate || '');

  useEffect(() => {
    if (open) setDate(catDate || '');
  }, [open, catDate]);

  if (!open) return null;

  return (
    <div className="modal-overlay open">
      <div className="modal-box">
        <div className="modal-head">
          <div className="modal-title">Settings</div>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="field">
          <label>CAT Exam Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <p className="tiny" style={{ marginTop: 4, marginBottom: 20 }}>
          Setting your exam date enables the countdown timer and smart phase tracking.
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!date}
            onClick={() => { if (date) onSave(date); }}
          >
            Save Date
          </button>
        </div>
      </div>
    </div>
  );
}
