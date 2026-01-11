'use client';

import { StartListAdmin } from '@/lib/types/startList';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { RootState } from '@/store/store';
import { Category, Competition, Role } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllCategoriesAdmin } from '../../categories/requests';
import { getCompetitionByIdAdmin } from '../../competitions/requests';
import { getAllRolesAdmin } from '../../users/requests';
import AdminEnrolls from '../components';
import { deleteEnrollAdmin, getStartListAdmin, renumberEnrolls } from '../requests';
import { EnrollReNumberReq } from '@/lib/types/enroll';

const AdminEnrollsWrapper = () => {
  const currCompId = useSelector((state: RootState) => state.competition.id);
  const [competition, setCompetition] = useState<Competition>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [data, setData] = useState<StartListAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [renumbering, setRenumbering] = useState(false);

  const loadData = async () => {
    if (!currCompId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const resp = await getStartListAdmin(currCompId);
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
    const resp3 = await getAllRolesAdmin();
    if (resp3.error !== null) {
      toast.error(resp3.error);
      setRoles([]);
    } else {
      setRoles(resp3.data);
    }
    const resp4 = await getCompetitionByIdAdmin(currCompId);
    if (resp4.error !== null) {
      toast.error(resp4.error);
      setCompetition(undefined);
    } else {
      setCompetition(resp4.data);
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
    const resp = await deleteEnrollAdmin(id);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success('Wpis został usunięty pomyślnie.');
      await loadData();
    }
    setRefetching(false);
  };

  const handleRenumber = async (reqData: EnrollReNumberReq) => {
    if (!currCompId) return;
    setRefetching(true);
    setRenumbering(true);
    const resp = await renumberEnrolls(currCompId, reqData);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success(resp.data);
      await loadData();
    }
    setRefetching(false);
    setRenumbering(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currCompId]);

  if (loading) {
    return <DashboardSpinner title="Lista Startowa" refreshing={loading} />;
  }

  if (!currCompId || !competition) {
    return (
      <DashboardFrame title="Lista Startowa">
        <NoData message="Nie wybrano zawodów. Wybierz zawody lub utwórz nowe." />
      </DashboardFrame>
    );
  }

  return (
    <AdminEnrolls
      data={data}
      competition={competition}
      categories={categories}
      roles={roles}
      loading={refetching}
      onRefresh={handleRefresh}
      onDelete={handleDelete}
      onRenumber={handleRenumber}
      renumbering={renumbering}
    />
  );
};

export default AdminEnrollsWrapper;
