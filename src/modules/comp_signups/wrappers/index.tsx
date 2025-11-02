'use client';

import { EnrollRequest } from '@/lib/types/enroll';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { RootState } from '@/store/store';
import { Category, Competition } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CompSignup from '../components';
import { getAllCategories, getAllEnrollableCompetitions, newEnroll } from '../requests';
import { autoAssignCategoryId } from '../utils';

const CompSignupsWrapper = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [available, setAvailable] = useState<Competition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Competition>();
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const params = useSearchParams();

  const loadData = async () => {
    const resp = await getAllEnrollableCompetitions();
    const resp2 = await getAllCategories();
    if (resp2.error !== null) {
      toast.error(resp.error);
      setCategories([]);
    } else setCategories(resp2.data);
    if (resp.error !== null) {
      toast.error(resp.error);
      setAvailable([]);
    } else setAvailable(resp.data);
    setLoading(false);
  };

  const handleEnroll = async (eData: EnrollRequest) => {
    setRefetching(true);
    const { success, error } = await newEnroll(eData);
    if (success && error === null) {
      toast.success('Zapisy zakończone sukcesem. Nastąpi przekierowanie do strony głównej.');
      router.push('/');
      return;
    }
    toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    setRefetching(false);
  };

  const handleSelectChange = (id: string) => {
    const found = available.find((c) => c.id === id);
    if (found) setSelected({ ...found });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const id = params.get('id');
    if (available.length) {
      const found = id !== null ? available.find((c) => c.id === id) : undefined;
      if (found) {
        setSelected({ ...found });
      } else {
        setSelected({ ...available[0] });
      }
    }
  }, [available, params]);

  if (loading) {
    return <DashboardSpinner title="Zapisy na zawody" refreshing={loading} />;
  }

  if (!available.length || !selected) {
    return (
      <DashboardFrame title="Zapisy na zawody">
        <NoData message="Brak zawodów." />
      </DashboardFrame>
    );
  }

  return (
    <CompSignup
      categories={categories}
      user={user}
      available={available}
      loading={refetching}
      selected={selected}
      catIdAuto={autoAssignCategoryId(user, categories)}
      handleEnroll={handleEnroll}
      handleSelectChange={handleSelectChange}
    />
  );
};

export default CompSignupsWrapper;
