'use client';

import { UserUI } from '@/lib/types/auth';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import { Role } from '@prisma/client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminUsers from '../components';
import { getAllRolesAdmin, getAllUsersAdmin } from '../requests';

const AdminUsersWrapper = () => {
  const [data, setData] = useState<UserUI[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);

  const loadData = async (withoutRoles?: boolean) => {
    const resp = await getAllUsersAdmin();
    if (resp.error !== null) {
      toast.error(resp.error);
      setData([]);
    } else setData(resp.data);
    if (withoutRoles) {
      setLoading(false);
      return;
    }
    const resp2 = await getAllRolesAdmin();
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setRoles([]);
    } else setRoles(resp2.data);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefetching(true);
    await loadData(true);
    setRefetching(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <DashboardSpinner title="Users" refreshing={loading} />;
  }

  return <AdminUsers data={data} roles={roles} loading={refetching} onRefresh={handleRefresh} />;
};

export default AdminUsersWrapper;
