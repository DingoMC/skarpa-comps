import axiosRequest from "@/lib/axios";
import { UserUI } from "@/lib/types/auth";
import { Role } from "@prisma/client";

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
