import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  SlidersHorizontal, 
  LogOut, 
  Check, 
  Clock, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { ASSETS } from '../../assets';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { 
    user, 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    unreadNotifsCount, 
    markNotificationRead, 
    markAllNotificationsRead,
    tasks,
    setSelectedTaskDetail,
    setActiveTab,
    addToast
  } = useTaskContext();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsNotifOpen(false);
        setIsUserMenuOpen(false);
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live matching tasks for quick search results preview
  const liveResults = searchQuery.trim()
    ? tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 4)
    : [];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#091413]/90 backdrop-blur-md border-b border-[#285A48]/30 px-4 md:px-8 flex items-center justify-between">
      {/* Left zone: Mobile toggle & Breadcrumb indicator */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-[#285A48]/30 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile brand indicator */}
        <div className="flex md:hidden items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#285A48] border border-[#408A71]/50 flex items-center justify-center overflow-hidden p-0.5 shrink-0">
            <img 
              src={ASSETS.appLogo} 
              alt="TaskPro logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">Task<span className="text-[#B0E4CC]">Pro</span></span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-400">
          <span className="text-[#408A71]">Workspace</span>
          <span>/</span>
          <span className="text-neutral-200">Productivity Hub</span>
        </div>
      </div>

      {/* Center/Right Zone: Global Search Field */}
      <div className="relative flex-1 max-w-[350px] mx-4">
        <div
          className={`
            relative flex items-center w-full h-10 px-3.5 rounded-full bg-[#091413]/70 border transition-all duration-200
            ${
              isSearchFocused
                ? 'border-[#408A71] shadow-[0_0_15px_rgba(64,138,113,0.35)] ring-1 ring-[#408A71]'
                : 'border-[#285A48]/60 hover:border-[#408A71]/50'
            }
          `}
        >
          <Search
            className={`w-4 h-4 mr-2.5 transition-colors shrink-0 ${
              isSearchFocused ? 'text-[#B0E4CC]' : 'text-neutral-400'
            }`}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search tasks, projects, tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-400/80 outline-none"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-neutral-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-[#285A48]/40 border border-[#285A48]/60 rounded">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Live Search Quick Popover */}
        {isSearchFocused && liveResults.length > 0 && (
          <div className="absolute top-12 left-0 right-0 bg-[#0c1c1b] border border-[#285A48] rounded-2xl shadow-2xl p-2 z-50 overflow-hidden">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-[#408A71] uppercase tracking-wider">
              Quick Matches ({liveResults.length})
            </div>
            {liveResults.map(task => (
              <div
                key={task.id}
                onMouseDown={() => setSelectedTaskDetail(task)}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#285A48]/40 cursor-pointer text-sm transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${task.completed ? 'bg-[#B0E4CC]' : 'bg-[#408A71]'}`} />
                  <span className={`truncate ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-200'}`}>
                    {task.title}
                  </span>
                </div>
                <span className="text-xs text-neutral-400 shrink-0 font-mono ml-2">
                  {task.dueDate}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Notifications & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Notification button */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative w-9 h-9 rounded-full bg-[#122822] border border-[#285A48]/60 flex items-center justify-center text-neutral-300 hover:text-white hover:border-[#408A71] hover:bg-[#285A48]/30 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-[#0c1c1b] border border-[#285A48] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#285A48]/30">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">Notifications</h4>
                  {unreadNotifsCount > 0 && (
                    <span className="text-[11px] font-mono bg-[#408A71]/30 text-[#B0E4CC] px-2 py-0.5 rounded-full">
                      {unreadNotifsCount} new
                    </span>
                  )}
                </div>
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#B0E4CC] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-neutral-400">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`
                        p-3 rounded-xl cursor-pointer transition-colors border
                        ${
                          n.read
                            ? 'bg-transparent border-[#285A48]/20 text-neutral-300'
                            : 'bg-[#122822]/80 border-[#408A71]/40 text-neutral-100 shadow-sm'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-white">{n.title}</span>
                        <span className="text-[10px] text-neutral-400 font-mono shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#122822] border border-[#285A48]/60 hover:border-[#408A71] hover:bg-[#285A48]/40 transition-all group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#408A71] to-[#285A48] text-[#B0E4CC] flex items-center justify-center font-bold text-xs shadow-inner">
              {user.avatar || 'I'}
            </div>
            <span className="text-xs font-medium text-neutral-200 hidden sm:inline">
              {user.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl bg-[#0c1c1b] border border-[#285A48] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-[#285A48]/30 mb-1">
                <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{user.email}</p>
                <div className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-[#285A48]/40 text-[#B0E4CC]">
                  {user.title}
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-[#285A48]/40 transition-colors"
                >
                  <User className="w-4 h-4 text-[#408A71]" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-[#285A48]/40 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#408A71]" />
                  <span>Preferences</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('integrations');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-[#285A48]/40 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#408A71]" />
                  <span>Integrations</span>
                </button>
                
                <div className="border-t border-[#285A48]/30 my-1" />

                <button
                  onClick={() => {
                    addToast('Signed out of TaskPro session', 'info');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
