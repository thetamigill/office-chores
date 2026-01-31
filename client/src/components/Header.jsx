export default function Header({ view, onViewChange, onAddTask, onManageMembers }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">Office Chores</h1>
      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange('kanban')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => onViewChange('calendar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Calendar
          </button>
        </div>
        <button
          onClick={onManageMembers}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Members
        </button>
        <button
          onClick={onAddTask}
          className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Task
        </button>
      </div>
    </header>
  );
}
