const API = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Members
export const getMembers = () => request('/members');
export const createMember = (name) => request('/members', { method: 'POST', body: JSON.stringify({ name }) });
export const deleteMember = (id) => request(`/members/${id}`, { method: 'DELETE' });

// Tasks
export const getTasks = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/tasks${qs ? `?${qs}` : ''}`);
};
export const createTask = (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) });
export const updateTask = (id, task) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' });
export const updateTaskStatus = (id, status) =>
  request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const updateOccurrenceStatus = (id, date, status) =>
  request(`/tasks/${id}/occurrences/${date}`, { method: 'PATCH', body: JSON.stringify({ status }) });
