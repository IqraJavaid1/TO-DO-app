import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Trash2, 
  Plus, 
  Calendar, 
  Tag as TagIcon, 
  FolderKanban, 
  Clock, 
  Share2, 
  Copy, 
  ListChecks,
  AlertCircle
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { Priority } from '../../types';

export const TaskDetailModal: React.FC = () => {
  const { 
    selectedTaskDetail, 
    setSelectedTaskDetail, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion, 
    toggleSubtask, 
    addSubtask, 
    deleteSubtask,
    projects,
    tags,
    addToast
  } = useTaskContext();

  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([
    'Sarah M.: "Uploaded latest design system tokens to Figma."',
  ]);

  if (!selectedTaskDetail) return null;

  const task = selectedTaskDetail;
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleAddSub = () => {
    if (!newSubtaskText.trim()) return;
    addSubtask(task.id, newSubtaskText.trim());
    setNewSubtaskText('');
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [...prev, `You: "${commentText.trim()}"`]);
    setCommentText('');
    addToast('Comment added');
  };

  const project = projects.find(p => p.id === task.projectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl max-h-[90vh] bg-[#0c1c1b] border border-[#285A48] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#285A48]/40 bg-[#091413]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleTaskCompletion(task.id)}
              className={`
                w-6 h-6 rounded-lg border flex items-center justify-center transition-colors
                ${
                  task.completed
                    ? 'bg-[#408A71] border-[#B0E4CC] text-[#091413]'
                    : 'bg-transparent border-[#408A71] hover:border-[#B0E4CC]'
                }
              `}
              aria-label={task.completed ? 'Mark uncompleted' : 'Mark completed'}
            >
              {task.completed && <Check className="w-4 h-4 stroke-[3] text-white" />}
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#408A71]">
              Task Details
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                deleteTask(task.id);
                setSelectedTaskDetail(null);
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedTaskDetail(null)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#285A48]/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
          {/* Title input */}
          <div>
            <input
              type="text"
              value={task.title}
              onChange={e => updateTask(task.id, { title: e.target.value })}
              className={`
                w-full bg-transparent text-lg sm:text-xl font-bold tracking-tight text-white border-b border-transparent focus:border-[#408A71] outline-none pb-1
                ${task.completed ? 'line-through text-neutral-400' : ''}
              `}
            />
          </div>

          {/* Description input */}
          <div>
            <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={task.description}
              onChange={e => updateTask(task.id, { description: e.target.value })}
              placeholder="Add comprehensive notes or specifications..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white placeholder-neutral-500 outline-none focus:border-[#408A71]"
            />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Priority */}
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={e => updateTask(task.id, { priority: e.target.value as Priority })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#122822] border border-[#285A48]/70 text-neutral-200 outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Project
              </label>
              <select
                value={task.projectId || ''}
                onChange={e => updateTask(task.id, { projectId: e.target.value || undefined })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#122822] border border-[#285A48]/70 text-neutral-200 outline-none"
              >
                <option value="">(None)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Deadline
              </label>
              <input
                type="text"
                value={task.dueDate}
                onChange={e => updateTask(task.id, { dueDate: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#122822] border border-[#285A48]/70 text-neutral-200 outline-none font-mono"
              />
            </div>
          </div>

          {/* Section 19: Subtasks & Progress */}
          <div className="pt-3 border-t border-[#285A48]/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#408A71]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Subtasks Checklist
                </h4>
              </div>
              <span className="text-xs font-mono text-[#B0E4CC] font-semibold">
                {completedSubtasks}/{totalSubtasks} completed
              </span>
            </div>

            {/* Progress bar */}
            {totalSubtasks > 0 && (
              <div className="w-full h-2 bg-[#122822] rounded-full overflow-hidden border border-[#285A48]/60 mb-3">
                <div
                  className="h-full bg-gradient-to-r from-[#408A71] to-[#B0E4CC] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            {/* Subtask items list */}
            <div className="space-y-2 mb-3">
              {task.subtasks.map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#122822] border border-[#285A48]/50 hover:border-[#408A71]/70 transition-colors"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0 pr-2">
                    <input
                      type="checkbox"
                      checked={s.completed}
                      onChange={() => toggleSubtask(task.id, s.id)}
                      className="w-4 h-4 rounded border-[#408A71] text-[#408A71] focus:ring-0 accent-[#408A71]"
                    />
                    <span className={`text-xs text-neutral-200 truncate ${s.completed ? 'line-through text-neutral-400' : ''}`}>
                      {s.title}
                    </span>
                  </label>
                  <button
                    onClick={() => deleteSubtask(task.id, s.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask field */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask step (e.g. Design mobile layout)..."
                value={newSubtaskText}
                onChange={e => setNewSubtaskText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSub();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white placeholder-neutral-500 outline-none text-xs"
              />
              <button
                type="button"
                onClick={handleAddSub}
                className="px-4 py-2 rounded-xl bg-[#285A48] hover:bg-[#408A71] text-[#B0E4CC] font-semibold text-xs transition-colors"
              >
                + Add Subtask
              </button>
            </div>
          </div>

          {/* Activity / Comments Stream */}
          <div className="pt-3 border-t border-[#285A48]/40">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Activity & Comments
            </h4>
            <div className="space-y-1.5 mb-2.5">
              {comments.map((c, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-[#122822]/60 border border-[#285A48]/30 text-xs text-neutral-300">
                  {c}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white text-xs outline-none"
              />
              <button
                onClick={handleAddComment}
                className="px-3 py-1.5 rounded-xl bg-[#285A48] text-white hover:bg-[#408A71] text-xs font-medium"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#285A48]/40 bg-[#091413]">
          <span className="text-[11px] text-neutral-400 font-mono">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
          <button
            onClick={() => setSelectedTaskDetail(null)}
            className="px-5 py-2 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white transition-all text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
