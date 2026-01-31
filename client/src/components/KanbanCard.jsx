import { useDraggable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

export default function KanbanCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.is_recurring_instance ? `${task.id}-${task.due_date}` : `task-${task.id}`,
    data: { task },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, opacity: isDragging ? 0.5 : 1 }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
}
