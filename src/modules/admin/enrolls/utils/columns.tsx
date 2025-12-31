import { SUPER_ADMIN_AUTH_LEVEL } from '@/lib/constants';
import { columnNamesPL } from '@/lib/constants/lang_pl';
import { transformName } from '@/lib/text';
import { StartListAdmin } from '@/lib/types/startList';
import TemplateButton from '@/modules/buttons/TemplateButton';
import SparkleText from '@/modules/decoration/components/SparkleText';
import ConfirmDialog from '@/modules/dialogs/ConfirmDialog';
import { generateCategoryLabel } from '@/modules/inputs/components/CategorySelector';
import { Category, Competition, Role } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { FaCog, FaTimes } from 'react-icons/fa';
import { FaCheck, FaTrash } from 'react-icons/fa6';
import { IoMdFemale, IoMdMale } from 'react-icons/io';

const columnHelper = createColumnHelper<StartListAdmin>();

export const columns = (
  loading: boolean,
  categories: Category[],
  roles: Role[],
  competition: Competition,
  onEdit: (_: string) => void,
  onDelete: (_: string) => void
) => [
  columnHelper.accessor((row) => row, {
    id: 'actions',
    header: () => (
      <div className="text-left">
        <FaCog className="w-4 h-4" />
      </div>
    ),
    cell: (info) => (
      <div className="flex items-center gap-1">
        <TemplateButton template="edit" disabled={loading} onClick={() => onEdit(info.getValue().id)} />
        <ConfirmDialog
          triggerAs="icon"
          trigger={<FaTrash className="w-4 h-4 text-red-600" />}
          loading={loading}
          header="Potwierdź usunięcie wpisu"
          content={`Czy na pewno chcesz usunąć wpis
            zawodnika ${transformName(info.getValue().user.firstName)} ${transformName(info.getValue().user.lastName)} wraz
            z powiązanymi wynikami? Ta operacja jest nieodwracalna!`}
          onConfirm={() => onDelete(info.getValue().id)}
        />
      </div>
    ),
    enableHiding: false,
    size: 5,
  }),
  columnHelper.accessor((row) => row.startNumber, {
    id: 'startNumber',
    header: () => <div className="text-left">{columnNamesPL.get('startNumber')}</div>,
    cell: (info) => {
      if (!info.getValue()) return '-';
      return info.getValue().toFixed(0);
    },
    enableColumnFilter: true,
    enableSorting: true,
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
  columnHelper.accessor((row) => row.user.isClubMember, {
    id: 'isClubMember',
    header: () => <div className="text-left">{columnNamesPL.get('isClubMember')}</div>,
    cell: (info) => (info.getValue() ? <FaCheck className="w-4 h-4 text-green-800" /> : <FaTimes className="w-4 h-4 text-red-800" />),
    enableSorting: true,
    size: 5,
  }),
  columnHelper.accessor((row) => row.user.isPZAMember, {
    id: 'isPZAMember',
    header: () => <div className="text-left">{columnNamesPL.get('isPZAMember')}</div>,
    cell: (info) => (info.getValue() ? <FaCheck className="w-4 h-4 text-green-800" /> : <FaTimes className="w-4 h-4 text-red-800" />),
    enableSorting: true,
    size: 5,
  }),
  columnHelper.accessor((row) => row.user.yearOfBirth, {
    id: 'yearOfBirth',
    header: () => <div className="text-left">{columnNamesPL.get('yearOfBirth')}</div>,
    cell: (info) => info.getValue().toFixed(0),
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
  columnHelper.accessor((row) => row.verified, {
    id: 'verified',
    header: () => <div className="text-left">{columnNamesPL.get('verified')}</div>,
    cell: (info) => (info.getValue() ? <FaCheck className="w-4 h-4 text-green-700" /> : <FaTimes className="w-4 h-4 text-red-700" />),
    size: 5,
  }),
  columnHelper.accessor((row) => row, {
    id: 'hasPaid',
    header: () => <div className="text-left">{columnNamesPL.get('hasPaid')}</div>,
    cell: (info) => {
      const { hasPaid, isClubMember } = info.getValue();
      const { clubMembersPay } = competition;
      if (!clubMembersPay && isClubMember) {
        return 'N/D';
      }
      return hasPaid ? <FaCheck className="w-4 h-4 text-green-700" /> : <FaTimes className="w-4 h-4 text-red-700" />;
    },
    size: 5,
  }),
  columnHelper.accessor((row) => row, {
    id: 'underageConsent',
    header: () => <div className="text-left">{columnNamesPL.get('underageConsent')}</div>,
    cell: (info) => {
      const { underageConsent, user } = info.getValue();
      const { yearOfBirth } = user;
      if (new Date().getFullYear() - yearOfBirth >= 18) return '18+';
      return underageConsent ? <FaCheck className="w-4 h-4 text-green-700" /> : <FaTimes className="w-4 h-4 text-red-700" />;
    },
    size: 5,
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
