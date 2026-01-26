'use client';

import { TaskCategoryIds } from '@/lib/types/task';
import TemplateButton from '@/modules/buttons/TemplateButton';
import { TASK_TYPES } from '@/modules/inputs/components/TaskTypeSelector';
import DashboardTable from '@/modules/table/components';
import { Category, TaskScoringTemplate } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { columns } from '../utils/columns';
import TaskTemplatesPopover from './TaskTemplatesPopover';

type Props = {
  data: TaskCategoryIds[];
  categories: Category[];
  templates: TaskScoringTemplate[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onDelete: (_: string) => Promise<void>;
  onDeleteTemplate: (_: string) => Promise<void>;
};

const AdminTasks = ({ data, categories, loading, templates, onRefresh, onDelete, onDeleteTemplate }: Props) => {
  const router = useRouter();

  const handleAddClick = () => {
    router.push(`/admin/tasks/new`);
  };

  const handleCloneClick = (id: string) => {
    router.push(`/admin/tasks/new?clone_from=${id}`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/admin/tasks/${id}`);
  };

  const handleEditResultsClick = (id: string) => {
    router.push(`/admin/tasks/${id}/results`);
  };

  return (
    <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-visible">
      <DashboardTable
        title="Zadania"
        noDataMessage="Nie znaleziono zadań dla wybranych zawodów."
        data={data}
        refetching={loading}
        columns={columns(loading, categories, handleEditClick, handleEditResultsClick, handleCloneClick, onDelete)}
        onRefresh={onRefresh}
        cardBodyClassName="overflow-x-visible"
        customFilterInputs={[{ columnId: 'type', type: 'select', options: TASK_TYPES }]}
        cardHeaderRight={
          <>
            <TemplateButton template="add" disabled={loading} onClick={handleAddClick} message="Nowe zadanie" />
            <TaskTemplatesPopover loading={loading} templates={templates} onDelete={onDeleteTemplate} />
          </>
        }
      />
    </div>
  );
};

export default AdminTasks;
