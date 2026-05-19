import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/common/Input';
import { Settings as SettingsIcon, User, Key, Bell, Shield, Copy, Check, Monitor } from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'notifications';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}

// Cyberpunk-styled sliding Switch that morphs from a circle to a pill
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-200/50 dark:border-[#22D3EE]/10 last:border-0">
      <div className="flex flex-col gap-0.5 text-left">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-[#F9FAFB]">{label}</span>
        {description && <span className="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] max-w-md">{description}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6.5 rounded-none relative transition-colors duration-300 focus:outline-none cursor-pointer p-0.5 cyber-clip-button ${
          checked
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
            : 'bg-slate-350 dark:bg-black/50 border border-slate-300/50 dark:border-white/10'
        }`}
      >
        <span
          className={`absolute top-0.5 bottom-0.5 left-0.5 bg-white shadow-md transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) cyber-clip-button ${
            checked
              ? 'translate-x-[22px] w-6'
              : 'translate-x-0 w-5'
          }`}
        />
      </button>
    </div>
  );
};

// Angular Cyberpunk Option Button for 3-State Theme Toggle
interface ThemeOptionButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const ThemeOptionButton: React.FC<ThemeOptionButtonProps> = ({ active, onClick, label, icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer cyber-clip-button ${
        active
          ? 'bg-[#22D3EE] text-[#081016] font-black shadow-[0_0_12px_rgba(34,211,238,0.4)]'
          : 'text-slate-450 dark:text-slate-400 hover:text-slate-900 dark:hover:text-[#F9FAFB] hover:bg-[#22D3EE]/10'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Security Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Notification States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [newLeadNotification, setNewLeadNotification] = useState(true);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [notificationsSuccess, setNotificationsSuccess] = useState(false);

  // Mock API Key States
  const [copied, setCopied] = useState(false);
  const mockApiKey = 'sld_live_51Nv8zSmartLeadsDashboardTokenGlow89201';

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(false);
    setTimeout(() => {
      setSavingProfile(false);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }, 800);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }, 800);
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotifications(true);
    setNotificationsSuccess(false);
    setTimeout(() => {
      setSavingNotifications(false);
      setNotificationsSuccess(true);
      setTimeout(() => setNotificationsSuccess(false), 3000);
    }, 600);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl animate-cyber-glitch">
      {/* Header Title Grid */}
      <div className="flex flex-col gap-1.5 border-l-2 border-[#22D3EE] pl-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-[#F9FAFB] tracking-tight uppercase font-mono">
          System Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-[#94A3B8] max-w-xl leading-relaxed">
          Configure profile data, app preferences, and developer access keys
        </p>
      </div>

      {/* Grid Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Nav Pane */}
        <div className="md:col-span-1 flex flex-col gap-2">
          {/* Double-layer clipped cyber border wrapper */}
          <div className="bg-slate-200/60 dark:bg-[#22D3EE]/20 p-[1px] cyber-clip-card shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <div className="bg-white dark:bg-[#0D1923]/80 backdrop-blur-xl p-4 cyber-clip-card flex flex-col gap-1.5">
              <h3 className="font-mono font-black text-xs uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] px-3 mb-2">
                Workspace Navigation
              </h3>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-none text-xs text-left cursor-pointer transition-all duration-200 relative ${
                  activeTab === 'profile'
                    ? 'text-blue-655 dark:text-[#22D3EE] font-bold font-mono'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-[#F9FAFB]'
                }`}
              >
                {activeTab === 'profile' && (
                  <div className="w-1 h-full bg-blue-500 dark:bg-[#22D3EE] absolute left-0" />
                )}
                <User size={14} className={activeTab === 'profile' ? 'text-blue-500 dark:text-[#22D3EE]' : 'text-slate-450'} />
                <span>General & Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-none text-xs text-left cursor-pointer transition-all duration-200 relative ${
                  activeTab === 'security'
                    ? 'text-blue-655 dark:text-[#22D3EE] font-bold font-mono'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-[#F9FAFB]'
                }`}
              >
                {activeTab === 'security' && (
                  <div className="w-1 h-full bg-blue-500 dark:bg-[#22D3EE] absolute left-0" />
                )}
                <Shield size={14} className={activeTab === 'security' ? 'text-blue-500 dark:text-[#22D3EE]' : 'text-slate-450'} />
                <span>Security & Access</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-none text-xs text-left cursor-pointer transition-all duration-200 relative ${
                  activeTab === 'notifications'
                    ? 'text-blue-655 dark:text-[#22D3EE] font-bold font-mono'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-[#F9FAFB]'
                }`}
              >
                {activeTab === 'notifications' && (
                  <div className="w-1 h-full bg-blue-500 dark:bg-[#22D3EE] absolute left-0" />
                )}
                <Bell size={14} className={activeTab === 'notifications' ? 'text-blue-500 dark:text-[#22D3EE]' : 'text-slate-450'} />
                <span>Notification Rules</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Pane */}
        <div key={activeTab} className="md:col-span-2 flex flex-col gap-6 animate-cyber-glitch">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <>
              {/* Account Information Card */}
              <div className="bg-slate-200/60 dark:bg-[#22D3EE]/20 p-[1px] cyber-clip-card shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <div className="bg-white dark:bg-[#0D1923]/80 backdrop-blur-xl p-6 cyber-clip-card flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-[#22D3EE]/10 pb-3">
                    <User size={16} className="text-blue-500 dark:text-[#22D3EE]" />
                    <h3 className="font-mono font-black text-slate-850 dark:text-[#F9FAFB] text-sm uppercase">Account Information</h3>
                  </div>
                  <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Display Name"
                        id="settings-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="rounded-none cyber-clip-button dark:bg-black/40 dark:border-[#22D3EE]/20"
                      />
                      <Input
                        label="Registered Email"
                        id="settings-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-none cyber-clip-button dark:bg-black/40 dark:border-[#22D3EE]/20"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-2">
                      {profileSuccess ? (
                        <span className="text-xs font-mono text-emerald-500 font-bold">{"&gt;&gt;&gt; UPDATE SUCCESSFUL"}</span>
                      ) : (
                        <span />
                      )}
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="px-5 py-2.5 text-xs bg-black text-[#22D3EE] font-mono tracking-wider uppercase border border-[#22D3EE]/50 hover:bg-[#22D3EE]/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 cursor-pointer cyber-clip-button"
                      >
                        {savingProfile ? 'EXECUTING...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Advanced 3-State Theme Switcher Card */}
              <div className="bg-slate-200/60 dark:bg-[#22D3EE]/20 p-[1px] cyber-clip-card shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <div className="bg-white dark:bg-[#0D1923]/80 backdrop-blur-xl p-6 cyber-clip-card flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-[#22D3EE]/10 pb-3">
                    <SettingsIcon size={16} className="text-blue-500 dark:text-[#22D3EE]" />
                    <h3 className="font-mono font-black text-slate-850 dark:text-[#F9FAFB] text-sm uppercase">Display Customization</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-[#F9FAFB]">Interface Theme Mode</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] max-w-sm">Select system chromatic core alignment mode</span>
                    </div>
                    {/* Glowing Cyber Theme Switcher */}
                    <div className="flex items-center gap-1.5 p-1 bg-black/45 border border-slate-200 dark:border-white/10 rounded-none cyber-clip-button self-start sm:self-auto">
                      <ThemeOptionButton
                        active={theme === 'light'}
                        onClick={() => setTheme('light')}
                        label="Light"
                        icon={<User size={10} />}
                      />
                      <ThemeOptionButton
                        active={theme === 'dark'}
                        onClick={() => setTheme('dark')}
                        label="Dark"
                        icon={<Shield size={10} />}
                      />
                      <ThemeOptionButton
                        active={theme === 'system'}
                        onClick={() => setTheme('system')}
                        label="System Auto"
                        icon={<Monitor size={10} />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <>
              {/* Password update card */}
              <div className="bg-slate-200/60 dark:bg-[#22D3EE]/20 p-[1px] cyber-clip-card shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <div className="bg-white dark:bg-[#0D1923]/80 backdrop-blur-xl p-6 cyber-clip-card flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-[#22D3EE]/10 pb-3">
                    <Shield size={16} className="text-blue-500 dark:text-[#22D3EE]" />
                    <h3 className="font-mono font-black text-slate-850 dark:text-[#F9FAFB] text-sm uppercase">Security Password</h3>
                  </div>
                  <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                    {passwordError && (
                      <div className="p-3 font-mono bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                        {"&gt;&gt;&gt; ERROR: "}{passwordError}
                      </div>
                    )}
                    <Input
                      label="Current Password"
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="rounded-none cyber-clip-button dark:bg-black/40 dark:border-[#22D3EE]/20"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="New Password"
                        id="new-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="rounded-none cyber-clip-button dark:bg-black/40 dark:border-[#22D3EE]/20"
                      />
                      <Input
                        label="Confirm New Password"
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="rounded-none cyber-clip-button dark:bg-black/40 dark:border-[#22D3EE]/20"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-2">
                      {passwordSuccess ? (
                        <span className="text-xs font-mono text-emerald-500 font-bold">{"&gt;&gt;&gt; PASSWORD SYNC SUCCESS"}</span>
                      ) : (
                        <span />
                      )}
                      <button
                        type="submit"
                        disabled={savingPassword}
                        className="px-5 py-2.5 text-xs bg-black text-[#22D3EE] font-mono tracking-wider uppercase border border-[#22D3EE]/50 hover:bg-[#22D3EE]/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 cursor-pointer cyber-clip-button"
                      >
                        {savingPassword ? 'EXECUTING...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Developer API access credentials */}
              <div className="bg-slate-200/60 dark:bg-[#22D3EE]/20 p-[1px] cyber-clip-card shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <div className="bg-white dark:bg-[#0D1923]/80 backdrop-blur-xl p-6 cyber-clip-card flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-[#22D3EE]/10 pb-3">
                    <Key size={16} className="text-blue-500 dark:text-[#22D3EE]" />
                    <h3 className="font-mono font-black text-slate-850 dark:text-[#F9FAFB] text-sm uppercase">Developer Access Key</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-mono text-slate-500 dark:text-[#94A3B8] leading-relaxed">
                      Utilize this secure client token to integrate the pipeline with external CRM tools, platforms, or custom webhooks. Keep this token confidential.
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        readOnly
                        value={mockApiKey}
                        className="flex-1 px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-black/40 border border-gray-250 dark:border-[#22D3EE]/25 text-slate-650 dark:text-[#22D3EE] rounded-none cyber-clip-button focus:outline-none"
                      />
                      <button
                        onClick={handleCopyKey}
                        className="p-2.5 rounded-none bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 text-slate-550 dark:text-slate-405 hover:text-[#22D3EE] dark:hover:text-[#22D3EE] hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-spring cursor-pointer cyber-clip-button"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check size={14} className="text-emerald-500 animate-scale-up" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-slate-200/60 dark:bg-[#22D3EE]/20 p-[1px] cyber-clip-card shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.15)]">
              <div className="bg-white dark:bg-[#0D1923]/80 backdrop-blur-xl p-6 cyber-clip-card flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-[#22D3EE]/10 pb-3">
                  <Bell size={16} className="text-blue-500 dark:text-[#22D3EE]" />
                  <h3 className="font-mono font-black text-slate-850 dark:text-[#F9FAFB] text-sm uppercase">Notification Preferences</h3>
                </div>
                <form onSubmit={handleNotificationsSubmit} className="flex flex-col gap-2">
                  <ToggleSwitch
                    checked={emailAlerts}
                    onChange={setEmailAlerts}
                    label="Email System Alerts"
                    description="Receive system updates and security alerts via email"
                  />
                  <ToggleSwitch
                    checked={newLeadNotification}
                    onChange={setNewLeadNotification}
                    label="New Lead Assign Alerts"
                    description="Notify me instantly when a new lead enters the active dashboard pipeline"
                  />
                  <ToggleSwitch
                    checked={weeklyDigest}
                    onChange={setWeeklyDigest}
                    label="Weekly Digest Summaries"
                    description="Receive a compiled status migration index digest report every Monday"
                  />
                  <div className="flex items-center justify-between gap-4 mt-6">
                    {notificationsSuccess ? (
                      <span className="text-xs font-mono text-emerald-500 font-bold">{"&gt;&gt;&gt; SETTINGS COMMITTED"}</span>
                    ) : (
                      <span />
                    )}
                    <button
                      type="submit"
                      disabled={savingNotifications}
                      className="px-5 py-2.5 text-xs bg-black text-[#22D3EE] font-mono tracking-wider uppercase border border-[#22D3EE]/50 hover:bg-[#22D3EE]/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 cursor-pointer cyber-clip-button"
                    >
                      {savingNotifications ? 'EXECUTING...' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
