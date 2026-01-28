'use client';

import { StartListAdmin } from '@/lib/types/startList';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { Task, Task_User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import EditUserResults from '../components/results/EditUserResults';
import { getEnrollByIdAdmin, getUserResultsAdmin, updateUserResultsAdmin } from '../requests';

type Props = {
  id: string;
};

const EditUserResultsWrapper = ({ id }: Props) => {
  const [results, setResults] = useState<Task_User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [enroll, setEnroll] = useState<StartListAdmin>();
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const router = useRouter();

  const loadData = async () => {
    if (!loading) setRefetching(true);
    const resp = await getEnrollByIdAdmin(id);
    if (resp.error !== null) {
      toast.error(resp.error);
      setEnroll(undefined);
      setLoading(false);
      return;
    }
    setEnroll({ ...resp.data });
    const resp3 = await getUserResultsAdmin(id);
    if (resp3.error !== null) {
      toast.error(resp3.error);
      setResults([]);
      setTasks([]);
    } else {
      setResults([...resp3.data.results]);
      setTasks([...resp3.data.tasks]);
    }
    setLoading(false);
    setRefetching(false);
  };

  const handleUpdate = async (newData: Task_User[]) => {
    if (!enroll) return;
    setRefetching(true);
    const { data, success, error } = await updateUserResultsAdmin(enroll.id, newData);
    if (success && error === null) {
      toast.success(data);
    } else toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    await loadData();
  };

  const handleBack = () => {
    router.push('/admin/enrolls');
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <DashboardSpinner title="Edytuj Wyniki Uczestnika" refreshing={loading} />;
  }

  if (!enroll) {
    return (
      <DashboardFrame title="Edytuj Wyniki Uczestnika">
        <NoData message="Nie znaleziono uczestnika o podanym identyfikatorze." />
      </DashboardFrame>
    );
  }

  return (
    <EditUserResults
      originalResults={results}
      loading={refetching}
      tasks={tasks}
      enroll={enroll}
      handleUpdate={handleUpdate}
      handleBack={handleBack}
    />
  );
};

export default EditUserResultsWrapper;
