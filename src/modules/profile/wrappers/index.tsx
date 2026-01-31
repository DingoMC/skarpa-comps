'use client';

import { transformName } from '@/lib/text';
import { UserUI } from '@/lib/types/auth';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import UserProfile from '../components';
import { getProfileData, updateProfileData, updateProfileEmail, updateProfilePassword } from '../requests';

const ProfileWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [data, setData] = useState<UserUI>();
  const router = useRouter();

  const loadData = async () => {
    const resp = await getProfileData();
    if (resp.error !== null) {
      toast.error(resp.error);
      setLoading(false);
      router.push('/logout');
      return;
    }
    setData({ ...resp.data, firstName: transformName(resp.data.firstName), lastName: transformName(resp.data.lastName) });
    setLoading(false);
  };

  const handleProfileUpdate = async (newData: UserUI) => {
    setRefetching(true);
    const resp = await updateProfileData({ ...newData });
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success('Twoje dane zostały zmienione.');
      setData({ ...resp.data, firstName: transformName(resp.data.firstName), lastName: transformName(resp.data.lastName) });
    }
    setRefetching(false);
  };

  const handleChangeEmail = async (newEmail: string) => {
    setRefetching(true);
    const resp = await updateProfileEmail(newEmail);
    if (resp.success && resp.error === null) {
      toast.success('Twój adres E-mail został zmieniony. Nastąpi wylogowanie.');
      setRefetching(false);
      router.push('/logout');
      return;
    }
    toast.error(resp.error ?? 'Wystąpił nieznany błąd.');
    setRefetching(false);
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    setRefetching(true);
    const resp = await updateProfilePassword(oldPassword, newPassword);
    if (resp.success && resp.error === null) {
      toast.success('Twoje hasło zostało zmienione. Nastąpi wylogowanie.');
      setRefetching(false);
      router.push('/logout');
      return;
    }
    toast.error(resp.error ?? 'Wystąpił nieznany błąd.');
    setRefetching(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <DashboardSpinner title="Mój Profil" refreshing={loading} />;
  }

  if (!data) return null;

  return (
    <UserProfile
      originalData={data}
      loading={refetching}
      onPasswordUpdate={handleChangePassword}
      onEmailUpdate={handleChangeEmail}
      onProfileUpdate={handleProfileUpdate}
    />
  );
};

export default ProfileWrapper;
