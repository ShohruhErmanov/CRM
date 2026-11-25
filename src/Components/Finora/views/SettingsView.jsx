import { useState } from 'react';
import { ShieldIcon, CheckCircleIcon } from '../Icons';

export default function SettingsView() {
  const [companyName, setCompanyName] = useState('Finora IT & Enterprise Solutions');
  const [supportEmail, setSupportEmail] = useState('support@finoracrm.io');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="finora-page-title-row">
        <div>
          <h1 className="finora-page-title">Platform & System Settings</h1>
          <p className="finora-page-subtitle">Configure organization profile, system security, and alert preferences</p>
        </div>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--finora-success)', background: 'var(--finora-success-bg)', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
            <CheckCircleIcon size={16} />
            <span>Settings successfully saved!</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Organization Profile */}
        <div className="finora-panel">
          <div className="finora-panel-title" style={{ marginBottom: 16 }}>Organization Profile</div>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--finora-text-secondary)', marginBottom: 6 }}>Company Legal Entity</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{ width: '100%', background: 'var(--finora-bg-main)', border: '1px solid var(--finora-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--finora-text-primary)', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--finora-text-secondary)', marginBottom: 6 }}>System Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                style={{ width: '100%', background: 'var(--finora-bg-main)', border: '1px solid var(--finora-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--finora-text-primary)', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--finora-text-secondary)', marginBottom: 6 }}>Default Base Currency</label>
              <select
                style={{ width: '100%', background: 'var(--finora-bg-main)', border: '1px solid var(--finora-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--finora-text-primary)', outline: 'none' }}
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="UZS">UZS - Uzbek Som</option>
              </select>
            </div>

            <div style={{ marginTop: 10 }}>
              <button type="submit" className="finora-btn finora-btn-primary">
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Security & System Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="finora-panel">
            <div className="finora-panel-title" style={{ marginBottom: 14 }}>Security & Audits</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--finora-text-primary)' }}>Email Notifications</div>
                  <div style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>Send deal and lead notifications</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--finora-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--finora-text-primary)' }}>Automated Database Snapshots</div>
                  <div style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>Hourly redundant backups</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--finora-primary)' }}
                />
              </div>

              <div style={{ borderTop: '1px solid var(--finora-border)', paddingTop: 12, marginTop: 4 }}>
                <div style={{ fontSize: 11, color: 'var(--finora-text-muted)', marginBottom: 4 }}>AUTHENTICATION STATUS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldIcon size={16} style={{ color: 'var(--finora-success)' }} />
                  <span style={{ fontSize: 13, color: 'var(--finora-text-primary)', fontWeight: 600 }}>Two-Factor Authentication Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="finora-panel">
            <div className="finora-panel-title" style={{ marginBottom: 10 }}>Design System Standards</div>
            <p style={{ fontSize: 12, color: 'var(--finora-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              The Finora platform adheres strictly to the enterprise dark UI specification:
              <br />
              • Main Canvas: <code style={{ color: 'var(--finora-primary)' }}>#0B0F19</code>
              <br />
              • Cards & Panels: <code style={{ color: 'var(--finora-primary)' }}>#161E2E</code>
              <br />
              • Primary Brand: <code style={{ color: 'var(--finora-primary)' }}>#3B82F6</code>
              <br />
              • Borders: <code style={{ color: 'var(--finora-primary)' }}>#1E293B</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
