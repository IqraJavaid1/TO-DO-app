import React from 'react';
import { 
  FolderKanban, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Trash2,
  Edit2
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    tasks, 
    setIsCreateProjectModalOpen, 
    setSelectedProjectFilter, 
    setActiveTab,
    deleteProject 
  } = useTaskContext();

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectFilter(projectId);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#285A48]/35">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-[#B0E4CC]" />
            <span>Projects</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Organize workflows, track milestones, and collaborate across teams.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white transition-all text-xs sm:text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => {
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const total = projectTasks.length;
          const completed = projectTasks.filter(t => t.completed).length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div
              key={project.id}
              className="rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 hover:border-[#408A71] p-5 shadow-xl shadow-black/20 flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                {/* Top Badge & Color Accent */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full ring-2 ring-white/10" 
                      style={{ backgroundColor: project.color || '#408A71' }} 
                    />
                    <span className="text-xs font-semibold text-[#408A71] uppercase tracking-wider">
                      {total} {total === 1 ? 'Task' : 'Tasks'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete project "${project.name}"?`)) {
                        deleteProject(project.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-neutral-500 hover:text-rose-400 transition-opacity"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#B0E4CC] transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="text-neutral-400">Progress</span>
                    <span className="text-[#B0E4CC] font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#122822] rounded-full overflow-hidden border border-[#285A48]/60">
                    <div
                      className="h-full bg-gradient-to-r from-[#408A71] to-[#B0E4CC] transition-all duration-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer: Members & Due Date */}
              <div className="mt-5 pt-3.5 border-t border-[#285A48]/30 flex items-center justify-between">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {project.members?.map((m, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full bg-[#122822] border border-[#285A48] text-[#B0E4CC] text-[10px] font-bold flex items-center justify-center shadow-sm"
                      title={m.name}
                    >
                      {m.avatar}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectProject(project.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#B0E4CC] hover:text-white transition-colors"
                >
                  <span>View Tasks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
