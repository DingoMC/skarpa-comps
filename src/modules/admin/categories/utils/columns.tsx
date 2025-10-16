import { columnNamesPL } from '@/lib/constants/lang_pl';
import TemplateButton from '@/modules/buttons/TemplateButton';
import ConfirmDialog from '@/modules/dialogs/ConfirmDialog';
import { Category } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { FaCog } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';

const columnHelper = createColumnHelper<Category>();

export const columns = (
  loading: boolean,
  onEdit: (_: Category) => void,
  onDelete: (_: string) => void
) => [
  columnHelper.accessor((row) => row, {
    id: 'actions',
    header: () => (
      <div className="text-left">
        <FaCog className="w-4 h-4" />
      </div>
    ),
    cell: (info) => {
      return (
        <div className="flex items-center gap-1">
          <TemplateButton template="edit" disabled={loading} onClick={() => onEdit(info.getValue())} />
          <ConfirmDialog
            triggerAs="icon"
            trigger={<FaTrash className="w-4 h-4 text-red-600" />}
            loading={loading}
            header="Potwierdź usunięcie kategorii"
            content={`Czy na pewno chcesz usunąć kategorię ${info.getValue().name} wraz z przypisanymi do niej zawodnikami?
                Ta operacja jest nieodwracalna!`}
            onConfirm={() => onDelete(info.getValue().id)}
          />
        </div>
      );
    },
    enableHiding: false,
  }),
  columnHelper.accessor((row) => row.seq, {
    id: 'seq',
    header: () => <div className="text-left">{columnNamesPL.get('seq')}</div>,
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    header: () => <div className="text-left">{columnNamesPL.get('name')}</div>,
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.minAge, {
    id: 'minAge',
    header: () => <div className="text-left">{columnNamesPL.get('minAge')}</div>,
    cell: (info) => info.getValue() ?? '-',
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.maxAge, {
    id: 'maxAge',
    header: () => <div className="text-left">{columnNamesPL.get('maxAge')}</div>,
    cell: (info) => info.getValue() ?? '-',
    enableColumnFilter: true,
    enableSorting: true,
  }),
];
