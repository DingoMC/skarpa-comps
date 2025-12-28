'use client';

import { TaskCategoryIds } from '@/lib/types/task';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { Category, Task } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllCategoriesAdmin } from '../../categories/requests';
import EditTask from '../components/EditTask';
import { getTaskById, updateTaskAdmin } from '../requests';

type Props = {
  id: string;
};

const EditTaskWrapper = ({ id }: Props) => {
  const [data, setData] = useState<TaskCategoryIds | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const handleUpdate = async (newData: Task, categoryIds: string[]) => {
    setRefetching(true);
    const { success, error } = await updateTaskAdmin(newData, categoryIds);
    if (success && error === null) {
      toast.success('Zadanie zaktualizowane pomyślnie.');
      router.push('/admin/tasks');
      return;
    }
    toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    setRefetching(false);
  };

  const loadData = async () => {
    const resp = await getTaskById(id);
    if (resp.error !== null) {
      toast.error(resp.error);
      setData(undefined);
    } else setData({ ...resp.data });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <DashboardSpinner title="Edytuj Zadanie" refreshing={loading} />;
  }

  if (!data) {
    return (
      <DashboardFrame title="Edytuj Zadanie">
        <NoData message="Nie znaleziono zadania o podanym identyfikatorze." />
      </DashboardFrame>
    );
  }

  return <EditTask original={data} loading={refetching} categories={categories} handleUpdate={handleUpdate} handleBack={handleBack} />;
};

export default EditTaskWrapper;
