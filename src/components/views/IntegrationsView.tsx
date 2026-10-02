import React, { useState } from 'react';
import { 
  Blocks, 
  Calendar, 
  Mail, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  connected: boolean;
  lastSynced?: string;
  iconBg: string;
}

export const IntegrationsView: React.FC = () => {
  const { addToast } = useTaskContext();

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'gcal',
      name: 'Google Calendar',
      category: 'Calendar',
      description: 'Synchronize task deadlines with Google Calendar events and Google Meet agendas.',
      connected: false,
      iconBg: '#4285F4',
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      category: 'Calendar & Mail',
      description: 'Sync scheduled tasks and priorities directly with Outlook 365 calendar schedules.',
      connected: false,
      iconBg: '#0078D4',
    },
    {
      id: 'apple_cal',
      name: 'Apple Calendar',
      category: 'Calendar',
      description: 'Export live CalDAV calendar feed for seamless iOS and macOS sync.',
      connected: false,
      iconBg: '#FA2D48',
    },
    {
      id: 'email_digest',
      name: 'Email Daily Digest',
      category: 'Email',
      description: 'Receive morning briefing of today\'s focus tasks and weekly velocity recaps.',
      connected: false,
      iconBg: '#285A48',
    },
    {
      id: 'slack',
      name: 'Slack Notifications',
      category: 'Messaging',
      description: 'Stream task updates and project milestones to designated Slack channels.',
      connected: false,
      iconBg: '#E01E5A',
    },
    {
      id: 'notion',
      name: 'Notion Workspace',
      category: 'Notes',
      description: 'Two-way sync tasks with your Notion databases and project tracking boards.',
      connected: false,
      iconBg: '#000000',
    },
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.connected;
          addToast(
            nextState ? `Connected to ${item.name}` : `Disconnected from ${item.name}`,
            nextState ? 'success' : 'info'
          );
          return {
            ...item,
            connected: nextState,
            lastSynced: nextState ? 'Just now' : undefined,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#285A48]/35">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Blocks className="w-6 h-6 text-[#B0E4CC]" />
            <span>Integrations & Sync</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Connect external calendars, messaging apps, and productivity toolkits.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(integ => (
          <div
            key={integ.id}
            className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 hover:border-[#408A71] p-5 shadow-xl shadow-black/25 flex flex-col justify-between transition-colors group"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md"
                  style={{ backgroundColor: integ.iconBg }}
                >
                  {integ.name.substring(0, 2).toUpperCase()}
                </div>

                {/* Connection Status Badge */}
                <div
                  className={`
                    px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5
                    ${
                      integ.connected
                        ? 'bg-emerald-950/70 border-emerald-700/60 text-[#B0E4CC]'
                        : 'bg-[#122822] border-[#285A48]/60 text-neutral-400'
                    }
                  `}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${integ.connected ? 'bg-emerald-400' : 'bg-neutral-500'}`}
                  />
                  <span>{integ.connected ? 'Connected' : 'Not Connected'}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-[#B0E4CC] transition-colors">
                {integ.name}
              </h3>
              <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                {integ.description}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#285A48]/30 flex items-center justify-between">
              {integ.connected ? (
                <span className="text-[11px] text-[#408A71] font-mono">
                  Synced: {integ.lastSynced || 'Active'}
                </span>
              ) : (
                <span className="text-[11px] text-neutral-500 font-mono">
                  Ready to link
                </span>
              )}

              <button
                onClick={() => toggleConnection(integ.id)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold transition-all
                  ${
                    integ.connected
                      ? 'bg-[#122822] text-neutral-300 hover:text-rose-400 hover:bg-rose-500/10 border border-[#285A48]'
                      : 'bg-[#B0E4CC] text-[#091413] hover:bg-white shadow-sm'
                  }
                `}
              >
                {integ.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
