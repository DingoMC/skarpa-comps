'use client';

import { Category, Task } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllCategoriesAdmin } from '../../categories/requests';
import { createTaskAdmin } from '../requests';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import DashboardFrame from '@/modules/dashboard/components';
import NoData from '@/modules/lottie/NoData';
import NewTask from '../components/NewTask';

const NewTaskWrapper = () => {
  const currCompId = useSelector((state: RootState) => state.competition.id);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const handleAdd = async (compData: Task, categoryIds: string[]) => {
    setRefetching(true);
    const { success, error } = await createTaskAdmin(compData, categoryIds);
    if (success && error === null) {
      toast.success('Zadanie utworzone pomyślnie.');
      router.push('/admin/tasks');
      return;
    }
    toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    setRefetching(false);
  };

  const loadData = async () => {
    const resp2 = await getAllCategoriesAdmin();
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setCategories([]);
    } else setCategories(resp2.data);
    setLoading(false);
  };

  const handleBack = () => {
    router.push('/admin/tasks');
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!currCompId) {
    return (
      <DashboardFrame title="Nowe Zadanie">
        <NoData message="Nie wybrano zawodów. Wybierz zawody lub utwórz nowe." />
      </DashboardFrame>
    );
  }

  return (
    <NewTask loading={refetching} currCompId={currCompId} categories={categories} handleAdd={handleAdd} handleBack={handleBack} />
  );
};

export default NewTaskWrapper;
