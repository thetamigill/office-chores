import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';

const COLUMN_CONFIG = {
  todo: { title: 'To Do', color: 'border-gray-300', bg: 'bg-gray-50' },
  in_progress: { title: 'In Progress', color: 'border-blue-300', bg: 'bg-blue-50' },
  done: { title: 'Done', color: 'border-green-300', bg: 'bg-green-50' },
};

export default function KanbanColumn({ status, tasks, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = COLUMN_CONFIG[status];

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border-2 ${config.color} ${isOver ? 'ring-2 ring-blue-400' : ''} min-h-[300px]`}
    >
      <div className={`${config.bg} px-4 py-3 rounded-t-lg border-b ${config.color}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-700">{config.title}</h3>
          <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
      </div>
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {tasks.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
        )}
        {tasks.map((task) => (
          <KanbanCard
            key={task.is_recurring_instance ? `${task.id}-${task.due_date}` : task.id}
            task={task}
            onClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}
