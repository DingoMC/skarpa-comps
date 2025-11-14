import axiosRequest from '@/lib/axios';
import { CompetitionWithMemberCount } from '@/lib/types/competition';

export const getAllCompetitions = async () => {
  const { data, error } = await axiosRequest({
    url: '/api/competitions',
    method: 'GET',
  });
  if (error === null && data && Array.isArray(data)) {
    return { success: true, error, data: data as CompetitionWithMemberCount[] };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};
