'use client';

import { filterRoles } from '@/lib/auth';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import { RootState } from '@/store/store';
import { Role, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminNewUser from '../components/NewUser';
import { createUserAdmin, getAllRolesAdmin } from '../requests';

const NewUserWrapper = () => {
  const authLevel = useSelector((state: RootState) => state.auth.authLevel);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const router = useRouter();

  const handleAdd = async (userData: User) => {
    setRefetching(true);
    const { success, error } = await createUserAdmin(userData);
    if (success && error === null) {
      toast.success('Użytkownik utworzony pomyślnie.');
      router.push('/admin/users');
      return;
    }
    toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    setRefetching(false);
  };

  const handleBack = () => {
    router.push('/admin/users');
  };

  const loadData = async () => {
    const resp2 = await getAllRolesAdmin();
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setRoles([]);
    } else setRoles(resp2.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <DashboardSpinner title="Nowy użytkownik" refreshing={loading} />;
  }

  return <AdminNewUser loading={refetching} roles={filterRoles(roles, authLevel)} handleAdd={handleAdd} handleBack={handleBack} />;
};

export default NewUserWrapper;
