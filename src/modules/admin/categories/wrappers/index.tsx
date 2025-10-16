'use client';

import DashboardSpinner from '@/modules/dashboard/components/Spinner';
import { Category } from '@prisma/client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminCategories from '../components';
import { createCategoryAdmin, deleteCategoryAdmin, getAllCategoriesAdmin, updateCategoryAdmin } from '../requests';

const AdminCategoriesWrapper = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);

  const loadData = async () => {
    const resp = await getAllCategoriesAdmin();
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

  const handleCreate = async (data: Category) => {
    setRefetching(true);
    const resp = await createCategoryAdmin(data);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success('Kategoria została utworzona pomyślnie.');
      await loadData();
    }
    setRefetching(false);
  };

  const handleUpdate = async (data: Category) => {
    setRefetching(true);
    const resp = await updateCategoryAdmin(data);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success('Kategoria została zaktualizowana pomyślnie.');
      await loadData();
    }
    setRefetching(false);
  };

  const handleDelete = async (id: string) => {
    setRefetching(true);
    const resp = await deleteCategoryAdmin(id);
    if (resp.error !== null) {
      toast.error(resp.error);
    } else {
      toast.success('Kategoria została usunięta pomyślnie.');
      await loadData();
    }
    setRefetching(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <DashboardSpinner title="Kategorie" refreshing={loading} />;
  }

  return (
    <AdminCategories
      data={data}
      loading={refetching}
      onAdd={handleCreate}
      onEdit={handleUpdate}
      onRefresh={handleRefresh}
      onDelete={handleDelete}
    />
  );
};

export default AdminCategoriesWrapper;
