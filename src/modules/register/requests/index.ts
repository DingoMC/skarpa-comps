import axiosRequest from '@/lib/axios';
import { User } from '@prisma/client';

export const registerUser = async (userData: User) => {
  const { data, error } = await axiosRequest({
    url: '/api/auth/register',
    method: 'POST',
    data: { ...userData },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};
