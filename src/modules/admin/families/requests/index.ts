import axiosRequest from '@/lib/axios';
import { StartListAdmin } from '@/lib/types/startList';
import { AdminFamily } from '../types';

export const getFamiliesAdmin = async (compId: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/family',
    method: 'GET',
    params: { competition_id: compId },
  });
  if (error === null && data && data.families && data.users) {
    return { success: true, error, data: { families: data.families as AdminFamily[], users: data.users as StartListAdmin[] } };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};

export const createFamilyAdmin = async (compId: string, name: string, userCompIds: string[]) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/family',
    method: 'POST',
    params: { competition_id: compId },
    data: { name, userCompIds },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const updateFamilyAdmin = async (compId: string, name: string, familyId: string, userCompIds: string[]) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/family',
    method: 'PUT',
    params: { competition_id: compId },
    data: { familyId, userCompIds, name },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const deleteFamilyAdmin = async (id: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/family',
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
