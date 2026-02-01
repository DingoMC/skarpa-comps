import { columnNamesPL } from '@/lib/constants/lang_pl';
import { Popover, Typography } from '@/lib/mui';
import { displayFullName } from '@/lib/text';
import { StartListAdmin } from '@/lib/types/startList';
import ConfirmDialog from '@/modules/dialogs/ConfirmDialog';
import { createColumnHelper } from '@tanstack/react-table';
import { FaCog } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import EditModal from '../components/EditModal';
import { AdminFamily } from '../types';

const columnHelper = createColumnHelper<AdminFamily>();

export const columns = (
  data: AdminFamily[],
  users: StartListAdmin[],
  loading: boolean,
  onEdit: (_i: string, _n: string, _ucid: string[]) => Promise<void>,
  onDelete: (_: string) => void
) => [
  columnHelper.accessor((row) => row, {
    id: 'actions',
    size: 5,
    header: () => (
      <div className="text-left">
        <FaCog className="w-4 h-4" />
      </div>
    ),
    cell: (info) => {
      const otherFamilies = data.filter((af) => af.id !== info.getValue().id);
      const usersAlreadyMembers = otherFamilies.flatMap((af) => af.userFamilies.map((v) => v.userCompId));
      return (
        <div className="flex items-center gap-1">
          <EditModal
            data={info.getValue()}
            users={users.filter((v) => !usersAlreadyMembers.includes(v.id))}
            loading={loading}
            onConfirm={onEdit}
          />
          <ConfirmDialog
            triggerAs="icon"
            trigger={<FaTrash className="w-4 h-4 text-red-600" />}
            loading={loading}
            header="Potwierdź usunięcie rodziny"
            content={`Czy na pewno chcesz usunąć rodzinę '${info.getValue().name}'? Ta operacja jest nieodwracalna!`}
            onConfirm={() => onDelete(info.getValue().id)}
          />
        </div>
      );
    },
    enableHiding: false,
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    header: () => <div className="text-left">{columnNamesPL.get('name')}</div>,
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.userFamilies, {
    id: 'userFamilies',
    header: () => <div className="text-left">{columnNamesPL.get('userFamilies')}</div>,
    cell: (info) => {
      const members = info.getValue().map((v) => v.userCompId);
      const membersData = users.filter((v) => members.includes(v.id));
      if (!membersData.length) return '-';
      return (
        <Popover placement="bottom">
          <Popover.Trigger as={Typography} className="text-xs underline text-green-950 cursor-pointer w-fit">
            {membersData.length}
          </Popover.Trigger>
          <Popover.Content className="max-w-xs flex flex-col gap-px">
            {membersData.map((m) => (
              <Typography key={m.id} className="text-xs">
                {displayFullName(m.user.firstName, m.user.lastName)}
              </Typography>
            ))}
          </Popover.Content>
          <Popover.Arrow />
        </Popover>
      );
    },
  }),
];
