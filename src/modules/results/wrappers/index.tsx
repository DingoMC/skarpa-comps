'use client';

import { ResultsSummary } from '@/lib/types/results';
import { getAllCategories } from '@/modules/comp_signups/requests';
import DashboardFrame from '@/modules/dashboard/components';
import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import NoData from '@/modules/lottie/NoData';
import { getAllCompetitions } from '@/modules/main/requests';
import { getAllRoles } from '@/modules/roles/requests';
import { Category, Competition, Role, Task } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Results from '../components';
import { getResults } from '../results';

const ResultsWrapper = () => {
  const [available, setAvailable] = useState<Competition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [data, setData] = useState<{ men: ResultsSummary[]; women: ResultsSummary[]; tasks: Task[] }>();
  const [selectedComp, setSelectedComp] = useState<Competition>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
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

  const loadResults = async () => {
    if (!selectedComp || !selectedCategory) {
      setLoading(false);
      return;
    }
    if (!loading) setRefetching(true);
    const resp = await getResults(selectedComp.id, selectedCategory.id);
    if (resp.error !== null) {
      toast.error(resp.error);
      setData(undefined);
    } else setData({ ...resp.data });
    setLoading(false);
    setRefetching(false);
  };

  const handleSelectCompChange = (id: string) => {
    const found = available.find((c) => c.id === id);
    if (found) setSelectedComp({ ...found });
  };

  const handleSelectCategoryChange = (id: string) => {
    const found = categories.find((c) => c.id === id);
    if (found) setSelectedCategory({ ...found });
  };

  const handleRefresh = async () => {
    await loadResults();
  };

  useEffect(() => {
    if (selectedComp && selectedCategory) loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComp, selectedCategory]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const id = params.get('id');
    if (available.length) {
      const found = id !== null ? available.find((c) => c.id === id) : undefined;
      if (found) {
        setSelectedComp({ ...found });
      } else {
        setSelectedComp({ ...available[0] });
      }
    }
  }, [available, params]);

  useEffect(() => {
    if (categories.length) {
      setSelectedCategory({ ...categories[0] });
    }
  }, [categories]);

  if (loading) {
    return <DashboardSpinner title="Wyniki" refreshing={loading} />;
  }

  if (!available.length || !selectedComp) {
    return (
      <DashboardFrame title="Wyniki">
        <NoData message="Brak zawodów." />
      </DashboardFrame>
    );
  }

  if (!categories.length || !selectedCategory) {
    return (
      <DashboardFrame title={`Wyniki - ${selectedComp.name}`}>
        <NoData message="Brak wybranej kategorii." />
      </DashboardFrame>
    );
  }

  if (!data) {
    return (
      <DashboardFrame title={`Wyniki - ${selectedComp.name}`}>
        <NoData message="Brak wybranej kategorii." />
      </DashboardFrame>
    );
  }

  return (
    <Results
      data={data}
      roles={roles}
      categories={categories}
      competitions={available}
      loading={refetching}
      selectedComp={selectedComp}
      selectedCategory={selectedCategory}
      onRefresh={handleRefresh}
      onChangeComp={handleSelectCompChange}
      onChangeCategory={handleSelectCategoryChange}
    />
  );
};

export default ResultsWrapper;
