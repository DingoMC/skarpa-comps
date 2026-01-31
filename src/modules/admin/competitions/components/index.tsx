'use client';

import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardTable from '@/modules/table/components';
import { Competition } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { columns } from '../utils/columns';

type Props = {
  data: Competition[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onDelete: (_: string) => Promise<void>;
};

const AdminCompetitions = ({ data, loading, onRefresh, onDelete }: Props) => {
  const router = useRouter();

  const handleAddClick = () => {
    router.push('/admin/competitions/new');
  };

  const handleEditClick = (id: string) => {
    router.push(`/admin/competitions/${id}`);
  };

  return (
    <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-visible">
      <DashboardTable
        title="Zawody"
        noDataMessage="Nie znaleziono zawodów."
        data={data}
        refetching={loading}
        columns={columns(loading, handleEditClick, onDelete)}
        onRefresh={onRefresh}
        cardBodyClassName="overflow-x-visible"
        cardHeaderRight={<TemplateButton template="add" disabled={loading} onClick={handleAddClick} message="Nowe zawody" />}
      />
    </div>
  );
};

export default AdminCompetitions;
