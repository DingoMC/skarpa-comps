'use client';

import { UserUI } from '@/lib/types/auth';
import DashboardTable from '@/modules/table/components';
import { Role } from '@prisma/client';
import { columns } from '../utils/columns';

type Props = {
  data: UserUI[];
  roles: Role[];
  loading: boolean;
  onRefresh: () => Promise<void>;
};

const AdminUsers = ({ data, loading, onRefresh }: Props) => (
  <DashboardTable
    title="Użytkownicy"
    noDataMessage="Nie znaleziono uzytkowników."
    data={data}
    refetching={loading}
    columns={columns()}
    onRefresh={onRefresh}
  />
);

export default AdminUsers;
