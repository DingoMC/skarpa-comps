'use client';

import { StartListAdmin } from '@/lib/types/startList';
import DashboardTable from '@/modules/table/components';
import { AdminFamily } from '../types';
import { columns } from '../utils/columns';
import AddModal from './AddModal';

type Props = {
  data: AdminFamily[];
  users: StartListAdmin[];
  loading: boolean;
  onCreate: (_n: string, _ucid: string[]) => Promise<void>;
  onUpdate: (_i: string, _n: string, _ucid: string[]) => Promise<void>;
  onRefresh: () => Promise<void>;
  onDelete: (_: string) => Promise<void>;
};

const AdminFamilies = ({ data, users, loading, onCreate, onUpdate, onRefresh, onDelete }: Props) => {
  return (
    <div className="max-w-screen md:max-w-[calc(100vw-232px)] overflow-y-visible">
      <DashboardTable
        title="Rodziny"
        noDataMessage="Nie znaleziono rodzin dla wybranych zawodów."
        data={data}
        refetching={loading}
        columns={columns(data, users, loading, onUpdate, onDelete)}
        onRefresh={onRefresh}
        cardBodyClassName="overflow-x-visible"
        cardHeaderRight={
          <>
            <AddModal loading={loading} data={data} users={users} onConfirm={onCreate} />
          </>
        }
      />
    </div>
  );
};

export default AdminFamilies;
