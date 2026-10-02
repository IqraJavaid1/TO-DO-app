import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckSquare, 
  ArrowUpDown, 
  Filter, 
  Plus, 
  X, 
  Check, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { TaskRow } from './TaskRow';
import { TaskFilterTab, SortOption, Priority } from '../../types';

export const MyTasksSection: React.FC = () => {
  const { 
    filteredTasks, 
    taskFilter, 
    setTaskFilter, 
    sortBy, 
    setSortBy, 
    selectedTagFilter, 
    setSelectedTagFilter,
    selectedProjectFilter,
    setSelectedProjectFilter,
    projects,
    tags,
    setIsAddTaskModalOpen,
    selectedDate,
    setSelectedDate
  } = useTaskContext();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const tabs: { id: TaskFilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'overdue', label: 'Overdue' },
  ];

  const sortLabels: Record<SortOption, string> = {
    due_date: 'Due Date',
    priority: 'Priority',
    created_date: 'Created Date',
    alphabetical: 'Alphabetical',
    project: 'Project',
  };

  const hasActiveCustomFilters = Boolean(selectedTagFilter || selectedProjectFilter || selectedDate);

  return (
    <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 shadow-xl shadow-black/30 p-4 sm:p-6 mb-6">
      {/* Header bar: Title & Tabs on left, Sort & Filter on right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#285A48]/35">
        {/* Left: Icon, Title, and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#122822] border border-[#285A48]/70 flex items-center justify-center text-[#B0E4CC]">
              <CheckSquare className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              My Tasks
            </h2>
          </div>

          {/* Segmented Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#122822]/80 border border-[#285A48]/50 rounded-xl overflow-x-auto">
            {tabs.map(tab => {
              const isSelected = taskFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTaskFilter(tab.id)}
                  className={`
                    px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap
                    ${
                      isSelected
                        ? 'bg-[#B0E4CC] text-[#091413] shadow-sm'
                        : 'text-neutral-300 hover:text-white hover:bg-[#285A48]/30'
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Sort dropdown and Filter button */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Active Filter Clear Tag */}
          {hasActiveCustomFilters && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#285A48]/40 border border-[#408A71]/50 text-xs text-[#B0E4CC]">
              <span>Filtered</span>
              <button
                onClick={() => {
                  setSelectedTagFilter(null);
                  setSelectedProjectFilter(null);
                  setSelectedDate(null);
                }}
                className="hover:text-white"
                title="Clear filters"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#122822] border border-[#285A48]/70 hover:border-[#408A71] text-xs font-medium text-neutral-200 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#408A71]" />
              <span>Sort by: <strong className="text-white">{sortLabels[sortBy]}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-9 w-44 rounded-xl bg-[#0c1c1b] border border-[#285A48] shadow-2xl p-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                {(['due_date', 'priority', 'created_date', 'alphabetical', 'project'] as SortOption[]).map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setIsSortOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors
                      ${
                        sortBy === option
                          ? 'bg-[#285A48] text-white font-semibold'
                          : 'text-neutral-300 hover:bg-[#285A48]/30 hover:text-white'
                      }
                    `}
                  >
                    <span>{sortLabels[option]}</span>
                    {sortBy === option && <Check className="w-3.5 h-3.5 text-[#B0E4CC]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Popover Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`
                p-2 rounded-xl border transition-colors
                ${
                  isFilterOpen || hasActiveCustomFilters
                    ? 'bg-[#285A48] text-[#B0E4CC] border-[#408A71]'
                    : 'bg-[#122822] text-neutral-300 border-[#285A48]/70 hover:text-white hover:border-[#408A71]'
                }
              `}
              aria-label="Filter tasks"
            >
              <Filter className="w-4 h-4" />
            </button>

            {/* Filter Drawer / Popover */}
            {isFilterOpen && (
              <div className="absolute right-0 top-9 w-64 rounded-2xl bg-[#0c1c1b] border border-[#285A48] shadow-2xl p-4 z-40 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#285A48]/30 mb-3">
                  <span className="font-semibold text-white">Filter Tasks</span>
                  {hasActiveCustomFilters && (
                    <button
                      onClick={() => {
                        setSelectedTagFilter(null);
                        setSelectedProjectFilter(null);
                        setSelectedDate(null);
                      }}
                      className="text-[#B0E4CC] hover:underline text-[11px]"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                {/* Filter by Project */}
                <div className="mb-3">
                  <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1.5">
                    Project
                  </label>
                  <select
                    value={selectedProjectFilter || ''}
                    onChange={e => setSelectedProjectFilter(e.target.value || null)}
                    className="w-full bg-[#122822] border border-[#285A48]/70 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-[#408A71]"
                  >
                    <option value="">All Projects</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Filter by Tag */}
                <div className="mb-2">
                  <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1.5">
                    Tag
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {tags.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTagFilter(selectedTagFilter === t.name ? null : t.name)}
                        className={`
                          px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors
                          ${
                            selectedTagFilter === t.name
                              ? 'bg-[#B0E4CC] text-[#091413] border-[#B0E4CC]'
                              : 'bg-[#122822] text-neutral-300 border-[#285A48]/60 hover:border-[#408A71]'
                          }
                        `}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task List Rows */}
      <div className="mt-4 space-y-2.5">
        {filteredTasks.length === 0 ? (
          /* Empty State */
          <div className="py-12 px-4 rounded-xl border border-dashed border-[#285A48]/50 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-[#122822] border border-[#285A48] flex items-center justify-center text-[#B0E4CC] mb-3 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">
              You&apos;re all caught up!
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm">
              Enjoy the moment or create a new task to keep your momentum going.
            </p>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#B0E4CC] text-[#091413] hover:bg-white hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskRow key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
};
