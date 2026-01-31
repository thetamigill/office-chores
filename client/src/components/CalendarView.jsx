import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
} from 'date-fns';
import CalendarDay from './CalendarDay';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ tasks, onTaskClick, currentMonth, onMonthChange }) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const tasksByDate = useMemo(() => {
    const map = {};
    for (const task of tasks) {
      const d = task.due_date;
      if (!map[d]) map[d] = [];
      map[d].push(task);
    }
    return map;
  }, [tasks]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          &larr; Prev
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Next &rarr;
        </button>
      </div>
      <div className="grid grid-cols-7 border border-gray-200 rounded-xl overflow-hidden">
        {WEEKDAYS.map((day) => (
          <div key={day} className="bg-gray-50 border-b border-gray-200 py-2 text-center text-xs font-semibold text-gray-500">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <CalendarDay
            key={day.toISOString()}
            date={day}
            currentMonth={currentMonth}
            tasks={tasksByDate[format(day, 'yyyy-MM-dd')] || []}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}
