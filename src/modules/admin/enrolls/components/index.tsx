import { Typography } from '@/lib/mui';
import { EnrollReNumberReq } from '@/lib/types/enroll';
import { StartListAdmin } from '@/lib/types/startList';
import TemplateButton from '@/modules/buttons/TemplateButton';
import SelectCategoryOptional from '@/modules/inputs/components/CategorySelectorOptional';
import DashboardTable from '@/modules/table/components';
import { Category, Competition, Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { columns } from '../utils/columns';
import RenumberDialog from './RenumberDialog';

type Props = {
  data: StartListAdmin[];
  competition: Competition;
  roles: Role[];
  categories: Category[];
  loading: boolean;
  renumbering: boolean;
  onDelete: (_: string) => Promise<void>;
  onRenumber: (_: EnrollReNumberReq) => Promise<void>;
  onRefresh: () => Promise<void>;
};

const AdminEnrolls = ({ data, competition, roles, categories, loading, renumbering, onRefresh, onDelete, onRenumber }: Props) => {
  const [filterCatgoryId, setFilterCategoryId] = useState<string | null>(null);
  const router = useRouter();

  const handleAddClick = () => {
    router.push(`/admin/enrolls/new`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/admin/enrolls/${id}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5 max-w-[200px] mt-2">
        <Typography className="text-xs">(Filtr Kategorii)</Typography>
        <SelectCategoryOptional
          categories={categories}
          value={filterCatgoryId}
          onChange={(v) => setFilterCategoryId(v)}
          disabled={loading}
        />
      </div>
      <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-visible">
        <DashboardTable
          title="Lista Startowa"
          noDataMessage="Nie znaleziono zawodników. Zmień filtry lub wybierz inne zawody."
          data={data.filter((d) => d.categoryId === filterCatgoryId || filterCatgoryId === null)}
          refetching={loading}
          columns={columns(loading, categories, roles, competition, handleEditClick, onDelete)}
          onRefresh={onRefresh}
          cardBodyClassName="overflow-x-visible"
          cardHeaderRight={
            <>
              <RenumberDialog data={data} loading={loading} renumbering={renumbering} onConfirmRenumber={onRenumber} />
              <TemplateButton template="add" disabled={loading} onClick={handleAddClick} message="Nowy wpis na zawody" />
            </>
          }
        />
      </div>
    </div>
  );
};

export default AdminEnrolls;
