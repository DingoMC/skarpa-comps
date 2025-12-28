import { columnNamesPL } from '@/lib/constants/lang_pl';
import { Popover, Typography } from '@/lib/mui';
import { showDate } from '@/lib/text';
import { TaskCategoryIds } from '@/lib/types/task';
import TemplateButton from '@/modules/buttons/TemplateButton';
import ConfirmDialog from '@/modules/dialogs/ConfirmDialog';
import { generateCategoryLabel } from '@/modules/inputs/components/CategorySelector';
import { Category } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { FaCog } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';

const columnHelper = createColumnHelper<TaskCategoryIds>();

export const columns = (loading: boolean, categories: Category[], onEdit: (_: string) => void, onDelete: (_: string) => void) => [
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
          <TemplateButton template="edit" disabled={loading} onClick={() => onEdit(info.getValue().id)} />
          <ConfirmDialog
            triggerAs="icon"
            trigger={<FaTrash className="w-4 h-4 text-red-600" />}
            loading={loading}
            header="Potwierdź usunięcie zadania"
            content={`Czy na pewno chcesz usunąć zadanie "${info.getValue().name}" wraz z powiązanymi wynikami?
            Ta operacja jest nieodwracalna!`}
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
  columnHelper.accessor((row) => row.shortName, {
    id: 'shortName',
    header: () => <div className="text-left">{columnNamesPL.get('shortName')}</div>,
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.type, {
    id: 'type',
    header: () => <div className="text-left">{columnNamesPL.get('type')}</div>,
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.categories, {
    id: 'categories',
    header: () => <div className="text-left">{columnNamesPL.get('categories')}</div>,
    cell: (info) => {
      const currCatIds = info.getValue().map((v) => v.categoryId);
      const catNames = categories
        .filter((v) => currCatIds.includes(v.id))
        .map((v) => ({ id: v.id, label: generateCategoryLabel(v, true) }));
      if (!currCatIds.length) return '-';
      return (
        <Popover placement="bottom">
          <Popover.Trigger as={Typography} className="text-xs underline text-green-950 cursor-pointer">
            {currCatIds.length}
          </Popover.Trigger>
          <Popover.Content className="max-w-xs flex flex-col gap-px">
            {catNames.map((c) => (
              <Typography key={c.id} className="text-xs">
                {c.label}
              </Typography>
            ))}
          </Popover.Content>
          <Popover.Arrow />
        </Popover>
      );
    },
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    header: () => <div className="text-left">{columnNamesPL.get('createdAt')}</div>,
    cell: (info) => showDate(info.getValue(), true),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.updatedAt, {
    id: 'updatedAt',
    header: () => <div className="text-left">{columnNamesPL.get('updatedAt')}</div>,
    cell: (info) => showDate(info.getValue(), true),
    enableSorting: true,
  }),
];
