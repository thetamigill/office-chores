import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

export function useMembers() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['members'],
    queryFn: api.getMembers,
  });

  const create = useMutation({
    mutationFn: api.createMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }),
  });

  const remove = useMutation({
    mutationFn: api.deleteMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return { members: query.data || [], isLoading: query.isLoading, error: query.error, create, remove };
}
