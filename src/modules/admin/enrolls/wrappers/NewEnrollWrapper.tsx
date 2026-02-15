'use client';

import { UserUI } from '@/lib/types/auth';
import { EnrollCreateAdmin } from '@/lib/types/enroll';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { RootState } from '@/store/store';
import { Category, Competition } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllCategoriesAdmin } from '../../categories/requests';
import { getCompetitionByIdAdmin } from '../../competitions/requests';
import { getAllUsersAdmin } from '../../users/requests';
import AdminNewEnroll from '../components/NewEnroll';
import { createEnrollAdmin } from '../requests';

const NewEnrollWrapper = () => {
  const currCompId = useSelector((state: RootState) => state.competition.id);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<UserUI[]>([]);
  const [currComp, setCurrComp] = useState<Competition>();
  const router = useRouter();

  const handleAdd = async (newData: EnrollCreateAdmin) => {
    setRefetching(true);
    const { success, error } = await createEnrollAdmin(newData);
    if (success && error === null) {
      toast.success('Użytkownik zapisany pomyślnie.');
      router.push('/admin/enrolls');
      return;
    }
    toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    setRefetching(false);
  };

  const loadData = async () => {
    if (!currCompId) {
      setLoading(false);
      return;
    }
    const resp = await getCompetitionByIdAdmin(currCompId);
    if (resp.error !== null) {
      toast.error(resp.error);
      setCurrComp(undefined);
    } else setCurrComp(resp.data);
    const resp2 = await getAllCategoriesAdmin(currCompId);
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setCategories([]);
    } else setCategories(resp2.data);
    const resp3 = await getAllUsersAdmin();
    if (resp3.error !== null) {
      toast.error(resp3.error);
      setUsers([]);
    } else setUsers(resp3.data);
    setLoading(false);
  };

  const handleBack = () => {
    router.push('/admin/enrolls');
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <DashboardSpinner title="Nowy wpis na zawody" refreshing={loading} />;
  }

  if (!currCompId || !currComp) {
    return (
      <DashboardFrame title="Nowy wpis na zawody">
        <NoData message="Nie wybrano zawodów. Wybierz zawody lub utwórz nowe." />
      </DashboardFrame>
    );
  }

  return (
    <AdminNewEnroll
      loading={refetching}
      currCompId={currCompId}
      currComp={currComp}
      categories={categories}
      users={users}
      handleAdd={handleAdd}
      handleBack={handleBack}
    />
  );
};

export default NewEnrollWrapper;
