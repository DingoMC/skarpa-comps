import { columnNamesPL } from "@/lib/constants/lang_pl";
import TemplateButton from "@/modules/buttons/TemplateButton";
import ConfirmDialog from "@/modules/dialogs/ConfirmDialog";
import { Competition } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { FaCog, FaTimes } from "react-icons/fa";
import { FaCheck, FaLock, FaTrash, FaUnlock } from "react-icons/fa6";

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
  columnHelper.accessor((row) => row.isInternal, {
    id: 'isInternal',
    header: () => <div className="text-left">{columnNamesPL.get('isInternal')}</div>,
    cell: (info) => (info.getValue() ? <FaCheck className="w-4 h-4 text-green-800" /> : <FaTimes className="w-4 h-4 text-red-800" />),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.lockEnroll, {
    id: 'lockEnroll',
    header: () => <div className="text-left">{columnNamesPL.get('lockEnroll')}</div>,
    cell: (info) => (info.getValue() ? <FaLock className="w-4 h-4 text-red-800" /> : <FaUnlock className="w-4 h-4 text-green-800" />),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.lockResults, {
    id: 'lockResults',
    header: () => <div className="text-left">{columnNamesPL.get('lockResults')}</div>,
    cell: (info) => (info.getValue() ? <FaLock className="w-4 h-4 text-red-800" /> : <FaUnlock className="w-4 h-4 text-green-800" />),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.allowFamilyRanking, {
    id: 'allowFamilyRanking',
    header: () => <div className="text-left">{columnNamesPL.get('allowFamilyRanking')}</div>,
    cell: (info) => (info.getValue() ? <FaCheck className="w-4 h-4 text-green-800" /> : <FaTimes className="w-4 h-4 text-red-800" />),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.clubMembersPay, {
    id: 'clubMembersPay',
    header: () => <div className="text-left">{columnNamesPL.get('clubMembersPay')}</div>,
    cell: (info) => (info.getValue() ? <FaCheck className="w-4 h-4 text-green-800" /> : <FaTimes className="w-4 h-4 text-red-800" />),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.startDate, {
    id: 'startDate',
    header: () => <div className="text-left">{columnNamesPL.get('startDate')}</div>,
    cell: (info) => new Date(info.getValue()).toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.endDate, {
    id: 'endDate',
    header: () => <div className="text-left">{columnNamesPL.get('endDate')}</div>,
    cell: (info) => new Date(info.getValue()).toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.enrollStart, {
    id: 'enrollStart',
    header: () => <div className="text-left">{columnNamesPL.get('enrollStart')}</div>,
    cell: (info) => new Date(info.getValue()).toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.enrollEnd, {
    id: 'enrollEnd',
    header: () => <div className="text-left">{columnNamesPL.get('enrollEnd')}</div>,
    cell: (info) => new Date(info.getValue()).toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.createdAt, {
    id: 'createdAt',
    header: () => <div className="text-left">{columnNamesPL.get('createdAt')}</div>,
    cell: (info) => new Date(info.getValue()).toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.updatedAt, {
    id: 'updatedAt',
    header: () => <div className="text-left">{columnNamesPL.get('updatedAt')}</div>,
    cell: (info) => new Date(info.getValue()).toLocaleString(),
    enableSorting: true,
  }),
];
