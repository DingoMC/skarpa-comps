'use client';

import { filterRoles } from '@/lib/auth';
import { UserUI } from '@/lib/types/auth';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { RootState } from '@/store/store';
import { Role, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminEditUser from '../components/EditUser';
import { getAllRolesAdmin, getUserByIdAdmin, updateUserAdmin } from '../requests';

type Props = {
  id: string;
};

const EditUserWrapper = ({ id }: Props) => {
  const authLevel = useSelector((state: RootState) => state.auth.authLevel);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [user, setUser] = useState<UserUI>();
  const router = useRouter();

  const handleEdit = async (userData: User) => {
    setRefetching(true);
    const { success, error } = await updateUserAdmin(userData);
    if (success && error === null) {
      toast.success('Dane użytkownika zaktualizowano pomyślnie.');
      router.push('/admin/users');
      return;
    }
    toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    setRefetching(false);
  };

  const handleBack = () => {
    router.push('/admin/users');
  };

  const loadData = async (refresh?: boolean) => {
    if (refresh) setRefetching(true);
    const resp = await getUserByIdAdmin(id);
    if (resp.error !== null) {
      toast.error(resp.error);
      setUser(undefined);
    } else setUser(resp.data);
    if (refresh) {
      setRefetching(false);
      setLoading(false);
      return;
    }
    const resp2 = await getAllRolesAdmin();
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setRoles([]);
    } else setRoles(resp2.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <DashboardSpinner title="Edycja użytkownika" refreshing={loading} />;
  }

  if (!user) {
    return (
      <DashboardFrame title="Edycja użytkownika">
        <NoData message="Nieprawidłowy identyfikator użytkownika." />
      </DashboardFrame>
    );
  }

  return (
    <AdminEditUser
      initUser={user}
      loading={refetching}
      roles={filterRoles(roles, authLevel)}
      handleEdit={handleEdit}
      handleBack={handleBack}
      onRefresh={() => loadData(true)}
    />
  );
};

export default EditUserWrapper;
