import axiosRequest from "@/lib/axios";
import { StartListEntry } from "@/lib/types/startList";

export const getStartList = async (compId: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/start_lists',
    method: 'GET',
    params: { competition_id: compId },
  });
  if (error === null && data && Array.isArray(data)) {
    return { success: true, error, data: data as StartListEntry[] };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};