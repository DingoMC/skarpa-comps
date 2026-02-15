'use client';

import { TaskCategoryIds } from '@/lib/types/task';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { RootState } from '@/store/store';
import { Category, Task, TaskScoringTemplate } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllCategoriesAdmin } from '../../categories/requests';
import NewTask from '../components/NewTask';
import { createTaskAdmin, createTaskTemplateAdmin, getTaskById, getTaskTemplatesAdmin } from '../requests';

const NewTaskWrapper = () => {
  const currCompId = useSelector((state: RootState) => state.competition.id);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<TaskScoringTemplate[]>([]);
  const [cloneFrom, setCloneFrom] = useState<TaskCategoryIds | undefined>();
  const router = useRouter();
  const params = useSearchParams();

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

  const loadTemplates = async () => {
    const resp = await getTaskTemplatesAdmin();
    if (resp.error !== null) {
      toast.error(resp.error);
      setTemplates([]);
    } else setTemplates(resp.data);
  };

  const loadData = async () => {
    if (!currCompId) {
      setLoading(false);
      return;
    }
    const resp2 = await getAllCategoriesAdmin(currCompId);
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setCategories([]);
    } else setCategories(resp2.data);
    await loadTemplates();
    const clone = params.get('clone_from');
    if (clone !== null && clone.trim().length > 0) {
      const resp = await getTaskById(clone);
      if (resp.error !== null) {
        toast.error(resp.error);
        setCloneFrom(undefined);
      } else setCloneFrom({ ...resp.data });
    }
    setLoading(false);
  };

  const handleAddTemplate = async (name: string, settings: string) => {
    setRefetching(true);
    const resp = await createTaskTemplateAdmin(name, settings);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      await loadTemplates();
      toast.success('Szablon utworzony pomyślnie.');
    }
    setRefetching(false);
  };

  const handleBack = () => {
    router.push('/admin/tasks');
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  if (loading) {
    return <DashboardSpinner title="Nowe Zadanie" refreshing={loading} />;
  }

  if (!currCompId) {
    return (
      <DashboardFrame title="Nowe Zadanie">
        <NoData message="Nie wybrano zawodów. Wybierz zawody lub utwórz nowe." />
      </DashboardFrame>
    );
  }

  return (
    <NewTask
      loading={refetching}
      currCompId={currCompId}
      categories={categories}
      templates={templates}
      cloneFrom={cloneFrom}
      onAddTemplate={handleAddTemplate}
      handleAdd={handleAdd}
      handleBack={handleBack}
    />
  );
};

export default NewTaskWrapper;
