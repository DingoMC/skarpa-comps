'use client';

import { StartListEntry } from '@/lib/types/startList';
import { TaskCategoryIds } from '@/lib/types/task';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { RootState } from '@/store/store';
import { Category, Role, Task_User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllCategoriesAdmin } from '../../categories/requests';
import { getAllRolesAdmin } from '../../users/requests';
import EditTaskResults from '../components/results/EditTaskResults';
import { getTaskById, getTaskResultsAdmin, updateTaskResultsAdmin } from '../requests';

type Props = {
  id: string;
};

const EditTaskResultsWrapper = ({ id }: Props) => {
  const currCompId = useSelector((state: RootState) => state.competition.id);
  const [results, setResults] = useState<Task_User[]>([]);
  const [users, setUsers] = useState<StartListEntry[]>([]);
  const [task, setTask] = useState<TaskCategoryIds>();
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const router = useRouter();

  const loadData = async () => {
    if (!currCompId) {
      setLoading(false);
      setRefetching(false);
      return;
    }
    if (!loading) setRefetching(true);
    const resp = await getTaskById(id);
    if (resp.error !== null) {
      toast.error(resp.error);
      setTask(undefined);
      setLoading(false);
      return;
    }
    setTask({ ...resp.data });
    const resp2 = await getAllCategoriesAdmin(currCompId);
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setCategories([]);
    } else setCategories(resp2.data.filter((c) => resp.data.categories.map((v) => v.categoryId).includes(c.id)));
    const resp4 = await getAllRolesAdmin();
    if (resp4.error !== null) {
      toast.error(resp4.error);
      setRoles([]);
    } else setRoles(resp4.data);
    const resp3 = await getTaskResultsAdmin(id);
    if (resp3.error !== null) {
      toast.error(resp3.error);
      setResults([]);
      setUsers([]);
    } else {
      setResults([...resp3.data.results]);
      setUsers([...resp3.data.users]);
    }
    setLoading(false);
    setRefetching(false);
  };

  const handleUpdate = async (newData: Task_User[]) => {
    if (!task) return;
    setRefetching(true);
    const { data, success, error } = await updateTaskResultsAdmin(task.id, newData);
    if (success && error === null) {
      toast.success(data);
    } else toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    await loadData();
  };

  const handleBack = () => {
    router.push('/admin/tasks');
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <DashboardSpinner title="Edytuj Wyniki Zadania" refreshing={loading} />;
  }

  if (!task) {
    return (
      <DashboardFrame title="Edytuj Wyniki Zadania">
        <NoData message="Nie znaleziono zadania o podanym identyfikatorze." />
      </DashboardFrame>
    );
  }

  return (
    <EditTaskResults
      originalResults={results}
      loading={refetching}
      categories={categories}
      users={users}
      roles={roles}
      task={task}
      handleUpdate={handleUpdate}
      handleBack={handleBack}
    />
  );
};

export default EditTaskResultsWrapper;
