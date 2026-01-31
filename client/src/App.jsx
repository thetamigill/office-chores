import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { useTasks } from './hooks/useTasks';
import { useMembers } from './hooks/useMembers';
import Header from './components/Header';
import KanbanView from './components/KanbanView';
import CalendarView from './components/CalendarView';
import TaskModal from './components/TaskModal';
import MemberManager from './components/MemberManager';

export default function App() {
  const [view, setView] = useState('kanban');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showMembers, setShowMembers] = useState(false);

  // Compute date range for calendar view
  const calRange = useMemo(() => {
    const ms = startOfMonth(currentMonth);
    const me = endOfMonth(currentMonth);
    return {
      from: format(startOfWeek(ms), 'yyyy-MM-dd'),
      to: format(endOfWeek(me), 'yyyy-MM-dd'),
    };
  }, [currentMonth]);

  const taskParams = view === 'calendar' ? calRange : {};
  const { tasks, isLoading, error, create, update, remove, updateStatus, updateOccurrence } = useTasks(taskParams);
  const { members, create: createMember, remove: removeMember } = useMembers();

  const handleTaskClick = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleSaveTask = (data) => {
    if (data.id) {
      update.mutate(data, { onSuccess: () => setShowTaskModal(false) });
    } else {
      create.mutate(data, { onSuccess: () => setShowTaskModal(false) });
    }
  };

  const handleDeleteTask = (id) => {
    remove.mutate(id, { onSuccess: () => setShowTaskModal(false) });
  };

  const handleStatusChange = (task, newStatus) => {
    if (task.is_recurring_instance) {
      updateOccurrence.mutate({ id: task.id, date: task.due_date, status: newStatus });
    } else {
      updateStatus.mutate({ id: task.id, status: newStatus });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        view={view}
        onViewChange={setView}
        onAddTask={handleAddTask}
        onManageMembers={() => setShowMembers(true)}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Failed to load tasks: {error.message}
        </div>
      )}

      {!isLoading && !error && view === 'kanban' && (
        <KanbanView
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onTaskClick={handleTaskClick}
        />
      )}

      {!isLoading && !error && view === 'calendar' && (
        <CalendarView
          tasks={tasks}
          onTaskClick={handleTaskClick}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />
      )}

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          members={members}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {showMembers && (
        <MemberManager
          members={members}
          onCreate={(name) => createMember.mutate(name)}
          onDelete={(id) => removeMember.mutate(id)}
          onClose={() => setShowMembers(false)}
        />
      )}
    </div>
  );
}
