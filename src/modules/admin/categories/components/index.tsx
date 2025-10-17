'use client';

import { UserUI } from '@/lib/types/auth';
import TemplateButton from '@/modules/buttons/TemplateButton';
import Counter from '@/modules/counter/components';
import DashboardTable from '@/modules/table/components';
import { RootState } from '@/store/store';
import { Category, Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaFilter } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { columns } from '../utils/columns';
import AddModal from './AddModal';
import ColorFactory from '@/lib/color/factory';
import { interpolateColor } from '@/lib/color/utils';

type Props = {
  data: Category[];
  loading: boolean;
  onAdd: (_: Category) => Promise<void>;
  onEdit: (_: Category) => Promise<void>;
  onRefresh: () => Promise<void>;
  onDelete: (_: string) => Promise<void>;
};

const AdminCategories = ({ data, loading, onAdd, onEdit, onRefresh, onDelete }: Props) => {
  const totalCount = useMemo(() => data.length, [data]);
  const [filteredTotalCount, setFilteredTotalCount] = useState(data.length);
  const totalColor = useMemo(
    () =>
      interpolateColor(
        [
          { value: 0, color: ColorFactory.getColor('aaaaaa') },
          { value: 1, color: ColorFactory.getColor('ffffff') },
          { value: totalCount, color: ColorFactory.getColor('55ff55') },
        ],
        filteredTotalCount
      ).toHexString(),
    [totalCount, filteredTotalCount]
  );

  useEffect(() => {
    setFilteredTotalCount(data.length);
  }, [data]);

  return (
    <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-visible">
      <DashboardTable
        title="Kategorie wiekowe"
        noDataMessage="Nie znaleziono kategorii."
        data={data}
        refetching={loading}
        columns={columns(loading, onEdit, onDelete)}
        onRefresh={onRefresh}
        cardBodyClassName="overflow-x-visible"
        onFilterChange={(rows) => {
          setFilteredTotalCount(rows.length);
        }}
        cardHeaderRight={
          <>
            <Counter
              value={filteredTotalCount}
              max={totalCount}
              color={totalColor}
              withTooltip
              tooltipText={`Kategorii: ${totalCount} (Filtr: ${filteredTotalCount})`}
            />
            <AddModal loading={loading} onConfirm={onAdd} />
          </>
        }
      />
    </div>
  );
};

export default AdminCategories;
