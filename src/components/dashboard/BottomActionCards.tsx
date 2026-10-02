import React from 'react';
import { FolderPlus, BellRing, Link, ArrowRight } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const BottomActionCards: React.FC = () => {
  const { 
    setIsCreateProjectModalOpen, 
    setIsReminderModalOpen, 
    setActiveTab 
  } = useTaskContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 mb-6">
      {/* 1. Create a New Project */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 hover:border-[#408A71] p-5 shadow-lg shadow-black/20 flex flex-col justify-between transition-all duration-200 group">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#122822] border border-[#285A48]/70 flex items-center justify-center text-[#B0E4CC] mb-3 group-hover:scale-105 transition-transform">
            <FolderPlus className="w-5 h-5 text-[#408A71] group-hover:text-[#B0E4CC] transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-[#B0E4CC] transition-colors">
            Create a New Project
          </h3>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
            Organize your tasks into projects and stay focused.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectModalOpen(true)}
          className="mt-4 self-start inline-flex items-center gap-1.5 text-xs font-semibold text-[#B0E4CC] hover:text-white transition-colors group/btn"
        >
          <span>+ Create Project</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 2. Set a Reminder */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 hover:border-[#408A71] p-5 shadow-lg shadow-black/20 flex flex-col justify-between transition-all duration-200 group">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#122822] border border-[#285A48]/70 flex items-center justify-center text-[#B0E4CC] mb-3 group-hover:scale-105 transition-transform">
            <BellRing className="w-5 h-5 text-[#408A71] group-hover:text-[#B0E4CC] transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-[#B0E4CC] transition-colors">
            Set a Reminder
          </h3>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
            Never miss an important task or deadline.
          </p>
        </div>

        <button
          onClick={() => setIsReminderModalOpen(true)}
          className="mt-4 self-start inline-flex items-center gap-1.5 text-xs font-semibold text-[#B0E4CC] hover:text-white transition-colors group/btn"
        >
          <span>+ Add Reminder</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3. Connect Integrations */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 hover:border-[#408A71] p-5 shadow-lg shadow-black/20 flex flex-col justify-between transition-all duration-200 group">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#122822] border border-[#285A48]/70 flex items-center justify-center text-[#B0E4CC] mb-3 group-hover:scale-105 transition-transform">
            <Link className="w-5 h-5 text-[#408A71] group-hover:text-[#B0E4CC] transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-[#B0E4CC] transition-colors">
            Connect Integrations
          </h3>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
            Sync with Google Calendar, Outlook and more.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('integrations')}
          className="mt-4 self-start inline-flex items-center gap-1.5 text-xs font-semibold text-[#B0E4CC] hover:text-white transition-colors group/btn"
        >
          <span>+ View Integrations</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
