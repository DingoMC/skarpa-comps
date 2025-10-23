import { columnNamesPL } from '@/lib/constants/lang_pl';
import { Card, Checkbox, IconButton, List, ListItem, ListItemStart, Tooltip, Typography } from '@/lib/mui';
import { Table } from '@tanstack/react-table';
import { useState } from 'react';
import { FaRegEye } from 'react-icons/fa';

interface Props<T> {
  table: Table<T>;
}

function ColumnVisibilityControl<T>({ table }: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleColumnVisibilityChange = (columnId: string) => {
    table.getColumn(columnId)?.toggleVisibility();
  };

  return (
    <div className="relative">
      <Tooltip>
        <Tooltip.Trigger as={IconButton} onClick={toggleDropdown} color="secondary" variant="ghost" size="sm" className="cursor-pointer">
          <FaRegEye className="w-5 h-5 text-white" />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Typography className="text-xs">Pokaż kolumny</Typography>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-50 h-40 bg-white border border-gray-300 rounded-xl shadow-lg z-50 overflow-y-auto">
          <List>
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((column) => (
                <ListItem key={column.id} className="p-0">
                  <label htmlFor={`column-${column.id}`} className="flex w-full cursor-pointer items-center px-3 py-2">
                    <ListItemStart className="mr-3">
                      <Checkbox
                        id={`column-${column.id}`}
                        color="secondary"
                        checked={column.getIsVisible()}
                        onChange={() => handleColumnVisibilityChange(column.id)}
                        className="hover:before:opacity-0 p-0"
                      >
                        <Checkbox.Indicator />
                      </Checkbox>
                    </ListItemStart>
                    <Typography className="font-medium">{columnNamesPL.get(column.id)}</Typography>
                  </label>
                </ListItem>
              ))}
          </List>
        </Card>
      )}
    </div>
  );
}

export default ColumnVisibilityControl;
