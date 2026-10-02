import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Download, 
  RotateCcw, 
  Check, 
  Volume2
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    setUser, 
    theme, 
    toggleTheme, 
    resetToDemoData, 
    tasks, 
    projects, 
    tags, 
    addToast 
  } = useTaskContext();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title);
  const [timezone, setTimezone] = useState(user.timezone);
  const [soundEffects, setSoundEffects] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      email,
      title,
      timezone,
    }));
    addToast('Profile changes saved');
  };

  const handleExportData = () => {
    const data = {
      user,
      tasks,
      projects,
      tags,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskpro-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('TaskPro workspace exported to JSON');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#285A48]/35">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#B0E4CC]" />
          <span>Workspace Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Customize your profile, notifications, appearance, and workspace backups.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 p-6 shadow-xl shadow-black/25">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-[#408A71]" />
          <span>Profile Information</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white outline-none focus:border-[#408A71]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white outline-none focus:border-[#408A71]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white outline-none focus:border-[#408A71]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
                Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white outline-none focus:border-[#408A71]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white transition-all text-xs"
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* Preferences & Appearance Card */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 p-6 shadow-xl shadow-black/25">
        <h3 className="text-sm font-bold text-white mb-4">
          Preferences & System
        </h3>

        <div className="space-y-4 divide-y divide-[#285A48]/30">
          {/* Theme */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-sm font-semibold text-white">App Theme</h4>
              <p className="text-xs text-neutral-400">Toggle between dark and light workspace interface.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#122822] border border-[#285A48] text-xs font-semibold text-neutral-200 hover:text-white"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-[#B0E4CC]" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span className="capitalize">{theme} Mode</span>
            </button>
          </div>

          {/* Sound FX */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <h4 className="text-sm font-semibold text-white">Audio Feedback</h4>
              <p className="text-xs text-neutral-400">Play pleasant micro-chimes on task completion.</p>
            </div>
            <button
              onClick={() => {
                setSoundEffects(!soundEffects);
                addToast(soundEffects ? 'Audio feedback disabled' : 'Audio feedback enabled');
              }}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold ${
                soundEffects ? 'bg-[#285A48] text-[#B0E4CC] border-[#408A71]' : 'bg-[#122822] text-neutral-400 border-[#285A48]/60'
              }`}
            >
              {soundEffects ? 'Enabled' : 'Muted'}
            </button>
          </div>

          {/* Browser Notifications */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <h4 className="text-sm font-semibold text-white">Push Notifications</h4>
              <p className="text-xs text-neutral-400">Receive desktop alerts when deadlines approach.</p>
            </div>
            <button
              onClick={() => {
                setBrowserNotifications(!browserNotifications);
                addToast(browserNotifications ? 'Notifications disabled' : 'Notifications enabled');
              }}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold ${
                browserNotifications ? 'bg-[#285A48] text-[#B0E4CC] border-[#408A71]' : 'bg-[#122822] text-neutral-400 border-[#285A48]/60'
              }`}
            >
              {browserNotifications ? 'Active' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Management Card */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 p-6 shadow-xl shadow-black/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Data Backup & Demo Reset</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Export all tasks and projects, or reset workspace back to default reference demo data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#122822] border border-[#285A48] text-xs font-medium text-neutral-200 hover:text-white"
          >
            <Download className="w-3.5 h-3.5 text-[#408A71]" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={resetToDemoData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs font-medium text-rose-300 hover:bg-rose-900/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
