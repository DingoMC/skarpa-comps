'use client';

import { FamilyResultsSummary } from '@/lib/types/results';
import DashboardFrame from '@/modules/dashboard/components';
import NoData from '@/modules/lottie/NoData';
import ColumnVisibilityControl from '@/modules/table/components/ColumnVisibilityControl';
import TableHeader from '@/modules/table/components/Header';
import Pagination from '@/modules/table/components/Pagination';
import { Role } from '@prisma/client';
import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { columns } from '../utils/familyColumns';
import FamilyMembersTable from './FamilyMembers';

const classes = {
  tableWrapper: 'overflow-x-scroll lg:overflow-x-auto w-full',
  table: 'w-full table-auto',
  thead: 'bg-white',
  headerRow: 'uppercase',
  th: 'py-2 px-4 text-sm font-medium border-b border-b-gray-300',
  thLittlePadding: 'py-1 px-2 text-sm font-medium border-b border-b-gray-300',
  nodata: 'p-4 md:p-8 border border-gray-100',
  row: 'even:bg-blue-gray-50/50 border-b border-b-gray-200 hover:bg-gray-100 cursor-pointer',
  cell: 'px-4 py-2 text-xs',
  cellLittlePadding: 'px-2 py-1 text-xs',
};

type Props = {
  loading: boolean;
  roles: Role[];
  data: FamilyResultsSummary[];
};

const FamilyRankingTable = ({ data, roles, loading }: Props) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const tableData = useMemo(() => data, [data]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchToggle, setSearchToggle] = useState<{ [key: string]: boolean }>({});

  const table = useReactTable({
    data: tableData,
    state: {
      expanded,
      pagination,
      sorting,
    },
    onExpandedChange: setExpanded,
    columns: columns(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.ceil(data.length / pagination.pageSize),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const handleItemsPerPage = (option: { label: string; value: number } | null) => {
    if (!option) return;
    setPagination({ pageIndex: 0, pageSize: option.value });
  };

  const cardHeader = () => (
    <div className="flex items-center gap-x-1">
      <ColumnVisibilityControl table={table} />
    </div>
  );

  return (
    <DashboardFrame title="Klasyfikacja rodzinna" refreshing={loading} cardTable cardHeaderRight={cardHeader()} cardClassName="h-fit">
      <div className={classes.tableWrapper}>
        <table className={classes.table}>
          <thead className={classes.thead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={classes.headerRow}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={classes.th} colSpan={header.colSpan} style={{ width: header.getSize() }}>
                    <TableHeader<FamilyResultsSummary>
                      header={header}
                      searchToggle={searchToggle}
                      handleSearchToggle={(key) => setSearchToggle({ ...searchToggle, [key]: !searchToggle[key] })}
                      autoResetPageIndex
                      onFirstPage={() => table.setPageIndex(0)}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={classes.nodata}>
                  <div className="w-full">
                    <NoData message="W wybranych zawodach nie zgłoszono rodzin." />
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr key={row.id} className={classes.row}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={classes.cell} style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr className="even:bg-gray-50/50 border-b border-gray-400">
                      <td colSpan={table.getAllColumns().length}>
                        <FamilyMembersTable data={row.original.members} roles={roles} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 0 && (
        <Pagination
          page={table.getState().pagination.pageIndex + 1}
          total={table.getPageCount()}
          prevDisabled={!table.getCanPreviousPage()}
          nextDisabled={!table.getCanNextPage()}
          onFirstPage={() => table.setPageIndex(0)}
          onLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
          onPrevPage={() => table.previousPage()}
          onNextPage={() => table.nextPage()}
          itemCount={table.getRowCount()}
          itemsPerPage={pagination.pageSize}
          onItemsPerPage={handleItemsPerPage}
        />
      )}
    </DashboardFrame>
  );
};

export default FamilyRankingTable;
