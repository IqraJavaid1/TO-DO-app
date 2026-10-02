import React, { useState, useMemo } from 'react';
import { X, Zap, Calendar, Tag, AlertCircle, Check, ArrowRight } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { Priority } from '../../types';

export const QuickAddModal: React.FC = () => {
  const { 
    isQuickAddModalOpen, 
    setIsQuickAddModalOpen, 
    addTask, 
    user 
  } = useTaskContext();

  const [input, setInput] = useState('Finish report tomorrow 5pm #work high');

  // Syntax parser
  const parsed = useMemo(() => {
    const raw = input.trim();
    if (!raw) {
      return {
        title: '',
        date: 'Today, 5:00 PM',
        tag: 'General',
        priority: 'medium' as Priority,
      };
    }

    let text = raw;
    let priority: Priority = 'medium';
    let tag = 'Work';
    let date = 'Today, 5:00 PM';

    // Parse priority
    if (/\b(high|urgent|p1)\b/i.test(text)) {
      priority = 'high';
      text = text.replace(/\b(high|urgent|p1)\b/gi, '').trim();
    } else if (/\b(medium|med|p2)\b/i.test(text)) {
      priority = 'medium';
      text = text.replace(/\b(medium|med|p2)\b/gi, '').trim();
    } else if (/\b(low|p3)\b/i.test(text)) {
      priority = 'low';
      text = text.replace(/\b(low|p3)\b/gi, '').trim();
    }

    // Parse hashtag
    const tagMatch = text.match(/#(\w+)/);
    if (tagMatch) {
      tag = tagMatch[1].charAt(0).toUpperCase() + tagMatch[1].slice(1);
      text = text.replace(/#\w+/, '').trim();
    }

    // Parse time / date expressions
    if (/\btomorrow\b/i.test(text)) {
      date = 'Tomorrow, 5:00 PM';
      text = text.replace(/\btomorrow\b/gi, '').trim();
    } else if (/\btoday\b/i.test(text)) {
      date = 'Today, 5:00 PM';
      text = text.replace(/\btoday\b/gi, '').trim();
    } else if (/\byesterday\b/i.test(text)) {
      date = 'Yesterday, 9:00 PM';
      text = text.replace(/\byesterday\b/gi, '').trim();
    }

    // Parse specific time like 5pm, 2:00 PM, 9am
    const timeMatch = text.match(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i);
    if (timeMatch) {
      const timeStr = timeMatch[1].toUpperCase();
      date = date.replace(/5:00 PM|9:00 PM|7:00 AM/, timeStr);
      text = text.replace(timeMatch[0], '').trim();
    }

    // Clean up multiple spaces
    const cleanTitle = text.replace(/\s+/g, ' ').trim() || 'New Fast Task';

    return {
      title: cleanTitle,
      date,
      tag,
      priority,
    };
  }, [input]);

  if (!isQuickAddModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed.title.trim()) return;

    addTask({
      title: parsed.title,
      description: 'Quick added via shorthand syntax prompt.',
      completed: false,
      priority: parsed.priority,
      dueDate: parsed.date,
      tags: [parsed.tag],
      subtasks: [],
      assignee: {
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      },
    });

    setInput('');
    setIsQuickAddModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#0c1c1b] border border-[#285A48] rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#285A48]/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#285A48] text-[#B0E4CC] flex items-center justify-center">
              <Zap className="w-4 h-4 fill-[#B0E4CC]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Quick Add</h3>
              <p className="text-xs text-neutral-400">Natural language syntax task entry</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickAddModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#285A48]/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Type Task with Shorthand
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Finish report tomorrow 5pm #work high"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#122822] border border-[#285A48]/80 text-white placeholder-neutral-500 outline-none text-sm focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]"
            />
            <p className="text-[11px] text-neutral-400 mt-1.5">
              Tip: Include date words like <strong className="text-neutral-300">tomorrow 5pm</strong>, tag like <strong className="text-neutral-300">#work</strong>, and priority like <strong className="text-neutral-300">high</strong>.
            </p>
          </div>

          {/* Real-time Parsed Preview Card */}
          <div className="p-4 rounded-xl bg-[#122822]/80 border border-[#408A71]/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B0E4CC] block mb-2">
              Parsed Task Preview
            </span>
            <div className="text-sm font-semibold text-white mb-2">
              {parsed.title}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#091413] border border-[#285A48] text-neutral-200">
                <Calendar className="w-3 h-3 text-[#408A71]" />
                {parsed.date}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#091413] border border-[#285A48] text-[#B0E4CC]">
                <Tag className="w-3 h-3 text-[#408A71]" />
                #{parsed.tag}
              </span>
              <span
                className={`
                  px-2.5 py-0.5 rounded-full font-semibold capitalize border
                  ${
                    parsed.priority === 'high'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                      : parsed.priority === 'medium'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                      : 'bg-[#285A48] text-[#B0E4CC] border-[#408A71]'
                  }
                `}
              >
                {parsed.priority} Priority
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsQuickAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#285A48]/30 text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white transition-all text-xs sm:text-sm"
            >
              <span>Add Fast Task</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
