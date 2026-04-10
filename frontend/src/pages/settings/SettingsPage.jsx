import React, { useState } from 'react';
import { Sun, Moon, Type, Bell, BellOff, User, Shield, Monitor } from 'lucide-react';
import { useTheme } from '../../features/theme/ThemeContext';
import { useAuth } from '../../features/auth/AuthContext';

function Section({ title, children }) {
  return (
    <div className="rounded-xl overflow-hidden mb-5"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>{title}</p>
      </div>
      <div className="px-6 py-4 space-y-4">{children}</div>
    </div>
  );
}

function SettingRow({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--surface)' }}>
          <Icon size={15} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>{label}</p>
          {description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      style={{ background: checked ? 'var(--primary)' : 'var(--border)' }}>
      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  );
}

function FontSizeOption({ value, label, current, onChange }) {
  const active = current === value;
  return (
    <button onClick={() => onChange(value)}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
      style={{
        background: active ? 'var(--primary)' : 'var(--surface)',
        color: active ? 'white' : 'var(--text-body)',
        border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
      }}>
      {label}
    </button>
  );
}

function ThemeCard({ value, label, icon: Icon, current, onChange }) {
  const active = current === value;
  return (
    <button onClick={() => onChange(value)}
      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all flex-1"
      style={{
        border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
        background: active ? 'rgba(26,107,58,0.06)' : 'var(--surface)',
      }}>
      <Icon size={20} style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }} />
      <span className="text-xs font-semibold" style={{ color: active ? 'var(--primary)' : 'var(--text-body)' }}>
        {label}
      </span>
    </button>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    paymentAlerts: true,
    systemAnnouncements: false,
  });

  const handleThemeChange = (val) => {
    if (val !== theme) toggleTheme();
  };

  const displayName = user?.firstName || user?.fullName || 'User';
  const displayId = user?.registrationNumber || user?.staffNumber || user?.email || '—';
  const role = user?.role || 'Student';

  return (
    <div className="px-4 lg:px-8 py-7 max-w-2xl mx-auto">
      <div className="mb-7">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Manage your preferences and account settings.
        </p>
      </div>

      {/* Account */}
      <Section title="Account">
        <SettingRow icon={User} label="Name" description={role}>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>{displayName}</span>
        </SettingRow>
        <SettingRow icon={Shield} label="ID / Number">
          <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{displayId}</span>
        </SettingRow>
        <SettingRow icon={User} label="Email">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email || '—'}</span>
        </SettingRow>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
            Theme
          </p>
          <div className="flex gap-3">
            <ThemeCard value="light" label="Light" icon={Sun} current={theme} onChange={handleThemeChange} />
            <ThemeCard value="dark"  label="Dark"  icon={Moon} current={theme} onChange={handleThemeChange} />
            <ThemeCard value="system" label="System" icon={Monitor} current={theme} onChange={handleThemeChange} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
            Font Size
          </p>
          <div className="flex gap-2">
            <FontSizeOption value="compact" label="Compact" current={fontSize} onChange={setFontSize} />
            <FontSizeOption value="normal"  label="Normal"  current={fontSize} onChange={setFontSize} />
            <FontSizeOption value="large"   label="Large"   current={fontSize} onChange={setFontSize} />
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <SettingRow icon={Bell} label="Booking Updates"
          description="Get notified when your booking status changes">
          <Toggle checked={notifications.bookingUpdates}
            onChange={(v) => setNotifications({ ...notifications, bookingUpdates: v })} />
        </SettingRow>
        <SettingRow icon={Bell} label="Payment Alerts"
          description="Receive alerts for M-Pesa payment confirmations">
          <Toggle checked={notifications.paymentAlerts}
            onChange={(v) => setNotifications({ ...notifications, paymentAlerts: v })} />
        </SettingRow>
        <SettingRow icon={BellOff} label="System Announcements"
          description="General announcements from JKUAT">
          <Toggle checked={notifications.systemAnnouncements}
            onChange={(v) => setNotifications({ ...notifications, systemAnnouncements: v })} />
        </SettingRow>
      </Section>

      {/* About */}
      <Section title="About">
        <SettingRow icon={Shield} label="Version">
          <span className="text-xs font-mono px-2 py-0.5 rounded"
            style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            v1.0.0
          </span>
        </SettingRow>
        <SettingRow icon={Shield} label="System">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>SMPS Exam System · JKUAT</span>
        </SettingRow>
      </Section>
    </div>
  );
}
