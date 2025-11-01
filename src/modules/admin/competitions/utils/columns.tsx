import { columnNamesPL } from '@/lib/constants/lang_pl';
import { Tooltip, Typography } from '@/lib/mui';
import { showDate } from '@/lib/text';
import TemplateButton from '@/modules/buttons/TemplateButton';
import ConfirmDialog from '@/modules/dialogs/ConfirmDialog';
import { Competition } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { FaCog, FaDollarSign } from 'react-icons/fa';
import { FaTrash, FaUserLock } from 'react-icons/fa6';
import { MdFamilyRestroom, MdOutlineMailLock } from 'react-icons/md';
import { TbSquareLetterS } from 'react-icons/tb';

const columnHelper = createColumnHelper<Competition>();

export const columns = (loading: boolean, onEdit: (_: string) => void, onDelete: (_: string) => void) => [
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
            header="Potwierdź usunięcie zawodów"
            content={`Czy na pewno chcesz usunąć zawody ${info.getValue().name} wraz ze wszystkimi wynikami?
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
  columnHelper.accessor((row) => row, {
    id: 'flags',
    header: () => <div className="text-left">{columnNamesPL.get('flags')}</div>,
    cell: (info) => {
      const { isInternal, lockEnroll, lockResults, allowFamilyRanking, clubMembersPay } = info.getValue();
      return (
        <div className="flex gap-1 items-center">
          {isInternal && (
            <Tooltip>
              <Tooltip.Trigger>
                <TbSquareLetterS className="w-5 h-5 cursor-pointer text-skarpa-500" />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Typography className="text-xs">Zawody Wewnętrzne</Typography>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip>
          )}
          {lockEnroll && (
            <Tooltip>
              <Tooltip.Trigger>
                <FaUserLock className="w-5 h-5 cursor-pointer text-red-600" />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Typography className="text-xs">Zapisy manualnie zablokowane</Typography>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip>
          )}
          {lockResults && (
            <Tooltip>
              <Tooltip.Trigger>
                <MdOutlineMailLock className="w-5 h-5 cursor-pointer text-red-600" />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Typography className="text-xs">Wpisywanie wyników manualnie zablokowane</Typography>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip>
          )}
          {allowFamilyRanking && (
            <Tooltip>
              <Tooltip.Trigger>
                <MdFamilyRestroom className="w-5 h-5 cursor-pointer text-purple-900" />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Typography className="text-xs">Klasyfikacja Rodzinna</Typography>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip>
          )}
          {clubMembersPay && (
            <Tooltip>
              <Tooltip.Trigger>
                <FaDollarSign className="w-5 h-5 cursor-pointer text-amber-800" />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Typography className="text-xs">Członkowie klubu Skarpa / SP28 Płacą</Typography>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor((row) => row.startDate, {
    id: 'startDate',
    header: () => <div className="text-left">{columnNamesPL.get('startDate')}</div>,
    cell: (info) => showDate(info.getValue(), false),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.endDate, {
    id: 'endDate',
    header: () => <div className="text-left">{columnNamesPL.get('endDate')}</div>,
    cell: (info) => showDate(info.getValue(), false),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.enrollStart, {
    id: 'enrollStart',
    header: () => <div className="text-left">{columnNamesPL.get('enrollStart')}</div>,
    cell: (info) => showDate(info.getValue(), false),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.enrollEnd, {
    id: 'enrollEnd',
    header: () => <div className="text-left">{columnNamesPL.get('enrollEnd')}</div>,
    cell: (info) => showDate(info.getValue(), false),
    enableSorting: true,
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
