import React, { useState } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { QuickActionBar } from './components/dashboard/QuickActionBar';
import { MyTasksSection } from './components/dashboard/MyTasksSection';
import { BottomActionCards } from './components/dashboard/BottomActionCards';
import { ProductivityStreak } from './components/dashboard/ProductivityStreak';
import { RightPanel } from './components/dashboard/RightPanel';
import { AddTaskModal } from './components/modals/AddTaskModal';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { VoiceInputModal } from './components/modals/VoiceInputModal';
import { TaskDetailModal } from './components/modals/TaskDetailModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { CreateTagModal } from './components/modals/CreateTagModal';
import { ReminderModal } from './components/modals/ReminderModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { ProjectsView } from './components/views/ProjectsView';
import { TagsView } from './components/views/TagsView';
import { CalendarView } from './components/views/CalendarView';
import { CollaborationView } from './components/views/CollaborationView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { SettingsView } from './components/views/SettingsView';

const MainWorkspace: React.FC = () => {
  const { activeTab, theme } = useTaskContext();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#f4f8f6] text-[#0e261f]' : 'bg-[#091413] text-neutral-100'} flex`}>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* 1. Left Sidebar (Fixed 275px on desktop) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 md:pl-[275px] flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Content Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <HeroBanner />

              {/* Quick Action Bar (5 CTA buttons) */}
              <QuickActionBar />

              {/* Main Central Content + Right Productivity Panel */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Central Workspace: Tasks, Bottom Cards, Streak (approx 8 cols) */}
                <div className="xl:col-span-8 space-y-6">
                  {/* My Tasks Section */}
                  <MyTasksSection />

                  {/* 3 Bottom Action Cards */}
                  <BottomActionCards />

                  {/* Productivity Streak Card */}
                  <ProductivityStreak />
                </div>

                {/* Right Productivity Panel (approx 4 cols) */}
                <div className="xl:col-span-4">
                  <RightPanel />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my_tasks' && (
            <div className="space-y-6">
              <QuickActionBar />
              <MyTasksSection />
            </div>
          )}

          {activeTab === 'today' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Today&apos;s Focused Agenda</h2>
                  <p className="text-xs text-neutral-400 mt-1">High-impact tasks scheduled for today</p>
                </div>
              </div>
              <MyTasksSection />
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Upcoming Deadlines & Schedule</h2>
                  <p className="text-xs text-neutral-400 mt-1">Review future deliverables and milestones</p>
                </div>
              </div>
              <MyTasksSection />
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#091413]/70 border border-[#285A48]/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Completed Task History</h2>
                  <p className="text-xs text-neutral-400 mt-1">Archive of accomplished tasks and deliverables</p>
                </div>
              </div>
              <MyTasksSection />
            </div>
          )}

          {activeTab === 'projects' && <ProjectsView />}

          {activeTab === 'tags' && <TagsView />}

          {activeTab === 'calendar' && <CalendarView />}

          {activeTab === 'collaboration' && <CollaborationView />}

          {activeTab === 'integrations' && <IntegrationsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AddTaskModal />
      <QuickAddModal />
      <VoiceInputModal />
      <TaskDetailModal />
      <CreateProjectModal />
      <CreateTagModal />
      <ReminderModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <MainWorkspace />
    </TaskProvider>
  );
}
