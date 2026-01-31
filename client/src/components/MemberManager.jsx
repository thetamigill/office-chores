import { useState } from 'react';

export default function MemberManager({ members, onCreate, onDelete, onClose }) {
  const [name, setName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add member..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </form>
        {members.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No members yet</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-800">{m.name}</span>
                {confirmDeleteId === m.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { onDelete(m.id); setConfirmDeleteId(null); }}
                      className="text-xs text-red-700 font-semibold hover:underline"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(m.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
