import React from 'react';
import { Flame, Check } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const ProductivityStreak: React.FC = () => {
  const { streak } = useTaskContext();

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#122822]/90 via-[#0e211c]/80 to-[#091413]/90 border border-[#285A48]/60 p-4 sm:p-5 shadow-xl shadow-black/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left: Fire Icon & Text */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
          <Flame className="w-6 h-6 fill-amber-400/30 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>Productivity Streak</span>
          </h4>
          <p className="text-xs text-neutral-300 mt-0.5">
            You&apos;ve completed tasks for <strong className="text-[#B0E4CC] font-semibold">5 days in a row!</strong> 🔥
          </p>
        </div>
      </div>

      {/* Right: Days Mon - Fri Circular Completion Indicators */}
      <div className="flex items-center gap-2.5 sm:gap-3 self-center sm:self-auto">
        {streak.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 shadow-sm
                ${
                  item.completed
                    ? 'bg-[#285A48] border-[#408A71] text-[#B0E4CC] shadow-[#408A71]/20'
                    : 'bg-[#122822] border-[#285A48]/50 text-neutral-500'
                }
              `}
              title={`${item.day}: ${item.completed ? 'Completed' : 'Pending'}`}
            >
              {item.completed ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-neutral-600" />
              )}
            </div>
            <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-wider">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
