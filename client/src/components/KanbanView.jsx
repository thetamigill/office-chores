import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';

const STATUSES = ['todo', 'in_progress', 'done'];

export default function KanbanView({ tasks, onStatusChange, onTaskClick }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const grouped = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id;
    if (!STATUSES.includes(newStatus)) return;
    const task = active.data.current.task;
    if (task.status === newStatus) return;
    onStatusChange(task, newStatus);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-6 h-[calc(100vh-73px)] overflow-hidden">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={grouped[status]}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </DndContext>
  );
}
