'use client';

import { TaskCategoryIds } from '@/lib/types/task';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { RootState } from '@/store/store';
import { Category } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllCategoriesAdmin } from '../../categories/requests';
import AdminTasks from '../components';
import { deleteTaskAdmin, getAllTasksForComp } from '../requests';

const AdminTasksWrapper = () => {
  const currCompId = useSelector((state: RootState) => state.competition.id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<TaskCategoryIds[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);

  const loadData = async () => {
    if (!currCompId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const resp = await getAllTasksForComp(currCompId);
    if (resp.error !== null) {
      toast.error(resp.error);
      setData([]);
    } else {
      setData(resp.data);
    }
    const resp2 = await getAllCategoriesAdmin();
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setCategories([]);
    } else {
      setCategories(resp2.data);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefetching(true);
    await loadData();
    setRefetching(false);
  };

  const handleDelete = async (id: string) => {
    setRefetching(true);
    const resp = await deleteTaskAdmin(id);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success('Zadanie zostałousunięte pomyślnie.');
      await loadData();
    }
    setRefetching(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currCompId]);

  if (loading) {
    return <DashboardSpinner title="Zadania" refreshing={loading} />;
  }

  if (!currCompId) {
    return (
      <DashboardFrame title="Zadania">
        <NoData message="Nie wybrano zawodów. Wybierz zawody lub utwórz nowe." />
      </DashboardFrame>
    );
  }

  return (
    <AdminTasks
      data={data}
      categories={categories}
      loading={refetching}
      onRefresh={handleRefresh}
      onDelete={handleDelete}
    />
  );
};

export default AdminTasksWrapper;
