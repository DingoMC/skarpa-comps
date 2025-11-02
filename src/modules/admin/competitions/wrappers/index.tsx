'use client';

import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import { Competition } from '@prisma/client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminCompetitions from '../components';
import { deleteCompetitionAdmin, getAllCompetitionsAdmin } from '../requests';

const AdminCompetitionsWrapper = () => {
  const [data, setData] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);

  const loadData = async () => {
    const resp = await getAllCompetitionsAdmin();
    if (resp.error !== null) {
      toast.error(resp.error);
      setData([]);
    } else setData(resp.data);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefetching(true);
    await loadData();
    setRefetching(false);
  };

  const handleDelete = async (id: string) => {
    setRefetching(true);
    const resp = await deleteCompetitionAdmin(id);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success('Zawody zostały usunięte pomyślnie.');
      await loadData();
    }
    setRefetching(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <DashboardSpinner title="Zawody" refreshing={loading} />;
  }

  return (
    <AdminCompetitions
      data={data}
      loading={refetching}
      onRefresh={handleRefresh}
      onDelete={handleDelete}
    />
  );
};

export default AdminCompetitionsWrapper;
