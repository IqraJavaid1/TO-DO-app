import React from 'react';
import { Tags, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const TagsView: React.FC = () => {
  const { 
    tags, 
    tasks, 
    deleteTag, 
    setIsCreateTagModalOpen, 
    setSelectedTagFilter, 
    setActiveTab 
  } = useTaskContext();

  const handleTagClick = (tagName: string) => {
    setSelectedTagFilter(tagName);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#285A48]/35">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Tags className="w-6 h-6 text-[#B0E4CC]" />
            <span>Tag System</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Categorize and filter tasks with flexible contextual tags.
          </p>
        </div>

        <button
          onClick={() => setIsCreateTagModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white transition-all text-xs sm:text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Tag</span>
        </button>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {tags.map(tag => {
          const associatedCount = tasks.filter(t => 
            t.tags.some(tn => tn.toLowerCase() === tag.name.toLowerCase())
          ).length;

          return (
            <div
              key={tag.id}
              className="p-4 rounded-xl bg-[#091413]/70 border border-[#285A48]/50 hover:border-[#408A71] flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span 
                  className="w-3.5 h-3.5 rounded-full" 
                  style={{ backgroundColor: tag.color || '#408A71' }} 
                />
                <div>
                  <h4 className="text-sm font-semibold text-white">#{tag.name}</h4>
                  <span className="text-xs text-neutral-400 font-mono">
                    {associatedCount} {associatedCount === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTagClick(tag.name)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#122822] text-[#B0E4CC] hover:bg-[#285A48] transition-colors"
                >
                  Filter
                </button>
                <button
                  onClick={() => deleteTag(tag.id)}
                  className="p-1 rounded text-neutral-500 hover:text-rose-400 transition-colors"
                  title="Delete tag"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
