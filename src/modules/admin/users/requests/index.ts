import axiosRequest from '@/lib/axios';
import { UserUI } from '@/lib/types/auth';
import { Role, User } from '@prisma/client';

export const getUserByIdAdmin = async (id: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/users',
    method: 'GET',
    params: { id },
  });
  if (error === null && data) {
    return { success: true, error, data: data as UserUI };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};

export const getAllUsersAdmin = async () => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/users',
    method: 'GET',
  });
  if (error === null && data && Array.isArray(data)) {
    return { success: true, error, data: data as UserUI[] };
  }
  if (error === null && data && data.message) {
    return { success: false, error: data.message as string, data: null };
  }
  return { success: false, error: error?.message ?? 'Nieznany błąd', data: null };
};

export const getAllRolesAdmin = async () => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/roles',
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

export const createUserAdmin = async (userData: User) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/users',
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

export const updateUserAdmin = async (userData: User) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/users',
    method: 'PUT',
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

export const deleteUserAdmin = async (id: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/admin/users',
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
