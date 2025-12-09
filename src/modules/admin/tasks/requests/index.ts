import axiosRequest from "@/lib/axios";
import { TaskCategoryIds } from "@/lib/types/task";
import { Task } from "@prisma/client";

export const getAllTasksForComp = async (compId: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/tasks',
    method: 'GET',
    params: { competition_id: compId.trim() },
  });
  if (error === null && data && Array.isArray(data)) {
    return { success: true, error, data: data as TaskCategoryIds[] };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};

export const createTaskAdmin = async (taskData: Task, categoryIds: string[]) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/tasks',
    method: 'POST',
    data: { ...taskData, categoryIds },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const updateTaskAdmin = async (taskData: Task, categoryIds: string[]) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/tasks',
    method: 'PUT',
    data: { ...taskData, categoryIds },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const deleteTaskAdmin = async (id: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/tasks',
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
