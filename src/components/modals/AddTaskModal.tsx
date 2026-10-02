import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Calendar, 
  Clock, 
  Repeat, 
  Bell, 
  Tag as TagIcon, 
  FolderKanban, 
  MapPin, 
  Check, 
  Trash2,
  UserCheck
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { Priority, RecurrenceType, Subtask } from '../../types';

export const AddTaskModal: React.FC = () => {
  const { 
    isAddTaskModalOpen, 
    setIsAddTaskModalOpen, 
    addTask, 
    projects, 
    tags, 
    user 
  } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Work']);
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('Today, 5:00 PM');
  const [repeat, setRepeat] = useState<RecurrenceType>('none');
  const [reminder, setReminder] = useState('15 minutes before');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationTrigger, setLocationTrigger] = useState<'arriving' | 'leaving'>('arriving');

  // Subtasks state
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!isAddTaskModalOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks(prev => [
      ...prev,
      {
        id: 'sub-' + Date.now() + Math.random().toString(36).substring(2, 5),
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
      dueDate,
      tags: selectedTags,
      projectId: projectId || undefined,
      repeat,
      reminder,
      locationReminder: locationEnabled ? {
        enabled: true,
        location: locationName || 'Office',
        trigger: locationTrigger,
      } : undefined,
      subtasks,
      assignee: {
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      },
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setSubtasks([]);
    setIsAddTaskModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[90vh] bg-[#0c1c1b] border border-[#285A48] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#285A48]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#285A48] text-[#B0E4CC] flex items-center justify-center">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">Create New Task</h2>
          </div>
          <button
            onClick={() => setIsAddTaskModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#285A48]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {/* Task Name */}
          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Task Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Design UI for TaskPro Website"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white placeholder-neutral-500 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Add key deliverables, context, or requirements..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white placeholder-neutral-500 outline-none focus:border-[#408A71] focus:ring-1 focus:ring-[#408A71]"
            />
          </div>

          {/* Project & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Project */}
            <div>
              <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <FolderKanban className="w-3.5 h-3.5" /> Project
              </label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#122822] border border-[#285A48]/70 text-neutral-200 outline-none focus:border-[#408A71]"
              >
                <option value="">(No Project Assigned)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['high', 'medium', 'low'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`
                      py-2 rounded-xl font-semibold capitalize text-center border transition-colors
                      ${
                        priority === p
                          ? p === 'high'
                            ? 'bg-rose-950 text-rose-300 border-rose-600'
                            : p === 'medium'
                            ? 'bg-amber-950 text-amber-300 border-amber-600'
                            : 'bg-[#285A48] text-[#B0E4CC] border-[#408A71]'
                          : 'bg-[#122822] text-neutral-400 border-[#285A48]/60 hover:text-white'
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date & Reminder Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Due Date */}
            <div>
              <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Deadline
              </label>
              <input
                type="text"
                placeholder="e.g. Today, 5:00 PM or Tomorrow, 9:00 AM"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#122822] border border-[#285A48]/70 text-neutral-200 outline-none focus:border-[#408A71]"
              />
            </div>

            {/* Reminder */}
            <div>
              <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" /> Reminder
              </label>
              <select
                value={reminder}
                onChange={e => setReminder(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#122822] border border-[#285A48]/70 text-neutral-200 outline-none focus:border-[#408A71]"
              >
                <option value="None">None</option>
                <option value="At due time">At due time</option>
                <option value="5 minutes before">5 minutes before</option>
                <option value="15 minutes before">15 minutes before</option>
                <option value="30 minutes before">30 minutes before</option>
                <option value="1 hour before">1 hour before</option>
              </select>
            </div>
          </div>

          {/* Recurrence Repeat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5" /> Repeat Schedule
              </label>
              <select
                value={repeat}
                onChange={e => setRepeat(e.target.value as RecurrenceType)}
                className="w-full px-3 py-2 rounded-xl bg-[#122822] border border-[#285A48]/70 text-neutral-200 outline-none focus:border-[#408A71]"
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Every Weekday (Mon-Fri)</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom interval</option>
              </select>
            </div>

            {/* Location Reminder Toggle */}
            <div>
              <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Location Reminder
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setLocationEnabled(!locationEnabled)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    locationEnabled ? 'bg-[#285A48] text-[#B0E4CC] border-[#408A71]' : 'bg-[#122822] text-neutral-400 border-[#285A48]/60'
                  }`}
                >
                  {locationEnabled ? 'Enabled' : 'Disabled'}
                </button>
                {locationEnabled && (
                  <input
                    type="text"
                    placeholder="e.g. Supermarket, Gym"
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#122822] border border-[#285A48]/70 text-neutral-200 text-xs"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Tags Selection */}
          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <TagIcon className="w-3.5 h-3.5" /> Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => {
                const isSelected = selectedTags.includes(t.name);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTag(t.name)}
                    className={`
                      px-2.5 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1
                      ${
                        isSelected
                          ? 'bg-[#B0E4CC] text-[#091413] border-[#B0E4CC] font-semibold'
                          : 'bg-[#122822] text-neutral-300 border-[#285A48]/70 hover:border-[#408A71]'
                      }
                    `}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks checklist items */}
          <div className="pt-2 border-t border-[#285A48]/30">
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-2">
              Subtasks Checklist ({subtasks.length})
            </label>
            
            {subtasks.length > 0 && (
              <div className="space-y-1.5 mb-2.5">
                {subtasks.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-[#122822] border border-[#285A48]/40">
                    <span className="text-neutral-200">{s.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(s.id)}
                      className="text-neutral-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask item..."
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#122822] border border-[#285A48]/70 text-white placeholder-neutral-500 outline-none text-xs"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-lg bg-[#285A48] text-[#B0E4CC] hover:bg-[#408A71] text-xs font-semibold"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Assignee indicator */}
          <div className="flex items-center gap-2 pt-2 text-xs text-neutral-400">
            <UserCheck className="w-4 h-4 text-[#408A71]" />
            <span>Assigned to: <strong className="text-white">{user.name}</strong> ({user.email})</span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#285A48]/40">
            <button
              type="button"
              onClick={() => setIsAddTaskModalOpen(false)}
              className="px-4 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#285A48]/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white hover:shadow-lg transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
