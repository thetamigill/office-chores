const ASSIGNEE_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-yellow-100 text-yellow-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-red-100 text-red-800',
  'bg-teal-100 text-teal-800',
];

function getAssigneeColor(memberId) {
  if (!memberId) return 'bg-gray-100 text-gray-600';
  return ASSIGNEE_COLORS[memberId % ASSIGNEE_COLORS.length];
}

const STATUS_BADGES = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function TaskCard({ task, onClick }) {
  return (
    <div
      onClick={() => onClick?.(task)}
      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</h3>
        {task.recurrence && (
          <span className="shrink-0 text-xs text-gray-400" title={`Repeats ${task.recurrence}`}>
            &#x21bb;
          </span>
        )}
      </div>
      {task.description && (
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{task.description}</p>
      )}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGES[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
        {task.assigned_to_name && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAssigneeColor(task.assigned_to)}`}>
            {task.assigned_to_name}
          </span>
        )}
        <span className="text-xs text-gray-400 ml-auto">{task.due_date}</span>
      </div>
    </div>
  );
}
