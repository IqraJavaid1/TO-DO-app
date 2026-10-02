import React, { useState } from 'react';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const CalendarView: React.FC = () => {
  const { 
    tasks, 
    setIsAddTaskModalOpen, 
    setSelectedTaskDetail 
  } = useTaskContext();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 2));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  // Group tasks by rough day match
  const getTasksForDay = (day: number) => {
    return tasks.filter(t => {
      const lower = t.dueDate.toLowerCase();
      if (day === 2 && lower.includes('today')) return true;
      if (day === 3 && lower.includes('tomorrow')) return true;
      if (day === 1 && lower.includes('yesterday')) return true;
      if (lower.includes(`oct ${day}`) || lower.includes(`oct 0${day}`)) return true;
      return false;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#285A48]/35">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-[#B0E4CC]" />
            <span>Calendar Schedule</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Timeline overview of upcoming deliverables and milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-[#122822] border border-[#285A48] rounded-xl px-2 py-1">
            <button onClick={prevMonth} className="p-1 rounded text-neutral-400 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-white px-2">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button onClick={nextMonth} className="p-1 rounded text-neutral-400 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Weekday columns */}
      <div className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 overflow-hidden shadow-xl shadow-black/25">
        <div className="grid grid-cols-7 border-b border-[#285A48]/40 bg-[#122822]/80 text-center py-2.5 text-xs font-bold text-[#408A71] uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 auto-rows-[110px] divide-x divide-y divide-[#285A48]/30">
          {blanks.map(b => (
            <div key={`blank-${b}`} className="bg-[#091413]/40 p-2" />
          ))}

          {days.map(d => {
            const dayTasks = getTasksForDay(d);
            const isToday = d === 2 && currentMonth === 9 && currentYear === 2026;

            return (
              <div 
                key={d} 
                className={`p-2 transition-colors overflow-hidden flex flex-col justify-between ${
                  isToday ? 'bg-[#122822]/50 ring-1 ring-inset ring-[#408A71]/60' : 'hover:bg-[#122822]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${
                    isToday ? 'px-1.5 py-0.5 rounded-full bg-[#B0E4CC] text-[#091413]' : 'text-neutral-400'
                  }`}>
                    {d}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-mono text-[#408A71]">
                      {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-16 pr-0.5 mt-1">
                  {dayTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTaskDetail(t)}
                      className={`
                        px-1.5 py-1 rounded text-[10px] font-medium truncate cursor-pointer transition-colors border
                        ${
                          t.completed
                            ? 'bg-[#122822] border-[#285A48]/30 text-neutral-400 line-through'
                            : 'bg-[#285A48]/70 border-[#408A71]/50 text-white hover:bg-[#408A71]'
                        }
                      `}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
