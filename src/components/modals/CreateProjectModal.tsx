import React, { useState } from 'react';
import { X, FolderPlus, ArrowRight } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const CreateProjectModal: React.FC = () => {
  const { 
    isCreateProjectModalOpen, 
    setIsCreateProjectModalOpen, 
    addProject, 
    user 
  } = useTaskContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#408A71');
  const [dueDate, setDueDate] = useState('Nov 30, 2026');

  if (!isCreateProjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name: name.trim(),
      description: description.trim(),
      color,
      icon: 'folder',
      dueDate,
      members: [
        { name: user.name, avatar: user.avatar, role: 'Owner' },
      ],
    });

    setName('');
    setDescription('');
    setIsCreateProjectModalOpen(false);
  };

  const colorOptions = ['#408A71', '#285A48', '#B0E4CC', '#5DB895', '#3A9E7A', '#3b82f6', '#f59e0b', '#ec4899'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#0c1c1b] border border-[#285A48] rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#285A48]/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#285A48] text-[#B0E4CC] flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Create New Project</h3>
          </div>
          <button
            onClick={() => setIsCreateProjectModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mobile App Redesign"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white placeholder-neutral-500 outline-none focus:border-[#408A71]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Project goals, milestones and context..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white placeholder-neutral-500 outline-none focus:border-[#408A71]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Color Theme
            </label>
            <div className="flex items-center gap-2 pt-1">
              {colorOptions.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? 'scale-125 border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Target Deadline
            </label>
            <input
              type="text"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#285A48]/40">
            <button
              type="button"
              onClick={() => setIsCreateProjectModalOpen(false)}
              className="px-4 py-2 rounded-xl text-neutral-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white transition-all"
            >
              <span>Create Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
