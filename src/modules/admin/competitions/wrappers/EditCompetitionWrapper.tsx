'use client';

import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { Category, Competition } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllCategoriesAdmin } from '../../categories/requests';
import EditCompetition from '../components/EditCompetition';
import { getCompetitionByIdAdmin, updateCompetitionAdmin } from '../requests';

type Props = {
  id: string;
};

const EditCompetitionWrapper = ({ id }: Props) => {
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comp, setComp] = useState<Competition>();
  const router = useRouter();

  const handleEdit = async (newData: Competition) => {
    setRefetching(true);
    const { success, error } = await updateCompetitionAdmin(newData);
    if (success && error === null) {
      toast.success('Dane zawodów zaktualizowano pomyślnie.');
      router.push('/admin/competitions');
      return;
    }
    toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    setRefetching(false);
  };

  const handleBack = () => {
    router.push('/admin/competitions');
  };

  const loadData = async (refresh?: boolean) => {
    if (refresh) setRefetching(true);
    const resp = await getCompetitionByIdAdmin(id);
    if (resp.error !== null) {
      toast.error(resp.error);
      setComp(undefined);
    } else setComp(resp.data);
    if (refresh) {
      setRefetching(false);
      setLoading(false);
      return;
    }
    const resp2 = await getAllCategoriesAdmin(resp.data?.id ?? '');
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setCategories([]);
    } else setCategories(resp2.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <DashboardSpinner title="Edytuj zawody" refreshing={loading} />;
  }

  if (!comp) {
    return (
      <DashboardFrame title="Edytuj zawody">
        <NoData message="Nieprawidłowy identyfikator zawodów." />
      </DashboardFrame>
    );
  }

  return (
    <EditCompetition
      initComp={comp}
      loading={refetching}
      categories={categories}
      handleEdit={handleEdit}
      handleBack={handleBack}
      onRefresh={() => loadData(true)}
    />
  );
};

export default EditCompetitionWrapper;
