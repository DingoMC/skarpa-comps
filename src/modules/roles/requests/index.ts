import axiosRequest from '@/lib/axios';
import { Role } from '@prisma/client';

export const getAllRoles = async () => {
  const { data, error } = await axiosRequest({
    url: '/api/roles',
    method: 'GET',
  });
  if (error === null && data && Array.isArray(data)) {
    return { success: true, error, data: data as Role[] };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};
