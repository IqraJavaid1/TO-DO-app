import React, { useState } from 'react';
import { X, Bell, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const ReminderModal: React.FC = () => {
  const { 
    isReminderModalOpen, 
    setIsReminderModalOpen, 
    addNotification, 
    addToast 
  } = useTaskContext();

  const [reminderTitle, setReminderTitle] = useState('Client Strategy Alignment');
  const [reminderDate, setReminderDate] = useState('Today, 5:00 PM');
  const [method, setMethod] = useState<'browser' | 'in_app' | 'email' | 'mobile'>('in_app');
  const [isLocationTrigger, setIsLocationTrigger] = useState(false);
  const [locationName, setLocationName] = useState('Office');
  const [locationRule, setLocationRule] = useState<'arriving' | 'leaving'>('arriving');

  if (!isReminderModalOpen) return null;

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocationTrigger(true);
          addToast('Location access granted. Geofence active.');
        },
        () => {
          setIsLocationTrigger(true);
          addToast('Using simulated location geofence', 'info');
        }
      );
    } else {
      setIsLocationTrigger(true);
      addToast('Location reminder enabled', 'info');
    }
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification(
      `Reminder: ${reminderTitle}`,
      `Scheduled for ${reminderDate} via ${method.replace('_', ' ')}${isLocationTrigger ? ` when ${locationRule} ${locationName}` : ''}.`,
      'reminder'
    );
    addToast(`Reminder scheduled for "${reminderTitle}"`);
    setIsReminderModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#0c1c1b] border border-[#285A48] rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#285A48]/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#285A48] text-[#B0E4CC] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Set a Reminder</h3>
              <p className="text-xs text-neutral-400">Timely alerts for high-priority targets</p>
            </div>
          </div>
          <button
            onClick={() => setIsReminderModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveReminder} className="mt-4 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Reminder Title
            </label>
            <input
              type="text"
              required
              value={reminderTitle}
              onChange={e => setReminderTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white outline-none focus:border-[#408A71]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Date & Time
            </label>
            <input
              type="text"
              value={reminderDate}
              onChange={e => setReminderDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Notification Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'in_app', label: 'In-App Notification' },
                { id: 'browser', label: 'Browser Alert' },
                { id: 'email', label: 'Email Digest' },
                { id: 'mobile', label: 'Mobile Push' },
              ].map(ch => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setMethod(ch.id as any)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium text-left transition-colors ${
                    method === ch.id
                      ? 'bg-[#285A48] text-[#B0E4CC] border-[#408A71] font-semibold'
                      : 'bg-[#122822] text-neutral-400 border-[#285A48]/60 hover:text-white'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 32: Location-Based Reminders */}
          <div className="pt-2 border-t border-[#285A48]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Location Geofence
              </span>
              <button
                type="button"
                onClick={handleRequestLocation}
                className="text-xs text-[#B0E4CC] hover:underline"
              >
                {isLocationTrigger ? 'Configure' : '+ Enable Geofence'}
              </button>
            </div>

            {isLocationTrigger && (
              <div className="p-3 rounded-xl bg-[#122822] border border-[#285A48]/70 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Location (e.g. Supermarket, Office)"
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#091413] border border-[#285A48]/70 text-white text-xs outline-none"
                  />
                  <select
                    value={locationRule}
                    onChange={e => setLocationRule(e.target.value as any)}
                    className="px-2 py-1.5 rounded-lg bg-[#091413] border border-[#285A48]/70 text-neutral-200 text-xs outline-none"
                  >
                    <option value="arriving">When arriving</option>
                    <option value="leaving">When leaving</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#408A71]" />
                  <span>Browser location permission granted.</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#285A48]/40">
            <button
              type="button"
              onClick={() => setIsReminderModalOpen(false)}
              className="px-4 py-2 rounded-xl text-neutral-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white transition-all"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
