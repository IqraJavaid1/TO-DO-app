import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Activity, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const CollaborationView: React.FC = () => {
  const { user, projects, addToast } = useTaskContext();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  const teamMembers = [
    { name: user.name, email: user.email, role: 'Owner', avatar: 'I', online: true },
    { name: 'Sarah Miller', email: 'sarah.m@taskpro.io', role: 'Lead Designer', avatar: 'S', online: true },
    { name: 'Alex Kumar', email: 'alex.k@taskpro.io', role: 'Frontend Engineer', avatar: 'A', online: true },
    { name: 'David Lee', email: 'david.l@taskpro.io', role: 'Product Manager', avatar: 'D', online: false },
    { name: 'Elena Rostova', email: 'elena.r@taskpro.io', role: 'QA Specialist', avatar: 'E', online: false },
  ];

  const [activities, setActivities] = useState([
    { id: 1, user: 'Sarah Miller', action: 'completed', target: '"Design dashboard wireframe"', time: '12m ago' },
    { id: 2, user: 'Alex Kumar', action: 'updated priority to High on', target: '"Prepare presentation for client"', time: '34m ago' },
    { id: 3, user: 'David Lee', action: 'commented on', target: '"Review weekly team backlog"', time: '1h ago' },
    { id: 4, user: 'Iqra', action: 'created project', target: '"Website"', time: '3h ago' },
  ]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    addToast(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#285A48]/35">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#B0E4CC]" />
            <span>Team & Collaboration</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time synchronization, shared projects, and live activity feeds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Team Members & Invite */}
        <div className="lg:col-span-2 space-y-5">
          {/* Invite Collaborator Card */}
          <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 p-5 shadow-xl shadow-black/25">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#408A71]" />
              <span>Invite New Collaborator</span>
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Collaborators will receive access to your workspace projects and assigned tasks.
            </p>

            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white placeholder-neutral-500 outline-none text-xs sm:text-sm"
              />
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-neutral-200 outline-none text-xs sm:text-sm"
              >
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white transition-all text-xs sm:text-sm whitespace-nowrap"
              >
                Send Invite
              </button>
            </form>
          </div>

          {/* Members List */}
          <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 p-5 shadow-xl shadow-black/25">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>Active Workspace Members ({teamMembers.length})</span>
              <span className="text-[11px] font-mono text-[#408A71]">Synced Real-time</span>
            </h3>

            <div className="divide-y divide-[#285A48]/30">
              {teamMembers.map((m, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#408A71] to-[#285A48] text-[#B0E4CC] flex items-center justify-center font-bold text-xs shadow-inner">
                        {m.avatar}
                      </div>
                      {m.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#091413]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{m.name}</h4>
                      <p className="text-xs text-neutral-400">{m.email}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#122822] border border-[#285A48] text-[#B0E4CC]">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Activity Stream */}
        <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 p-5 shadow-xl shadow-black/25 h-fit">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#285A48]/30">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#408A71]" />
              <span>Live Activity</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-4">
            {activities.map(act => (
              <div key={act.id} className="text-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono">
                  <span>{act.time}</span>
                  <span className="text-[#408A71]">Live</span>
                </div>
                <p className="text-neutral-200 leading-relaxed">
                  <strong className="text-white font-semibold">{act.user}</strong> {act.action}{' '}
                  <span className="text-[#B0E4CC]">{act.target}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
