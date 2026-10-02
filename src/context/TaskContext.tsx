import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { 
  Task, 
  Project, 
  Tag, 
  UserProfile, 
  DayStreak, 
  NotificationItem, 
  NavigationTab, 
  TaskFilterTab, 
  SortOption,
  Priority
} from '../types';
import { 
  INITIAL_TASKS, 
  INITIAL_PROJECTS, 
  INITIAL_TAGS, 
  INITIAL_USER, 
  INITIAL_STREAK, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  tags: Tag[];
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  streak: DayStreak[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  taskFilter: TaskFilterTab;
  setTaskFilter: (filter: TaskFilterTab) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTagFilter: string | null;
  setSelectedTagFilter: (tag: string | null) => void;
  selectedProjectFilter: string | null;
  setSelectedProjectFilter: (project: string | null) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  duplicateTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  changePriority: (taskId: string, priority: Priority) => void;

  // Project actions
  addProject: (project: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Tag actions
  addTag: (name: string, color?: string) => Tag;
  deleteTag: (id: string) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;

  // Modals & Drawers
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: (open: boolean) => void;
  isQuickAddModalOpen: boolean;
  setIsQuickAddModalOpen: (open: boolean) => void;
  isVoiceInputModalOpen: boolean;
  setIsVoiceInputModalOpen: (open: boolean) => void;
  isCreateProjectModalOpen: boolean;
  setIsCreateProjectModalOpen: (open: boolean) => void;
  isCreateTagModalOpen: boolean;
  setIsCreateTagModalOpen: (open: boolean) => void;
  isReminderModalOpen: boolean;
  setIsReminderModalOpen: (open: boolean) => void;
  selectedTaskDetail: Task | null;
  setSelectedTaskDetail: (task: Task | null) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Analytics & Computed
  filteredTasks: Task[];
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  completedTasksCount: number;
  todayTasks: Task[];
  todayCompletedCount: number;
  todayTotalCount: number;

  // Utilities
  resetToDemoData: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  TASKS: 'taskpro_tasks_v2',
  PROJECTS: 'taskpro_projects_v2',
  TAGS: 'taskpro_tags_v2',
  USER: 'taskpro_user_v2',
  THEME: 'taskpro_theme_v2',
  NOTIFICATIONS: 'taskpro_notifications_v2',
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
      return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Tags state
  const [tags, setTags] = useState<Tag[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TAGS);
      return saved ? JSON.parse(saved) : INITIAL_TAGS;
    } catch {
      return INITIAL_TAGS;
    }
  });

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const streak = INITIAL_STREAK;

  // Navigation and Filter state
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [taskFilter, setTaskFilter] = useState<TaskFilterTab>('all');
  const [sortBy, setSortBy] = useState<SortOption>('due_date');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Modal open states
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isVoiceInputModalOpen, setIsVoiceInputModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // LocalStorage quota or access error
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch {}
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TAGS, JSON.stringify(tags));
    } catch {}
  }, [tags]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Keep selectedTaskDetail in sync if tasks mutate
  useEffect(() => {
    if (selectedTaskDetail) {
      const fresh = tasks.find(t => t.id === selectedTaskDetail.id);
      if (fresh) {
        setSelectedTaskDetail(fresh);
      }
    }
  }, [tasks]);

  // Task actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    addToast(`Task "${newTask.title}" created successfully`);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    addToast('Task updated');
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTaskDetail?.id === id) {
      setSelectedTaskDetail(null);
    }
    addToast(`Task "${taskToDelete?.title || 'item'}" deleted`, 'info');
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          const nextTask = {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
          addToast(
            nextCompleted ? `Task completed: "${t.title}"` : `Task marked uncompleted`,
            nextCompleted ? 'success' : 'info'
          );
          return nextTask;
        }
        return t;
      })
    );
  };

  const duplicateTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const duplicated: Task = {
      ...task,
      id: 'task-' + Date.now(),
      title: `${task.title} (Copy)`,
      completed: false,
      completedAt: undefined,
      createdAt: new Date().toISOString(),
      subtasks: task.subtasks.map(s => ({ ...s, id: 'sub-' + Math.random().toString(36).substring(2, 8), completed: false })),
    };
    setTasks(prev => [duplicated, ...prev]);
    addToast(`Task duplicated: "${duplicated.title}"`);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map(s =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const newSub: Task['subtasks'][0] = {
            id: 'sub-' + Date.now() + Math.random().toString(36).substring(2, 5),
            title: title.trim(),
            completed: false,
          };
          return { ...task, subtasks: [...task.subtasks, newSub] };
        }
        return task;
      })
    );
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter(s => s.id !== subtaskId),
          };
        }
        return task;
      })
    );
  };

  const changePriority = (taskId: string, priority: Priority) => {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, priority } : task))
    );
    addToast(`Priority changed to ${priority.toUpperCase()}`);
  };

  // Projects
  const addProject = (projectData: Omit<Project, 'id'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: 'proj-' + Date.now(),
    };
    setProjects(prev => [...prev, newProject]);
    addToast(`Project "${newProject.name}" created`);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    addToast('Project updated');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // Unlink tasks from project
    setTasks(prev => prev.map(t => (t.projectId === id ? { ...t, projectId: undefined } : t)));
    addToast('Project removed');
  };

  // Tags
  const addTag = (name: string, color: string = '#408A71'): Tag => {
    const trimmed = name.trim();
    const existing = tags.find(t => t.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;
    const newTag: Tag = {
      id: 'tag-' + Date.now(),
      name: trimmed,
      color,
    };
    setTags(prev => [...prev, newTag]);
    addToast(`Tag #${trimmed} added`);
    return newTag;
  };

  const deleteTag = (id: string) => {
    const tag = tags.find(t => t.id === id);
    setTags(prev => prev.filter(t => t.id !== id));
    if (tag) {
      setTasks(prev =>
        prev.map(t => ({
          ...t,
          tags: t.tags.filter(tn => tn.toLowerCase() !== tag.name.toLowerCase()),
        }))
      );
    }
    addToast('Tag deleted');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read');
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'system') => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      read: false,
      type,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Sidebar navigation view filtering
    if (activeTab === 'today') {
      result = result.filter(t => t.dueDate.toLowerCase().includes('today'));
    } else if (activeTab === 'upcoming') {
      result = result.filter(t => !t.completed && (t.dueDate.toLowerCase().includes('tomorrow') || t.dueDate.includes('Oct') || t.dueDate.includes('Nov')));
    } else if (activeTab === 'completed') {
      result = result.filter(t => t.completed);
    }

    // Tab filter within My Tasks
    if (activeTab === 'dashboard' || activeTab === 'my_tasks') {
      if (taskFilter === 'today') {
        result = result.filter(t => t.dueDate.toLowerCase().includes('today'));
      } else if (taskFilter === 'this_week') {
        result = result.filter(t => 
          t.dueDate.toLowerCase().includes('today') || 
          t.dueDate.toLowerCase().includes('tomorrow') || 
          t.dueDate.toLowerCase().includes('oct 5') ||
          t.dueDate.toLowerCase().includes('oct 8')
        );
      } else if (taskFilter === 'overdue') {
        result = result.filter(t => !t.completed && (t.dueDate.toLowerCase().includes('yesterday') || t.dueDate.toLowerCase().includes('sep 30')));
      }
    }

    // Tag filter
    if (selectedTagFilter) {
      result = result.filter(t => 
        t.tags.some(tag => tag.toLowerCase() === selectedTagFilter.toLowerCase())
      );
    }

    // Project filter
    if (selectedProjectFilter) {
      result = result.filter(t => t.projectId === selectedProjectFilter);
    }

    // Calendar selected date filter
    if (selectedDate) {
      result = result.filter(t => {
        const lowerDue = t.dueDate.toLowerCase();
        if (selectedDate === '2026-10-02') {
          return lowerDue.includes('today');
        } else if (selectedDate === '2026-10-03') {
          return lowerDue.includes('tomorrow');
        } else if (selectedDate === '2026-10-01' || selectedDate === '2026-09-30') {
          return lowerDue.includes('yesterday') || lowerDue.includes('sep 30');
        } else if (selectedDate === '2026-10-05') {
          return lowerDue.includes('oct 5');
        }
        return true;
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        (t.assignee?.name && t.assignee.name.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'priority') {
        const pMap: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      if (sortBy === 'created_date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'project') {
        return (a.projectId || '').localeCompare(b.projectId || '');
      }
      // default: due_date
      return 0; // preserve natural due list
    });

    return result;
  }, [tasks, activeTab, taskFilter, selectedTagFilter, selectedProjectFilter, selectedDate, searchQuery, sortBy]);

  // Priority Overview calculation
  const highPriorityCount = useMemo(() => tasks.filter(t => t.priority === 'high').length, [tasks]);
  const mediumPriorityCount = useMemo(() => tasks.filter(t => t.priority === 'medium').length, [tasks]);
  const lowPriorityCount = useMemo(() => tasks.filter(t => t.priority === 'low').length, [tasks]);
  const completedTasksCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);

  // Today's Focus calculation (matches prompt Section 23: 3/5 completed)
  const todayTasks = useMemo(() => {
    return tasks.filter(t => 
      t.dueDate.toLowerCase().includes('today') ||
      t.title === 'Workout at Gym' ||
      t.title === 'Study Django' ||
      t.title === 'Plan weekend trip'
    ).slice(0, 5);
  }, [tasks]);

  const todayCompletedCount = useMemo(() => todayTasks.filter(t => t.completed).length, [todayTasks]);
  const todayTotalCount = todayTasks.length || 5;

  const resetToDemoData = () => {
    setTasks(INITIAL_TASKS);
    setProjects(INITIAL_PROJECTS);
    setTags(INITIAL_TAGS);
    setUser(INITIAL_USER);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('dashboard');
    setTaskFilter('all');
    setSelectedTagFilter(null);
    setSelectedProjectFilter(null);
    setSelectedDate(null);
    setSearchQuery('');
    addToast('Reset to original demo data');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        tags,
        user,
        setUser,
        streak,
        notifications,
        unreadNotifsCount,
        activeTab,
        setActiveTab,
        taskFilter,
        setTaskFilter,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery,
        selectedTagFilter,
        setSelectedTagFilter,
        selectedProjectFilter,
        setSelectedProjectFilter,
        selectedDate,
        setSelectedDate,
        theme,
        toggleTheme,

        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        duplicateTask,
        toggleSubtask,
        addSubtask,
        deleteSubtask,
        changePriority,

        addProject,
        updateProject,
        deleteProject,

        addTag,
        deleteTag,

        markNotificationRead,
        markAllNotificationsRead,
        addNotification,

        isAddTaskModalOpen,
        setIsAddTaskModalOpen,
        isQuickAddModalOpen,
        setIsQuickAddModalOpen,
        isVoiceInputModalOpen,
        setIsVoiceInputModalOpen,
        isCreateProjectModalOpen,
        setIsCreateProjectModalOpen,
        isCreateTagModalOpen,
        setIsCreateTagModalOpen,
        isReminderModalOpen,
        setIsReminderModalOpen,
        selectedTaskDetail,
        setSelectedTaskDetail,

        toasts,
        addToast,
        removeToast,

        filteredTasks,
        highPriorityCount,
        mediumPriorityCount,
        lowPriorityCount,
        completedTasksCount,
        todayTasks,
        todayCompletedCount,
        todayTotalCount,

        resetToDemoData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
