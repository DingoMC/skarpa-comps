'use client';

import { UserUI } from '@/lib/types/auth';
import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardTable from '@/modules/table/components';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { columns } from '../utils/columns';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

type Props = {
  data: UserUI[];
  roles: Role[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onDelete: (_: string) => Promise<void>;
};

const AdminUsers = ({ data, roles, loading, onRefresh, onDelete }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const authLevel = useSelector((state: RootState) => state.auth.authLevel);
  const router = useRouter();

  const handleAddClick = () => {
    router.push('/admin/users/new');
  };

  const handleEditClick = (id: string) => {
    router.push(`/admin/users/${id}`);
  };

  return (
    <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-scroll">
      <DashboardTable
        title="Użytkownicy"
        noDataMessage="Nie znaleziono uzytkowników."
        data={data}
        refetching={loading}
        columns={columns(roles, user?.email ?? '', authLevel, loading, handleEditClick, onDelete)}
        onRefresh={onRefresh}
        cardHeaderRight={<TemplateButton template="add" disabled={loading} onClick={handleAddClick} message="Nowy użytkownik" />}
      />
    </div>
  );
};

export default AdminUsers;
