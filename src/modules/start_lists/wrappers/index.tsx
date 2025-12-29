'use client';

import { StartListEntry } from '@/lib/types/startList';
import { getAllCategories } from '@/modules/comp_signups/requests';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { getAllCompetitions } from '@/modules/main/requests';
import { getAllRoles } from '@/modules/roles/requests';
import { Category, Competition, Role } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import StartLists from '../components';
import { getStartList } from '../requests';

const StartListsWrapper = () => {
  const [available, setAvailable] = useState<Competition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [data, setData] = useState<StartListEntry[]>([]);
  const [selected, setSelected] = useState<Competition>();
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const params = useSearchParams();

  const loadData = async () => {
    const resp = await getAllCompetitions();
    const resp2 = await getAllCategories();
    const resp3 = await getAllRoles();
    if (resp3.error !== null) {
      toast.error(resp3.error);
      setRoles([]);
    } else setRoles(resp3.data);
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setCategories([]);
    } else setCategories(resp2.data);
    if (resp.error !== null) {
      toast.error(resp.error);
      setAvailable([]);
    } else setAvailable(resp.data);
  };

  const loadStartList = async () => {
    if (!selected) {
      setLoading(false);
      return;
    }
    if (!loading) setRefetching(true);
    const resp = await getStartList(selected.id);
    if (resp.error !== null) {
      toast.error(resp.error);
      setData([]);
    } else setData(resp.data);
    setLoading(false);
    setRefetching(false);
  };

  const handleSelectChange = (id: string) => {
    const found = available.find((c) => c.id === id);
    if (found) setSelected({ ...found });
  };

  const handleRefresh = async () => {
    await loadStartList();
  };

  useEffect(() => {
    if (selected) loadStartList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const id = params.get('id');
    if (available.length) {
      const found = id !== null ? available.find((c) => c.id === id) : undefined;
      if (found) {
        setSelected({ ...found });
      } else {
        setSelected({ ...available[0] });
      }
    }
  }, [available, params]);

  if (loading) {
    return <DashboardSpinner title="Lista startowa" refreshing={loading} />;
  }

  if (!available.length || !selected) {
    return (
      <DashboardFrame title="Lista startowa">
        <NoData message="Brak zawodów." />
      </DashboardFrame>
    );
  }

  return (
    <StartLists
      data={data}
      roles={roles}
      categories={categories}
      competitions={available}
      loading={refetching}
      selectedComp={selected}
      onRefresh={handleRefresh}
      handleSelectComp={handleSelectChange}
    />
  );
};

export default StartListsWrapper;
