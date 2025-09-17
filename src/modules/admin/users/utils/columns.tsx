import { columnNamesPL } from '@/lib/constants/lang_pl';
import { transformName } from '@/lib/text';
import { UserUI } from '@/lib/types/auth';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<UserUI>();

export const columns = () => [
  columnHelper.accessor((row) => row.email, {
    id: 'email',
    header: () => <div className="text-left">{columnNamesPL.get('email')}</div>,
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.firstName, {
    id: 'firstName',
    header: () => <div className="text-left">{columnNamesPL.get('firstName')}</div>,
    cell: (info) => transformName(info.getValue()),
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => <div className="text-left">{columnNamesPL.get('lastName')}</div>,
    cell: (info) => transformName(info.getValue()),
    enableColumnFilter: true,
    enableSorting: true,
  }),
];
