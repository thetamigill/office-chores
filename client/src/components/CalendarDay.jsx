import { isToday, isSameMonth } from 'date-fns';

const STATUS_DOT = {
  todo: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  done: 'bg-green-500',
};

export default function CalendarDay({ date, currentMonth, tasks, onTaskClick }) {
  const today = isToday(date);
  const inMonth = isSameMonth(date, currentMonth);

  return (
    <div
      className={`min-h-[100px] border border-gray-100 p-1 ${
        inMonth ? 'bg-white' : 'bg-gray-50'
      } ${today ? 'ring-2 ring-blue-400 ring-inset' : ''}`}
    >
      <div className={`text-xs font-medium px-1 ${inMonth ? 'text-gray-700' : 'text-gray-400'} ${today ? 'text-blue-600' : ''}`}>
        {date.getDate()}
      </div>
      <div className="mt-0.5 space-y-0.5">
        {tasks.slice(0, 3).map((task) => (
          <button
            key={task.is_recurring_instance ? `${task.id}-${task.due_date}` : task.id}
            onClick={() => onTaskClick(task)}
            className="w-full text-left flex items-center gap-1 px-1 py-0.5 rounded hover:bg-gray-100 transition-colors group"
          >
            <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${STATUS_DOT[task.status]}`} />
            <span className="text-xs text-gray-700 truncate group-hover:text-gray-900">{task.title}</span>
            {task.recurrence && <span className="text-[10px] text-gray-400 shrink-0">&#x21bb;</span>}
          </button>
        ))}
        {tasks.length > 3 && (
          <span className="text-[10px] text-gray-400 px-1">+{tasks.length - 3} more</span>
        )}
      </div>
    </div>
  );
}
