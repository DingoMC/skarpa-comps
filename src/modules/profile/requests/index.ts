import axiosRequest from "@/lib/axios";
import { UserUI } from "@/lib/types/auth";

export const getProfileData = async () => {
  const { data, error } = await axiosRequest({
    url: '/api/profile',
    method: 'GET',
  });
  if (error === null) {
    return { success: true, error, data: data as UserUI };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const updateProfileData = async (userData: UserUI) => {
  const { data, error } = await axiosRequest({
    url: '/api/profile',
    method: 'PUT',
    data: { ...userData },
  });
  if (error === null) {
    return { success: true, error, data: data as UserUI };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const updateProfileEmail = async (email: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/profile/update-email',
    method: 'PUT',
    data: { email },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};

export const updateProfilePassword = async (oldPassword: string, newPassword: string) => {
  const { data, error } = await axiosRequest({
    url: '/api/profile/update-password',
    method: 'PUT',
    data: { oldPassword, newPassword },
  });
  if (error === null) {
    return { success: true, error };
  }
  if (data && data.message) {
    return { success: false, error: data.message as string };
  }
  return { success: false, error: error.message };
};
