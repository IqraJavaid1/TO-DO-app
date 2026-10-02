export type Priority = 'high' | 'medium' | 'low';

export type RecurrenceType = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly' | 'custom';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  priority: Priority;
  dueDate: string; // formatted date or ISO string
  dueTime?: string; // e.g. '2:00 PM'
  tags: string[];
  projectId?: string;
  subtasks: Subtask[];
  repeat?: RecurrenceType;
  reminder?: string; // e.g., 'At due time', '15 minutes before'
  locationReminder?: {
    enabled: boolean;
    location: string;
    trigger: 'arriving' | 'leaving';
  };
  assignee?: {
    name: string;
    avatar: string;
    email: string;
  };
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  dueDate?: string;
  members: {
    name: string;
    avatar: string;
    role: string;
  }[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  title: string;
  timezone: string;
}

export interface DayStreak {
  day: string; // Mon, Tue, etc.
  date: string;
  completed: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'task' | 'reminder' | 'streak' | 'system';
}

export type NavigationTab = 
  | 'dashboard'
  | 'my_tasks'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'projects'
  | 'tags'
  | 'calendar'
  | 'collaboration'
  | 'integrations'
  | 'settings';

export type TaskFilterTab = 'all' | 'today' | 'this_week' | 'overdue';

export type SortOption = 
  | 'due_date'
  | 'priority'
  | 'created_date'
  | 'alphabetical'
  | 'project';
