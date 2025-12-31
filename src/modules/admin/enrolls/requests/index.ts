import axiosRequest from '@/lib/axios';
import { EnrollCreateAdmin, EnrollUpdateAdmin } from '@/lib/types/enroll';
import { StartListAdmin } from '@/lib/types/startList';

export const getStartListAdmin = async (compId: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/enrolls',
    method: 'GET',
    params: { competition_id: compId },
  });
  if (error === null && data && Array.isArray(data)) {
    return { success: true, error, data: data as StartListAdmin[] };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};

export const getEnrollByIdAdmin = async (id: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/enrolls',
    method: 'GET',
    params: { id },
  });
  if (error === null && data) {
    return { success: true, error, data: data as StartListAdmin };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};

export const createEnrollAdmin = async (req: EnrollCreateAdmin) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/enrolls',
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

export const updateEnrollAdmin = async (req: EnrollUpdateAdmin) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/enrolls',
    method: 'PUT',
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

export const deleteEnrollAdmin = async (id: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/enrolls',
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
