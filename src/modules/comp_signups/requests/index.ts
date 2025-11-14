import axiosRequest from '@/lib/axios';
import { EnrollRequest } from '@/lib/types/enroll';
import { Category, Competition } from '@prisma/client';

export const newEnroll = async (req: EnrollRequest) => {
  const { data, error } = await axiosRequest({
    url: '/api/enroll',
    method: 'POST',
    data: { ...req },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const getAllEnrollableCompetitions = async () => {
  const { data, error } = await axiosRequest({
    url: '/api/competitions/enrollable',
    method: 'GET',
  });
  if (error === null && data && Array.isArray(data)) {
    return { success: true, error, data: data as Competition[] };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};

export const getAllCategories = async () => {
  const { data, error } = await axiosRequest({
    url: '/api/categories',
    method: 'GET',
  });
  if (error === null && data && Array.isArray(data)) {
    return { success: true, error, data: data as Category[] };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};
