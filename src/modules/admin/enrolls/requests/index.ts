import axiosRequest from '@/lib/axios';
import { EnrollCreateAdmin, EnrollReNumberReq, EnrollUpdateAdmin } from '@/lib/types/enroll';
import { StartListAdmin } from '@/lib/types/startList';
import { Task, Task_User } from '@prisma/client';

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

export const renumberEnrolls = async (compId: string, reqData: EnrollReNumberReq) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/enrolls/renumber',
    method: 'POST',
    params: { competition_id: compId },
    data: { ...reqData },
  });
  if (error === null) {
    return { success: true, error, data: data.message as string };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const getUserResultsAdmin = async (id: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/enrolls/results',
    method: 'GET',
    params: { user_comp_id: id },
  });
  if (error === null && data && data.results && data.tasks) {
    return {
      success: true,
      error,
      data: { results: data.results as Task_User[], tasks: data.tasks as Task[] },
    };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};

export const updateUserResultsAdmin = async (id: string, results: Task_User[]) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/enrolls/results',
    method: 'PUT',
    data: { results },
    params: { user_comp_id: id },
  });
  if (error === null) {
    return { success: true, error, data: data.message as string };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};
