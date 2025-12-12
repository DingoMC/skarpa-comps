'use client';

import { TaskCategoryIds } from '@/lib/types/task';
import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardTable from '@/modules/table/components';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { columns } from '../utils/columns';

type Props = {
  data: TaskCategoryIds[];
  categories: Category[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onDelete: (_: string) => Promise<void>;
};

const AdminTasks = ({ data, categories, loading, onRefresh, onDelete }: Props) => {
  const router = useRouter();

  const handleAddClick = () => {
    router.push(`/admin/tasks/new`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/admin/tasks/${id}`);
  };

  return (
    <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-visible">
      <DashboardTable
        title="Zadania"
        noDataMessage="Nie znaleziono zadań dla wybranych zawodów."
        data={data}
        refetching={loading}
        columns={columns(loading, categories, handleEditClick, onDelete)}
        onRefresh={onRefresh}
        cardBodyClassName="overflow-x-visible"
        cardHeaderRight={<TemplateButton template="add" disabled={loading} onClick={handleAddClick} message="Nowe zadanie" />}
      />
    </div>
  );
};

export default AdminTasks;
