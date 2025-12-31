import { SUPER_ADMIN_AUTH_LEVEL } from '@/lib/constants';
import { columnNamesPL } from '@/lib/constants/lang_pl';
import { transformName } from '@/lib/text';
import { StartListEntry } from '@/lib/types/startList';
import SparkleText from '@/modules/decoration/components/SparkleText';
import { generateCategoryLabel } from '@/modules/inputs/components/CategorySelector';
import { Category, Role } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { IoMdFemale, IoMdMale } from 'react-icons/io';

const columnHelper = createColumnHelper<StartListEntry>();

export const columns = (categories: Category[], roles: Role[]) => [
  columnHelper.accessor((row) => row.startNumber, {
    id: 'startNumber',
    header: () => <div className="text-left">{columnNamesPL.get('startNumber')}</div>,
    cell: (info) => {
      if (!info.getValue()) return '-';
      return info.getValue().toFixed(0);
    },
    enableColumnFilter: true,
    enableSorting: true,
    enableHiding: false,
    size: 5,
  }),
  columnHelper.accessor((row) => row.user.firstName, {
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
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.user.lastName, {
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
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.clubName, {
    id: 'clubName',
    header: () => <div className="text-left">{columnNamesPL.get('clubName')}</div>,
    cell: (info) => info.getValue() ?? '-',
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.categoryId, {
    id: 'category',
    header: () => <div className="text-left">{columnNamesPL.get('category')}</div>,
    cell: (info) => {
      const found = categories.find((cat) => cat.id === info.getValue());
      if (!found) return 'N/A';
      return generateCategoryLabel(found, true);
    },
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.user.gender, {
    id: 'gender',
    header: () => <div className="text-left">{columnNamesPL.get('gender')}</div>,
    cell: (info) => (info.getValue() ? <IoMdMale className="w-4 h-4 text-blue-700" /> : <IoMdFemale className="w-4 h-4 text-pink-700" />),
    enableSorting: true,
    size: 5,
  }),
];
