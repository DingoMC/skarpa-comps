import axiosRequest from '@/lib/axios';
import { Category } from '@prisma/client';

export const getAllCategoriesAdmin = async (compId: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/categories',
    method: 'GET',
    params: { competition_id: compId },
  });
  if (error === null && data && Array.isArray(data)) {
    return { success: true, error, data: data as Category[] };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};

export const createCategoryAdmin = async (categoryData: Category) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/categories',
    method: 'POST',
    data: { ...categoryData },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const updateCategoryAdmin = async (categoryData: Category) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/categories',
    method: 'PUT',
    data: { ...categoryData },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const deleteCategoryAdmin = async (id: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/categories',
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
