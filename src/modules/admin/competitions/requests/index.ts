import axiosRequest from '@/lib/axios';
import { Competition } from '@prisma/client';

export const getCompetitionByIdAdmin = async (id: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/competitions',
    method: 'GET',
    params: { id },
  });
  if (error === null && data) {
    return { success: true, error, data: data as Competition };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};

export const getAllCompetitionsAdmin = async () => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/competitions',
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

export const createCompetitionAdmin = async (compData: Competition) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/competitions',
    method: 'POST',
    data: { ...compData },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const updateCompetitionAdmin = async (compData: Competition) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/competitions',
    method: 'PUT',
    data: { ...compData },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const deleteCompetitionAdmin = async (id: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/competitions',
    method: 'DELETE',
    params: { id },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};
