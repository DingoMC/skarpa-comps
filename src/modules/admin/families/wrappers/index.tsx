'use client';

import { StartListAdmin } from '@/lib/types/startList';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { RootState } from '@/store/store';
import { Competition } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCompetitionByIdAdmin } from '../../competitions/requests';
import AdminFamilies from '../components';
import { createFamilyAdmin, deleteFamilyAdmin, getFamiliesAdmin, updateFamilyAdmin } from '../requests';
import { AdminFamily } from '../types';

const AdminFamiliesWrapper = () => {
  const currCompId = useSelector((state: RootState) => state.competition.id);
  const [competition, setCompetition] = useState<Competition>();
  const [data, setData] = useState<AdminFamily[]>([]);
  const [users, setUsers] = useState<StartListAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);

  const loadData = async () => {
    if (!currCompId) {
      setLoading(false);
      return;
    }
    const resp2 = await getCompetitionByIdAdmin(currCompId);
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setCompetition(undefined);
      setLoading(false);
      return;
    }
    if (!resp2.data.allowFamilyRanking) {
      setCompetition(undefined);
      setLoading(false);
      return;
    }
    setCompetition({ ...resp2.data });
    const resp = await getFamiliesAdmin(currCompId);
    if (resp.error !== null) {
      toast.error(resp.error);
      setData([]);
      setUsers([]);
    } else {
      setData(resp.data.families);
      setUsers(resp.data.users);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefetching(true);
    await loadData();
    setRefetching(false);
  };

  const handleCreate = async (name: string, userIds: string[]) => {
    if (!currCompId) return;
    setRefetching(true);
    const resp = await createFamilyAdmin(currCompId, name, userIds);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success('Rodzina została utworzona pomyślnie.');
      await loadData();
    }
    setRefetching(false);
  };

  const handleUpdate = async (id: string, name: string, userIds: string[]) => {
    if (!currCompId) return;
    setRefetching(true);
    const resp = await updateFamilyAdmin(currCompId, name, id, userIds);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success('Rodzina została zaktualizowana pomyślnie.');
      await loadData();
    }
    setRefetching(false);
  };

  const handleDelete = async (id: string) => {
    setRefetching(true);
    const resp = await deleteFamilyAdmin(id);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success('Rodzina została usunięta pomyślnie.');
      await loadData();
    }
    setRefetching(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currCompId]);

  if (loading) {
    return <DashboardSpinner title="Rodziny" refreshing={loading} />;
  }

  if (!competition) {
    return (
      <DashboardFrame title="Rodziny" refreshing={refetching}>
        <NoData message="Wybrane zawody nie posiadają klasyfikacji rodzinnej." />
      </DashboardFrame>
    );
  }

  return (
    <AdminFamilies
      data={data}
      users={users}
      loading={refetching}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onRefresh={handleRefresh}
      onDelete={handleDelete}
    />
  );
};

export default AdminFamiliesWrapper;
