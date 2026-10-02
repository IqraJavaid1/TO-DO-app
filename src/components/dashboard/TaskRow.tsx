import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, 
  Calendar, 
  MoreVertical, 
  ListChecks, 
  Copy, 
  Trash2, 
  Edit3, 
  Share2, 
  Bell, 
  ArrowRightLeft,
  Tag as TagIcon
} from 'lucide-react';
import { Task, Priority } from '../../types';
import { useTaskContext } from '../../context/TaskContext';

interface TaskRowProps {
  task: Task;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task }) => {
  const { 
    toggleTaskCompletion, 
    duplicateTask, 
    deleteTask, 
    changePriority, 
    setSelectedTaskDetail,
    setIsReminderModalOpen,
    projects,
    addToast
  } = useTaskContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const project = projects.find(p => p.id === task.projectId);

  // Cycle priority on click
  const handleCyclePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cycle: Record<Priority, Priority> = {
      high: 'medium',
      medium: 'low',
      low: 'high',
    };
    changePriority(task.id, cycle[task.priority]);
  };

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-950/70 text-rose-300 border-rose-800/50 hover:bg-rose-900/60';
      case 'medium':
        return 'bg-amber-950/70 text-amber-300 border-amber-800/50 hover:bg-amber-900/60';
      case 'low':
      default:
        return 'bg-[#122822] text-[#B0E4CC] border-[#285A48] hover:bg-[#1a3a32]';
    }
  };

  const completedSubtasksCount = task.subtasks.filter(s => s.completed).length;
  const totalSubtasksCount = task.subtasks.length;

  return (
    <div
      onClick={() => setSelectedTaskDetail(task)}
      className={`
        group relative flex flex-col md:flex-row md:items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer
        ${
          task.completed
            ? 'bg-[#091413]/50 border-[#285A48]/25 opacity-70 hover:opacity-90'
            : 'bg-[#0e211c]/60 hover:bg-[#122922]/90 border-[#285A48]/50 hover:border-[#408A71]/70 hover:shadow-md hover:shadow-black/20'
        }
      `}
    >
      {/* Left + Center Area: Checkbox + Title + Description + Tags + Subtask bar */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0 pr-2">
        {/* Checkbox */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleTaskCompletion(task.id);
          }}
          className={`
            w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 mt-0.5 shrink-0
            ${
              task.completed
                ? 'bg-[#408A71] border-[#B0E4CC] text-[#091413] scale-95 shadow-sm shadow-[#408A71]/50'
                : 'bg-transparent border-[#408A71]/80 hover:border-[#B0E4CC] hover:bg-[#285A48]/30'
            }
          `}
          aria-label={task.completed ? 'Mark uncompleted' : 'Mark completed'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
        </button>

        {/* Text and metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`
                text-sm font-semibold tracking-tight transition-all duration-150 leading-snug
                ${
                  task.completed
                    ? 'line-through text-neutral-400 font-normal'
                    : 'text-neutral-100 group-hover:text-white'
                }
              `}
            >
              {task.title}
            </h3>

            {project && (
              <span className="text-[11px] text-[#408A71] font-medium hidden sm:inline">
                · {project.name}
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-neutral-300 mt-1 line-clamp-1 leading-normal font-normal">
              {task.description}
            </p>
          )}

          {/* Subtasks Progress mini-bar if task has subtasks */}
          {totalSubtasksCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <ListChecks className="w-3.5 h-3.5 text-[#408A71] shrink-0" />
              <div className="w-20 sm:w-28 h-1.5 bg-[#122822] rounded-full overflow-hidden border border-[#285A48]/60">
                <div
                  className="h-full bg-gradient-to-r from-[#408A71] to-[#B0E4CC] transition-all duration-300"
                  style={{ width: `${(completedSubtasksCount / totalSubtasksCount) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {completedSubtasksCount}/{totalSubtasksCount} completed
              </span>
            </div>
          )}

          {/* Tags as small rounded pills */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#122822] border border-[#285A48]/70 text-[#B0E4CC] group-hover:border-[#408A71]/60 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Deadline + Priority pill + More options menu */}
      <div 
        className="flex items-center justify-between md:justify-end gap-3 mt-3 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#285A48]/30 shrink-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Deadline with calendar icon */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-mono">
          <Calendar className="w-3.5 h-3.5 text-[#408A71]" />
          <span>{task.dueDate}</span>
        </div>

        {/* Priority Indicator Pill */}
        <button
          type="button"
          onClick={handleCyclePriority}
          title="Click to cycle priority"
          className={`
            px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all duration-150 capitalize cursor-pointer active:scale-95
            ${getPriorityStyle(task.priority)}
          `}
        >
          {task.priority}
        </button>

        {/* More Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-[#285A48]/40 flex items-center justify-center transition-colors"
            aria-label="Task options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 w-48 rounded-xl bg-[#0c1c1b] border border-[#285A48] shadow-2xl p-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setSelectedTaskDetail(task);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-200 hover:bg-[#285A48]/40 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#408A71]" />
                <span>Edit / Details</span>
              </button>

              <button
                onClick={() => {
                  duplicateTask(task.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-200 hover:bg-[#285A48]/40 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#408A71]" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => {
                  setSelectedTaskDetail(task);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-200 hover:bg-[#285A48]/40 transition-colors"
              >
                <ListChecks className="w-3.5 h-3.5 text-[#408A71]" />
                <span>Add Subtask</span>
              </button>

              <button
                onClick={() => {
                  setIsReminderModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-200 hover:bg-[#285A48]/40 transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-[#408A71]" />
                <span>Add Reminder</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Task: ${task.title} - Due: ${task.dueDate}`);
                  addToast('Task details copied to clipboard');
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-200 hover:bg-[#285A48]/40 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[#408A71]" />
                <span>Share</span>
              </button>

              <div className="border-t border-[#285A48]/30 my-1" />

              <button
                onClick={() => {
                  deleteTask(task.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
