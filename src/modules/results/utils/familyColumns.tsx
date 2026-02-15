import { SUPER_ADMIN_AUTH_LEVEL } from '@/lib/constants';
import { columnNamesPL } from '@/lib/constants/lang_pl';
import { Typography } from '@/lib/mui';
import { transformName } from '@/lib/text';
import { FamilyResultsPartial, FamilyResultsSummary } from '@/lib/types/results';
import SparkleText from '@/modules/decoration/components/SparkleText';
import { Role } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { FaChevronDown, FaChevronRight, FaMinus } from 'react-icons/fa6';

const columnHelper = createColumnHelper<FamilyResultsSummary>();
const nestedColumnHelper = createColumnHelper<FamilyResultsPartial>();

export const columns = () => [
  columnHelper.accessor((row) => row, {
    id: 'action',
    size: 5,
    header: ({ table }) => (
      <button type="button" className="flex cursor-pointer" onClick={table.getToggleAllRowsExpandedHandler()}>
        {table.getIsAllRowsExpanded() ? <FaMinus /> : <FaChevronRight />}
      </button>
    ),
    cell: ({ row }) => (
      <button type="button" className="flex cursor-pointer" onClick={() => row.toggleExpanded()}>
        {row.original.members.length ? <div>{row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}</div> : null}
      </button>
    ),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.place, {
    id: 'place',
    header: () => <div className="text-left">{columnNamesPL.get('place')}</div>,
    cell: (info) => <Typography className="font-semibold text-xs">{info.getValue().toFixed(0)}</Typography>,
    enableSorting: true,
    enableHiding: false,
    size: 5,
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    header: () => <div className="text-left">{columnNamesPL.get('family')}</div>,
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    enableSorting: true,
    enableHiding: false,
  }),
  columnHelper.accessor((row) => row.score, {
    id: 'score',
    header: () => <div className="text-left">{columnNamesPL.get('score')}</div>,
    cell: (info) => <Typography className="font-semibold text-xs">{info.getValue().toFixed(0)}</Typography>,
    enableColumnFilter: true,
    enableSorting: true,
    size: 5,
  }),
];

export const nestedFamilyColumns = (roles: Role[]) => [
  nestedColumnHelper.accessor((row) => row.startNumber, {
    id: 'startNumber',
    header: () => <div className="text-left">{columnNamesPL.get('startNumber')}</div>,
    cell: (info) => {
      if (!info.getValue()) return '-';
      return info.getValue().toFixed(0);
    },
    size: 5,
  }),
  nestedColumnHelper.accessor((row) => row.user.firstName, {
    id: 'firstName',
    header: () => <div className="text-left">{columnNamesPL.get('firstName')}</div>,
    cell: (info) => {
      const { roleId } = info.row.original.user;
      const authLevel = roles.find((r) => r.id === roleId)?.authLevel ?? 0;
      if (authLevel >= SUPER_ADMIN_AUTH_LEVEL) {
        return (
          <SparkleText id={`${info.row.original.id}-firstName`} textClassName="text-purple-950">
            {transformName(info.getValue())}
          </SparkleText>
        );
      }
      return transformName(info.getValue());
    },
  }),
  nestedColumnHelper.accessor((row) => row.user.lastName, {
    id: 'lastName',
    header: () => <div className="text-left">{columnNamesPL.get('lastName')}</div>,
    cell: (info) => {
      const { roleId } = info.row.original.user;
      const authLevel = roles.find((r) => r.id === roleId)?.authLevel ?? 0;
      if (authLevel >= SUPER_ADMIN_AUTH_LEVEL) {
        return (
          <SparkleText id={`${info.row.original.id}-lastName`} textClassName="text-purple-950">
            {transformName(info.getValue())}
          </SparkleText>
        );
      }
      return transformName(info.getValue());
    },
  }),
  nestedColumnHelper.accessor((row) => row.clubName, {
    id: 'clubName',
    header: () => <div className="text-left">{columnNamesPL.get('clubName')}</div>,
    cell: (info) => info.getValue() ?? '-',
  }),
  nestedColumnHelper.accessor((row) => row.score, {
    id: 'score',
    header: () => <div className="text-left">{columnNamesPL.get('score')}</div>,
    cell: (info) => {
      if (info.row.original.included) {
        return <Typography className="font-semibold text-xs">{info.getValue().toFixed(0)}</Typography>;
      }
      return <Typography className="text-xs italic font-light">{info.getValue().toFixed(0)}</Typography>;
    },
    size: 5,
  }),
];
