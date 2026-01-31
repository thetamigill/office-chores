import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

export function useTasks(params = {}) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['tasks', params],
    queryFn: () => api.getTasks(params),
  });

  const create = useMutation({
    mutationFn: api.createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...data }) => api.updateTask(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const remove = useMutation({
    mutationFn: api.deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['tasks'] });
      qc.setQueriesData({ queryKey: ['tasks'] }, (old) => {
        if (!old) return old;
        return old.map((t) => (t.id === id ? { ...t, status } : t));
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateOccurrence = useMutation({
    mutationFn: ({ id, date, status }) => api.updateOccurrenceStatus(id, date, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return {
    tasks: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    create,
    update,
    remove,
    updateStatus,
    updateOccurrence,
  };
}
