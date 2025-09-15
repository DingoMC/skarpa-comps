import axiosRequest from '@/lib/axios';
import { UserUI } from '@/lib/types/auth';
import { User } from '@prisma/client';

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/auth/login',
    method: 'POST',
    data: { email: email.trim(), password: password.trim() },
  });
  if (error === null && data && data.user && data.token && data.authLevel) {
    return { success: true, error, data: data as { token: string; user: UserUI; authLevel: number } };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};
