'use client';

import { FamilyResultsPartial } from '@/lib/types/results';
import { Role } from '@prisma/client';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { nestedFamilyColumns } from '../utils/familyColumns';

type Props = {
  data: FamilyResultsPartial[];
  roles: Role[];
};

const FamilyMembersTable = ({ data, roles }: Props) => {
  const nestedColumns = useMemo(() => nestedFamilyColumns(roles), [roles]);

  const table = useReactTable<FamilyResultsPartial>({
    data: data,
    columns: nestedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full min-w-max table-auto">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="uppercase">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="border-b border-gray-100 bg-gray-200 px-4 py-2 font-medium text-sm normal-case">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="bg-gray-100 cursor-pointer">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-4 py-2 text-xs border-b border-gray-100">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FamilyMembersTable;
