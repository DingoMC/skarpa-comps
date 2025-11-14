'use client';

import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import { Competition } from '@prisma/client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllCompetitions } from '../requests';
import MainPage from '../components';
import { CompetitionWithMemberCount } from '@/lib/types/competition';

const MainPageWrapper = () => {
  const [data, setData] = useState<CompetitionWithMemberCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);

  const loadData = async () => {
    const resp = await getAllCompetitions();
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

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <DashboardSpinner title="Harmonogram wydarzeń" refreshing={loading} />;
  }

  return <MainPage data={data} loading={refetching} onRefresh={handleRefresh} />;
};

export default MainPageWrapper;
