import React from 'react';
import { Plus, Mic, Zap, CalendarCheck2, Link2 } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const QuickActionBar: React.FC = () => {
  const { 
    setIsAddTaskModalOpen, 
    setIsVoiceInputModalOpen, 
    setIsQuickAddModalOpen,
    setActiveTab,
    setTaskFilter,
    addToast
  } = useTaskContext();

  const handleTodaysPlan = () => {
    setActiveTab('today');
    setTaskFilter('today');
    addToast('Viewing Today\'s focused plan');
  };

  const handleIntegrations = () => {
    setActiveTab('integrations');
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 my-4">
      {/* 1. Add Task - Primary CTA */}
      <button
        onClick={() => setIsAddTaskModalOpen(true)}
        className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[#B0E4CC] text-[#091413] hover:bg-white hover:shadow-lg hover:shadow-[#B0E4CC]/20 transition-all duration-200 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span className="whitespace-nowrap">Add Task</span>
      </button>

      {/* 2. Voice Input */}
      <button
        onClick={() => setIsVoiceInputModalOpen(true)}
        className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-[#122822] hover:bg-[#1a3830] text-neutral-200 border border-[#285A48]/70 hover:border-[#408A71] transition-all duration-200 group active:scale-[0.98]"
      >
        <Mic className="w-4 h-4 text-[#408A71] group-hover:text-[#B0E4CC] transition-colors" />
        <span className="whitespace-nowrap">Voice Input</span>
      </button>

      {/* 3. Quick Add */}
      <button
        onClick={() => setIsQuickAddModalOpen(true)}
        className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-[#122822] hover:bg-[#1a3830] text-neutral-200 border border-[#285A48]/70 hover:border-[#408A71] transition-all duration-200 group active:scale-[0.98]"
      >
        <Zap className="w-4 h-4 text-[#408A71] group-hover:text-[#B0E4CC] transition-colors" />
        <span className="whitespace-nowrap">Quick Add</span>
      </button>

      {/* 4. Today's Plan */}
      <button
        onClick={handleTodaysPlan}
        className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-[#122822] hover:bg-[#1a3830] text-neutral-200 border border-[#285A48]/70 hover:border-[#408A71] transition-all duration-200 group active:scale-[0.98]"
      >
        <CalendarCheck2 className="w-4 h-4 text-[#408A71] group-hover:text-[#B0E4CC] transition-colors" />
        <span className="whitespace-nowrap">Today&apos;s Plan</span>
      </button>

      {/* 5. Integrations */}
      <button
        onClick={handleIntegrations}
        className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-[#122822] hover:bg-[#1a3830] text-neutral-200 border border-[#285A48]/70 hover:border-[#408A71] transition-all duration-200 group active:scale-[0.98]"
      >
        <Link2 className="w-4 h-4 text-[#408A71] group-hover:text-[#B0E4CC] transition-colors" />
        <span className="whitespace-nowrap">Integrations</span>
      </button>
    </div>
  );
};
