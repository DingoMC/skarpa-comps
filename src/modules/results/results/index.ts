import axiosRequest from '@/lib/axios';
import { ResultsSummary } from '@/lib/types/results';
import { Task } from '@prisma/client';

export const getResults = async (compId: string, categoryId: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/results',
    method: 'GET',
    params: { competition_id: compId, category_id: categoryId },
  });
  if (error === null && data && Array.isArray(data.men) && Array.isArray(data.women) && Array.isArray(data.tasks)) {
    return {
      success: true,
      error,
      data: { men: data.men as ResultsSummary[], women: data.women as ResultsSummary[], tasks: data.tasks as Task[] },
    };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};
