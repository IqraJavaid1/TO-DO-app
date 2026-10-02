import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FolderKanban, 
  Tags, 
  CalendarDays, 
  Users, 
  Blocks, 
  Settings, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { NavigationTab } from '../../types';
import { ASSETS } from '../../assets';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { 
    activeTab, 
    setActiveTab, 
    tasks, 
    completedTasksCount,
    addToast 
  } = useTaskContext();

  const myTasksCount = tasks.filter(t => !t.completed).length;
  const todayCount = tasks.filter(t => !t.completed && t.dueDate.toLowerCase().includes('today')).length;
  const upcomingCount = tasks.filter(t => !t.completed && (t.dueDate.toLowerCase().includes('tomorrow') || t.dueDate.includes('Oct'))).length;

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const mainNavItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my_tasks' as NavigationTab, label: 'My Tasks', icon: CheckSquare, badge: myTasksCount || 5 },
    { id: 'today' as NavigationTab, label: 'Today', icon: Calendar, badge: todayCount || 3 },
    { id: 'upcoming' as NavigationTab, label: 'Upcoming', icon: Clock, badge: upcomingCount || 7 },
    { id: 'completed' as NavigationTab, label: 'Completed', icon: CheckCircle2, badge: completedTasksCount || 12 },
  ];

  const secondaryNavItems = [
    { id: 'projects' as NavigationTab, label: 'Projects', icon: FolderKanban },
    { id: 'tags' as NavigationTab, label: 'Tags', icon: Tags },
    { id: 'calendar' as NavigationTab, label: 'Calendar', icon: CalendarDays },
    { id: 'collaboration' as NavigationTab, label: 'Collaboration', icon: Users },
    { id: 'integrations' as NavigationTab, label: 'Integrations', icon: Blocks },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-[275px] bg-[#091413] border-r border-[#285A48]/35 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Top Branding & Nav Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
        {/* Brand Logo & Tagline */}
        <div className="px-3 mb-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#285A48] to-[#122b22] border border-[#408A71]/50 flex items-center justify-center shadow-lg shadow-black/40 shrink-0 overflow-hidden p-1">
              <img 
                src={ASSETS.appLogo} 
                alt="TaskPro logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-none">
                Task<span className="text-[#B0E4CC]">Pro</span>
              </span>
              <span className="text-[9.5px] font-semibold tracking-[0.18em] text-[#408A71] block mt-1 uppercase">
                PLAN • FOCUS • ACHIEVE
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1 mb-6">
          {mainNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-[#285A48] text-white shadow-md shadow-black/25'
                      : 'text-neutral-300 hover:text-white hover:bg-[#285A48]/30 hover:translate-x-1'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#B0E4CC]' : 'text-neutral-400 group-hover:text-[#408A71]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`
                      text-xs px-2 py-0.5 rounded-md font-mono tabular-nums transition-colors
                      ${
                        isActive
                          ? 'bg-[#091413]/60 text-[#B0E4CC]'
                          : 'bg-[#285A48]/40 text-neutral-400 group-hover:text-neutral-200'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Thin Divider */}
        <div className="border-t border-[#285A48]/30 my-4 mx-2" />

        {/* Secondary Navigation */}
        <nav className="space-y-1">
          {secondaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-[#285A48] text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-[#285A48]/25 hover:translate-x-1'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#B0E4CC]' : 'text-neutral-500 group-hover:text-[#408A71]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500/60 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Motivational Card at Bottom Left */}
      <div className="p-4 pt-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#122822] via-[#0e1f1b] to-[#091413] border border-[#285A48]/60 p-4 shadow-xl shadow-black/40">
          {/* Plant / Leaf illustration background thumbnail */}
          <div className="absolute -right-3 -bottom-3 w-28 h-28 opacity-25 pointer-events-none overflow-hidden rounded-full mix-blend-screen">
            <img 
              src={ASSETS.sidebarPlantCard} 
              alt="Botanical illustration"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10">
            <p className="text-[13px] font-medium leading-snug text-neutral-200 pr-2">
              Small steps<br />
              every day lead to<br />
              <span className="text-[#B0E4CC] font-semibold">big results.</span>
            </p>

            <button
              onClick={() => addToast('Stay focused! Consistency is key to achievement.', 'info')}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#B0E4CC] text-[#091413] hover:bg-white hover:shadow-md transition-all active:scale-95"
            >
              <span>Keep Going</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
