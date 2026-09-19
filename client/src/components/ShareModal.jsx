import { useState } from 'react';

export default function ShareModal({ open, summary, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="modal open">
      <div className="modalbox">
        <div className="cardhead">
          <div className="title">📤 Share with mentor</div>
          <button className="btn" onClick={onClose}>✕</button>
        </div>
        <textarea readOnly value={summary} className="field-input" style={{ minHeight: 180 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          <button className="btn primary" onClick={copy}>{copied ? '✓ Copied!' : '📋 Copy to clipboard'}</button>
          <a className="btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }} href={`https://wa.me/?text=${encodeURIComponent(summary)}`} target="_blank" rel="noreferrer">💬 Share via WhatsApp</a>
          <a className="btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }} href={`mailto:?subject=${encodeURIComponent('CAT Prep Progress')}&body=${encodeURIComponent(summary)}`}>✉️ Share via Email</a>
        </div>
      </div>
    </div>
  );
}
