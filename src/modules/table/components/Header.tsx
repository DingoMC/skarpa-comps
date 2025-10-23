'use client';

import { IconButton } from '@/lib/mui';
import { flexRender, Header } from '@tanstack/react-table';
import classNames from 'classnames';
import { FaSearch } from 'react-icons/fa';
import { TableHeaderInput } from '../types';
import HeaderFilter from './HeaderFilter';
import SortingIcons from './SortingIcons';

type Props<T> = {
  header: Header<T, unknown>;
  searchToggle: { [key: string]: boolean };
  handleSearchToggle: (_: string) => void;
  textCenter?: boolean;
  filterInput?: TableHeaderInput;
  autoResetPageIndex?: boolean;
  onFirstPage?: () => void;
};

function TableHeader<T>({ header, searchToggle, filterInput, handleSearchToggle, textCenter, autoResetPageIndex, onFirstPage }: Props<T>) {
  const { isPlaceholder, column, getContext } = header;
  const { columnDef, id, getIsSorted, getToggleSortingHandler, setFilterValue, getFilterValue } = column;

  const handleChangeFilter = (value: string | null) => {
    if (autoResetPageIndex === false && onFirstPage) {
      onFirstPage();
    }
    setFilterValue(value);
  };

  if (isPlaceholder) return null;
  return (
    <div>
      <div className={`flex items-center ${textCenter ? 'justify-center' : ''}`}>
        <div
          className={classNames('flex items-center', { 'cursor-pointer': columnDef.enableSorting }, { 'text-center': textCenter })}
          onClick={columnDef.enableSorting ? getToggleSortingHandler() : undefined}
        >
          {flexRender(columnDef.header, getContext())}
          {columnDef.enableSorting && <SortingIcons state={getIsSorted()} />}
        </div>
        {columnDef.enableColumnFilter && (
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => handleSearchToggle(id)}
            color={((getFilterValue() || '') as string).length ? 'info' : 'primary'}
            className="ml-1 !w-5 !h-5 !min-w-5 !min-h-5 cursor-pointer"
          >
            <FaSearch className="w-3 h-3" />
          </IconButton>
        )}
      </div>
      {columnDef.enableColumnFilter && searchToggle[id] && (
        <HeaderFilter input={filterInput} value={(getFilterValue() || '') as string} onChange={(v) => handleChangeFilter(v)} />
      )}
    </div>
  );
}

export default TableHeader;
