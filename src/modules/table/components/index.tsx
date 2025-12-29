'use client';

import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardFrame from '@/modules/dashboard/components';
import SkarpaProgress from '@/modules/loaders/components/Progress';
import NoData from '@/modules/lottie/NoData';
import {
  AccessorColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { TableHeaderInput } from '../types';
import ColumnVisibilityControl from './ColumnVisibilityControl';
import TableHeader from './Header';
import Pagination from './Pagination';

type Props<T> = {
  /**
   * Tanstack table columns list
   */
  columns: AccessorColumnDef<T, any>[];
  /**
   * Raw data
   */
  data: T[];
  /**
   * Dashboard title
   */
  title: string;
  /**
   * Should show refreshing icon
   * @default false
   */
  refetching?: boolean;
  /**
   * Should show refreshing icon
   * @default false
   */
  noActionButtons?: boolean;
  /**
   * Additional classes for Dashboard
   * @default ''
   */
  cardClassName?: string;
  /**
   * Additional classes for Dashboard Body
   * @default ''
   */
  cardBodyClassName?: string;
  /**
   * Progress value `[0.0, 1.0]`
   * @default undefined
   */
  progress?: number;
  /**
   * Custom class name for rows. Either `string` if applying to all rows
   * or a functor to access single row instance
   */
  customRowClassName?: string | ((row: Row<T>) => string);
  /**
   * Custom class name for table wrapper
   */
  customTableWrapperClassName?: string;
  /**
   * List of custom filter inputs
   */
  customFilterInputs?: TableHeaderInput[];
  /**
   * If set to `true`, pagination will be reset to the first page when page-altering state changes eg. data is updated,
   * filters change etc.
   * @default true
   */
  autoResetPageIndex?: boolean;
  /**
   * If set to `true`, pagination footer will be always hidden
   * @default false
   */
  hidePagination?: boolean;
  /**
   * Optional initial sorting state
   * @default undefined
   */
  defaultSortingState?: SortingState;
  /**
   * Row click event handler
   * @param row clicked Row reference
   * @default undefined
   */
  onRowClick?: (row: Row<T>) => void;
  /**
   * If defined, adds icon in header to download CSV
   * @default undefined
   */
  onDownloadCSV?: () => void;
  /**
   * If defined, adds icon in header to refresh data
   * @default undefined
   */
  onRefresh?: (() => void) | (() => Promise<void>);
  /**
   * If defined, it returns a callback with filtered rows whenever filter changes
   * @param filteredRows
   * @returns
   */
  onFilterChange?: (filteredRows: Row<T>[]) => void;
  /**
   * Custom header right element
   * @default false
   */
  cardHeaderRight?: React.ReactNode;
  /**
   * Custom message to display when there are no rows to show
   * @default `DEFAULT_NO_DATA_MSG`
   */
  noDataMessage?: string;
};

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

/**
 * Dahsboard Table component
 * @param param0 Dahsboard Table props
 * @template T Raw Data type (inferred from data passed in props)
 */
function DashboardTable<T>({
  columns,
  data,
  title,
  refetching,
  cardClassName,
  cardBodyClassName,
  progress,
  hidePagination,
  onRowClick,
  onDownloadCSV,
  onRefresh,
  onFilterChange,
  customRowClassName,
  customTableWrapperClassName,
  autoResetPageIndex,
  defaultSortingState,
  cardHeaderRight,
  customFilterInputs,
  noDataMessage,
  noActionButtons,
}: Props<T>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>(defaultSortingState ?? []);
  const [searchToggle, setSearchToggle] = useState<{ [key: string]: boolean }>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    autoResetPageIndex,
  });

  useEffect(() => {
    if (onFilterChange) onFilterChange(table.getFilteredRowModel().rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters]);

  const handleItemsPerPage = (option: { label: string; value: number } | null) => {
    if (!option) return;
    setPagination({ pageIndex: 0, pageSize: option.value });
  };

  const cardHeader = () => (
    <div className="flex items-center gap-x-1">
      {cardHeaderRight}
      {onRefresh && <TemplateButton template="refresh" onClick={onRefresh} disabled={refetching} />}
      {onDownloadCSV && <TemplateButton template="downloadCSV" onClick={onDownloadCSV} disabled={refetching} />}
      <ColumnVisibilityControl table={table} />
    </div>
  );

  const rowClassName = (row: Row<T>) => {
    if (!customRowClassName) return '';
    if (typeof customRowClassName === 'string') return customRowClassName;
    return customRowClassName(row);
  };

  return (
    <DashboardFrame
      title={title}
      refreshing={refetching}
      cardTable
      cardHeaderRight={cardHeader()}
      cardBodyClassName={cardBodyClassName}
      cardClassName={`h-fit ${cardClassName ?? ''}`}
    >
      {progress !== undefined && refetching && data.length > 1 && <SkarpaProgress value={progress * 100.0} size="sm" />}
      <div className={classes.tableWrapper + (customTableWrapperClassName ? ` ${customTableWrapperClassName}` : '')}>
        <table className={classes.table}>
          <thead className={classes.thead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={classes.headerRow}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={noActionButtons ? classes.th : classes.thLittlePadding}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                  >
                    <TableHeader<T>
                      header={header}
                      searchToggle={searchToggle}
                      handleSearchToggle={(key) => setSearchToggle({ ...searchToggle, [key]: !searchToggle[key] })}
                      autoResetPageIndex={autoResetPageIndex}
                      onFirstPage={() => table.setPageIndex(0)}
                      filterInput={customFilterInputs?.find((v) => v.columnId === header.column.id)}
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
                  <NoData message={noDataMessage} />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`${classes.row} ${rowClassName(row)}`}
                  onClick={() => {
                    if (onRowClick) onRowClick(row);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={noActionButtons ? classes.cell : classes.cellLittlePadding}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 0 && !hidePagination && (
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
}

export default DashboardTable;
