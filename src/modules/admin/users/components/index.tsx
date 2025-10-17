'use client';

import Color, { interpolateColor } from '@/lib/color';
import { UserUI } from '@/lib/types/auth';
import TemplateButton from '@/modules/buttons/TemplateButton';
import Counter from '@/modules/counter/components';
import DashboardTable from '@/modules/table/components';
import { RootState } from '@/store/store';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaFilter } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { columns } from '../utils/columns';

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
  const totalCount = useMemo(() => data.length, [data]);
  const accountCount = useMemo(() => data.filter((v) => v.hasAccount).length, [data]);
  const [filteredTotalCount, setFilteredTotalCount] = useState(data.length);
  const [filteredAccountCount, setFilteredAccountCount] = useState(data.filter((v) => v.hasAccount).length);
  const totalColor = useMemo(
    () =>
      interpolateColor(
        [
          { value: 0, color: new Color('aaaaaa') },
          { value: 1, color: new Color('ffffff') },
          { value: totalCount, color: new Color('55ff55') },
        ],
        accountCount
      ).toHexString(),
    [totalCount, accountCount]
  );
  const filteredColor = useMemo(
    () =>
      interpolateColor(
        [
          { value: 0, color: new Color('88bbbb') },
          { value: 1, color: new Color('eeffff') },
          { value: filteredTotalCount, color: new Color('55ffff') },
        ],
        filteredAccountCount
      ).toHexString(),
    [filteredTotalCount, filteredAccountCount]
  );

  useEffect(() => {
    setFilteredTotalCount(data.length);
    setFilteredAccountCount(data.filter((v) => v.hasAccount).length);
  }, [data]);

  const handleAddClick = () => {
    router.push('/admin/users/new');
  };

  const handleEditClick = (id: string) => {
    router.push(`/admin/users/${id}`);
  };

  return (
    <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-visible">
      <DashboardTable
        title="Użytkownicy"
        noDataMessage="Nie znaleziono uzytkowników."
        data={data}
        refetching={loading}
        columns={columns(roles, user?.email ?? '', authLevel, loading, handleEditClick, onDelete)}
        onRefresh={onRefresh}
        cardBodyClassName="overflow-x-visible"
        onFilterChange={(rows) => {
          setFilteredTotalCount(rows.length);
          setFilteredAccountCount(rows.filter((r) => r.original.hasAccount).length);
        }}
        cardHeaderRight={
          <>
            {filteredTotalCount !== totalCount && (
              <Counter
                value={filteredAccountCount}
                max={filteredTotalCount}
                color={filteredColor}
                withTooltip
                tooltipText={`Użytkownicy: ${filteredTotalCount} (Posiada konto: ${filteredAccountCount}) (Filtrowane)`}
                iconLeft={<FaFilter className="mr-1" />}
              />
            )}
            <Counter
              value={accountCount}
              max={totalCount}
              color={totalColor}
              withTooltip
              tooltipText={`Użytkownicy: ${totalCount} (Posiada konto: ${accountCount})`}
            />
            <TemplateButton template="add" disabled={loading} onClick={handleAddClick} message="Nowy użytkownik" />
          </>
        }
      />
    </div>
  );
};

export default AdminUsers;
