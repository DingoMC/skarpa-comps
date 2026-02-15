'use client';

import { Competition } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import NewCompetition from '../components/NewCompetition';
import { createCompetitionAdmin } from '../requests';

const NewCompetitionWrapper = () => {
  const [refetching, setRefetching] = useState(false);
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

  const handleBack = () => {
    router.push('/admin/competitions');
  };

  return <NewCompetition loading={refetching} categories={[]} handleAdd={handleAdd} handleBack={handleBack} />;
};

export default NewCompetitionWrapper;
