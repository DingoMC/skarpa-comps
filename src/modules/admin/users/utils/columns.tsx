import { columnNamesPL } from '@/lib/constants/lang_pl';
import { transformName } from '@/lib/text';
import { UserUI } from '@/lib/types/auth';
import RoleBadge from '@/modules/roles/components/Badge';
import { Role } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { FaTimes } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
import { IoMdFemale, IoMdMale } from 'react-icons/io';

const columnHelper = createColumnHelper<UserUI>();

export const columns = (roles: Role[]) => [
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
  columnHelper.accessor((row) => row.yearOfBirth, {
    id: 'yearOfBirth',
    header: () => <div className="text-left">{columnNamesPL.get('yearOfBirth')}</div>,
    cell: (info) => info.getValue().toFixed(0),
    enableColumnFilter: true,
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.gender, {
    id: 'gender',
    header: () => <div className="text-left">{columnNamesPL.get('gender')}</div>,
    cell: (info) => (info.getValue() ? <IoMdMale className="w-4 h-4 text-blue-700" /> : <IoMdFemale className="w-4 h-4 text-pink-700" />),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.hasAccount, {
    id: 'hasAccount',
    header: () => <div className="text-left">{columnNamesPL.get('hasAccount')}</div>,
    cell: (info) => (info.getValue() ? <FaCheck className="w-4 h-4 text-green-800" /> : <FaTimes className="w-4 h-4 text-red-800" />),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.isClubMember, {
    id: 'isClubMember',
    header: () => <div className="text-left">{columnNamesPL.get('isClubMember')}</div>,
    cell: (info) => (info.getValue() ? <FaCheck className="w-4 h-4 text-green-800" /> : <FaTimes className="w-4 h-4 text-red-800" />),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.isPZAMember, {
    id: 'isPZAMember',
    header: () => <div className="text-left">{columnNamesPL.get('isPZAMember')}</div>,
    cell: (info) => (info.getValue() ? <FaCheck className="w-4 h-4 text-green-800" /> : <FaTimes className="w-4 h-4 text-red-800" />),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.roleId, {
    id: 'roleId',
    header: () => <div className="text-left">{columnNamesPL.get('roleId')}</div>,
    cell: (info) => <RoleBadge roles={roles} roleId={info.getValue()} />,
    enableSorting: true,
  }),
];
