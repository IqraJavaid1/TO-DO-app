import React, { useState } from 'react';
import { X, Tag as TagIcon, ArrowRight } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const CreateTagModal: React.FC = () => {
  const { 
    isCreateTagModalOpen, 
    setIsCreateTagModalOpen, 
    addTag 
  } = useTaskContext();

  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#408A71');

  if (!isCreateTagModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    addTag(tagName.trim(), tagColor);
    setTagName('');
    setIsCreateTagModalOpen(false);
  };

  const colors = ['#408A71', '#285A48', '#B0E4CC', '#5DB895', '#3A9E7A', '#38bdf8', '#fbbf24', '#f472b6'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm bg-[#0c1c1b] border border-[#285A48] rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#285A48]/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#285A48] text-[#B0E4CC] flex items-center justify-center">
              <TagIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Create New Tag</h3>
          </div>
          <button
            onClick={() => setIsCreateTagModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Tag Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Marketing, HighPriority"
              value={tagName}
              onChange={e => setTagName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white placeholder-neutral-500 outline-none focus:border-[#408A71]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Color Accent
            </label>
            <div className="flex items-center gap-2 pt-1">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setTagColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${tagColor === c ? 'scale-125 border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#285A48]/40">
            <button
              type="button"
              onClick={() => setIsCreateTagModalOpen(false)}
              className="px-4 py-2 rounded-xl text-neutral-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white transition-all"
            >
              <span>Add Tag</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
