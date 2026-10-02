import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Moon, 
  Sun,
  PieChart as PieIcon,
  Flame,
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const RightPanel: React.FC = () => {
  const { 
    todayTasks,
    todayCompletedCount,
    todayTotalCount,
    toggleTaskCompletion,
    highPriorityCount,
    mediumPriorityCount,
    lowPriorityCount,
    tasks,
    tags,
    selectedTagFilter,
    setSelectedTagFilter,
    setIsCreateTagModalOpen,
    theme,
    toggleTheme,
    selectedDate,
    setSelectedDate
  } = useTaskContext();

  // Calendar month state
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 2)); // Oct 2, 2026

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();
  const monthLabel = `${monthNames[currentMonthIndex]} ${currentYear}`;

  // Generate grid days for the month
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();

  const calendarDays: { day: number; isCurrentMonth: boolean; dateString: string }[] = [];

  // Prev month padding
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarDays.push({ 
      day: d, 
      isCurrentMonth: false, 
      dateString: `${currentYear}-${String(currentMonthIndex).padStart(2, '0')}-${String(d).padStart(2, '0')}` 
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const formatted = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ 
      day: d, 
      isCurrentMonth: true, 
      dateString: formatted 
    });
  }

  // Next month padding to reach 35 or 42 cells
  const remaining = 35 - calendarDays.length;
  if (remaining > 0) {
    for (let d = 1; d <= remaining; d++) {
      calendarDays.push({ 
        day: d, 
        isCurrentMonth: false, 
        dateString: `${currentYear}-${String(currentMonthIndex + 2).padStart(2, '0')}-${String(d).padStart(2, '0')}` 
      });
    }
  }

  // Today is Oct 2, 2026
  const isDateToday = (d: number, isCurMonth: boolean) => isCurMonth && d === 2 && currentMonthIndex === 9 && currentYear === 2026;

  // Donut chart math
  const totalTasks = tasks.length || 8;
  const highRatio = highPriorityCount / totalTasks;
  const mediumRatio = mediumPriorityCount / totalTasks;
  const lowRatio = lowPriorityCount / totalTasks;

  const circumference = 2 * Math.PI * 40; // r = 40 => circumference ~ 251.32
  const highStroke = highRatio * circumference;
  const medStroke = mediumRatio * circumference;
  const lowStroke = lowRatio * circumference;

  const progressPercent = Math.round((todayCompletedCount / (todayTotalCount || 1)) * 100);

  return (
    <div className="w-full space-y-4">
      {/* 1. Compact Calendar Card */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 shadow-xl shadow-black/25 p-4 sm:p-5">
        {/* Calendar Header with Navigation */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#285A48]/30">
          <h3 className="text-sm font-bold text-white tracking-tight">
            {monthLabel}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#285A48]/40 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#285A48]/40 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1.5 text-[11px] font-mono font-medium text-neutral-400">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((cDay, idx) => {
            const isToday = isDateToday(cDay.day, cDay.isCurrentMonth);
            const isSelected = selectedDate === cDay.dateString;

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDate(isSelected ? null : cDay.dateString);
                }}
                className={`
                  h-8 rounded-lg text-xs font-mono font-medium flex items-center justify-center transition-all duration-150 relative
                  ${!cDay.isCurrentMonth ? 'text-neutral-600' : 'text-neutral-200 hover:bg-[#285A48]/40 hover:text-white'}
                  ${
                    isSelected
                      ? 'bg-[#B0E4CC] !text-[#091413] font-bold shadow-md shadow-[#B0E4CC]/20'
                      : isToday
                      ? 'border border-[#408A71] bg-[#122822] text-[#B0E4CC] font-bold'
                      : ''
                  }
                `}
              >
                {cDay.day}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#B0E4CC]" />
                )}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-2.5 pt-2 border-t border-[#285A48]/30 flex items-center justify-between text-[11px] text-[#B0E4CC]">
            <span>Filter by: {selectedDate}</span>
            <button
              onClick={() => setSelectedDate(null)}
              className="underline hover:text-white"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* 2. Today's Focus Card */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 shadow-xl shadow-black/25 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Today&apos;s Focus
          </h3>
          <span className="text-xs font-mono text-[#B0E4CC] font-semibold">
            {todayCompletedCount}/{todayTotalCount} completed
          </span>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="w-full h-2 bg-[#122822] rounded-full overflow-hidden border border-[#285A48]/60 mb-3.5">
          <div
            className="h-full bg-gradient-to-r from-[#408A71] to-[#B0E4CC] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist of Today's Tasks */}
        <div className="space-y-2">
          {todayTasks.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTaskCompletion(task.id)}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#122822]/80 cursor-pointer transition-colors group"
            >
              <div
                className={`
                  w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0
                  ${
                    task.completed
                      ? 'bg-[#408A71] border-[#B0E4CC] text-[#091413]'
                      : 'bg-transparent border-[#408A71]/70 group-hover:border-[#B0E4CC]'
                  }
                `}
              >
                {task.completed && <Check className="w-3 h-3 stroke-[3] text-white" />}
              </div>
              <span
                className={`
                  text-xs transition-colors truncate
                  ${
                    task.completed
                      ? 'line-through text-neutral-400 font-normal'
                      : 'text-neutral-200 group-hover:text-white font-medium'
                  }
                `}
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Priority Overview (Donut Chart) */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 shadow-xl shadow-black/25 p-4 sm:p-5">
        <h3 className="text-sm font-bold text-white tracking-tight mb-3">
          Priority Overview
        </h3>

        <div className="flex items-center justify-between gap-4">
          {/* Circular Donut Chart */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#122822"
                strokeWidth="12"
                fill="none"
              />
              {/* High segment (rose/red) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#f43f5e"
                strokeWidth="12"
                strokeDasharray={`${highStroke} ${circumference}`}
                strokeDashoffset="0"
                fill="none"
                className="transition-all duration-500"
              />
              {/* Medium segment (amber) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#f59e0b"
                strokeWidth="12"
                strokeDasharray={`${medStroke} ${circumference}`}
                strokeDashoffset={`-${highStroke}`}
                fill="none"
                className="transition-all duration-500"
              />
              {/* Low segment (mint/green) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#408A71"
                strokeWidth="12"
                strokeDasharray={`${lowStroke} ${circumference}`}
                strokeDashoffset={`-${highStroke + medStroke}`}
                fill="none"
                className="transition-all duration-500"
              />
            </svg>

            {/* Donut Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-bold font-mono text-white leading-tight">
                {totalTasks}
              </span>
              <span className="text-[9.5px] uppercase tracking-wider text-neutral-400 font-semibold">
                Total Tasks
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 flex-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-neutral-300">High</span>
              </div>
              <span className="font-mono font-semibold text-white">{highPriorityCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-neutral-300">Medium</span>
              </div>
              <span className="font-mono font-semibold text-white">{mediumPriorityCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#408A71] shrink-0" />
                <span className="text-neutral-300">Low</span>
              </div>
              <span className="font-mono font-semibold text-white">{lowPriorityCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Tags Card */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 shadow-xl shadow-black/25 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Quick Tags
          </h3>
          {selectedTagFilter && (
            <button
              onClick={() => setSelectedTagFilter(null)}
              className="text-[11px] text-[#B0E4CC] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 6).map(tag => {
            const isSelected = selectedTagFilter === tag.name;
            return (
              <button
                key={tag.id}
                onClick={() => setSelectedTagFilter(isSelected ? null : tag.name)}
                className={`
                  px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150
                  ${
                    isSelected
                      ? 'bg-[#B0E4CC] text-[#091413] border-[#B0E4CC] font-semibold shadow-sm'
                      : 'bg-[#122822] text-neutral-300 border-[#285A48]/70 hover:border-[#408A71] hover:text-white'
                  }
                `}
              >
                {tag.name}
              </button>
            );
          })}

          {/* Plus button to create new tag */}
          <button
            onClick={() => setIsCreateTagModalOpen(true)}
            className="w-7 h-7 rounded-full bg-[#122822] border border-[#285A48]/80 text-[#B0E4CC] hover:border-[#408A71] hover:bg-[#285A48]/40 flex items-center justify-center transition-colors"
            aria-label="Create tag"
            title="Create tag"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. Theme Switcher Card */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 shadow-xl shadow-black/25 p-4 sm:p-5">
        <h3 className="text-sm font-bold text-white tracking-tight mb-2.5">
          Switch Theme
        </h3>

        <div className="grid grid-cols-2 gap-2 p-1 bg-[#122822] border border-[#285A48]/60 rounded-xl">
          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`
              flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all
              ${
                theme === 'dark'
                  ? 'bg-[#285A48] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }
            `}
          >
            <Moon className="w-3.5 h-3.5 text-[#B0E4CC]" />
            <span>Dark mode</span>
          </button>

          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`
              flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all
              ${
                theme === 'light'
                  ? 'bg-[#285A48] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }
            `}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Light mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
