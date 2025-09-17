import { columnNamesPL } from '@/lib/constants/lang_pl';
import { transformName } from '@/lib/text';
import { UserUI } from '@/lib/types/auth';
import { createColumnHelper } from '@tanstack/react-table';
import { FaTimes } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
import { IoMdFemale, IoMdMale } from 'react-icons/io';

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
    cell: (info) => (info.getValue() ? <IoMdMale className="w-5 h-5 text-blue-700" /> : <IoMdFemale className="w-5 h-5 text-pink-700" />),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => row.hasAccount, {
    id: 'hasAccount',
    header: () => <div className="text-left">{columnNamesPL.get('hasAccount')}</div>,
    cell: (info) => (info.getValue() ? <FaCheck className="w-5 h-5 text-green-800" /> : <FaTimes className="w-5 h-5 text-red-800" />),
    enableSorting: true,
  }),
];
