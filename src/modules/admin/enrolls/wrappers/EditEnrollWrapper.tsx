'use client';

import { EnrollUpdateAdmin } from '@/lib/types/enroll';
import { StartListAdmin } from '@/lib/types/startList';
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
import AdminEditEnroll from '../components/EditEnroll';
import { getEnrollByIdAdmin, updateEnrollAdmin } from '../requests';

type Props = {
  id: string;
};

const EditEnrollWrapper = ({ id }: Props) => {
  const currCompId = useSelector((state: RootState) => state.competition.id);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currComp, setCurrComp] = useState<Competition>();
  const [data, setData] = useState<StartListAdmin>();
  const router = useRouter();

  const handleUpdate = async (newData: EnrollUpdateAdmin) => {
    setRefetching(true);
    const { success, error } = await updateEnrollAdmin(newData);
    if (success && error === null) {
      toast.success('Wpis użytkownika zaktualizowany pomyślnie.');
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
    const resp3 = await getEnrollByIdAdmin(id);
    if (resp3.error !== null) {
      toast.error(resp3.error);
      setData(undefined);
    } else setData(resp3.data);
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
    return <DashboardSpinner title="Edytuj wpis na zawody" refreshing={loading} />;
  }

  if (!currCompId || !currComp) {
    return (
      <DashboardFrame title="Edytuj wpis na zawody">
        <NoData message="Nie wybrano zawodów. Wybierz zawody lub utwórz nowe." />
      </DashboardFrame>
    );
  }

  if (!data) {
    return (
      <DashboardFrame title="Edytuj wpis na zawody">
        <NoData message="Nie znaleziono wpisu o podanym identyfikatorze." />
      </DashboardFrame>
    );
  }

  return (
    <AdminEditEnroll
      loading={refetching}
      currCompId={currCompId}
      currComp={currComp}
      categories={categories}
      originalData={data}
      handleUpdate={handleUpdate}
      handleBack={handleBack}
    />
  );
};

export default EditEnrollWrapper;
