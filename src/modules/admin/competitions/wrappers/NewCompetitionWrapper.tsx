'use client';

import { Category, Competition } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllCategoriesAdmin } from '../../categories/requests';
import NewCompetition from '../components/NewCompetition';
import { createCompetitionAdmin } from '../requests';

const NewCompetitionWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const handleAdd = async (compData: Competition) => {
    setRefetching(true);
    const { success, error } = await createCompetitionAdmin(compData);
    if (success && error === null) {
      toast.success('Zawody utworzone pomyślnie.');
      router.push('/admin/competitions');
      return;
    }
    toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    setRefetching(false);
  };

  const loadData = async () => {
    const resp2 = await getAllCategoriesAdmin();
    if (resp2.error !== null) {
      toast.error(resp2.error);
      setCategories([]);
    } else setCategories(resp2.data);
    setLoading(false);
  };

  const handleBack = () => {
    router.push('/admin/competitions');
  };

  useEffect(() => {
    loadData();
  }, []);

  return <NewCompetition loading={refetching} categories={categories} handleAdd={handleAdd} handleBack={handleBack} />;
};

export default NewCompetitionWrapper;
