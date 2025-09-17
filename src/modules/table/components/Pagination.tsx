'use client';

import { IconButton, Tooltip, Typography } from '@/lib/mui';
import { styleWhite } from '@/lib/themes/react-select/select';
import { useMemo } from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Select from 'react-select';

type OptionType = {
  label: string;
  value: number;
};

type Props = {
  page: number;
  total: number;
  prevDisabled: boolean;
  nextDisabled: boolean;
  itemCount: number;
  itemsPerPage: number;
  noAllItems?: boolean;
  onItemsPerPage?: (_v: OptionType | null) => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

const Pagination = ({
  page,
  total,
  prevDisabled,
  nextDisabled,
  itemCount,
  itemsPerPage,
  noAllItems,
  onItemsPerPage,
  onFirstPage,
  onLastPage,
  onPrevPage,
  onNextPage,
}: Props) => {
  const ippOptions: OptionType[] = useMemo(() => {
    const tempOptions = [
      { label: '10', value: 10 },
      { label: '20', value: 20 },
      { label: '50', value: 50 },
    ];
    if (!noAllItems) tempOptions.push({ label: `Pełny (${itemCount})`, value: itemCount });
    return tempOptions;
  }, [itemCount, noAllItems]);

  return (
    <div className="bg-gray-700 text-white flex justify-between items-center rounded-b-md w-full h-10">
      <div className="flex items-center gap-2">
        <Tooltip>
          <Tooltip.Trigger as={IconButton} onClick={onFirstPage} color="secondary" variant="ghost" size="sm" disabled={prevDisabled}>
            <FaAngleDoubleLeft className={`cursor-pointer ${prevDisabled ? 'text-gray-400' : 'text-white hover:text-gray-100'}`} />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Typography>Pierwsza strona</Typography>
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger as={IconButton} onClick={onPrevPage} color="secondary" variant="ghost" size="sm" disabled={prevDisabled}>
            <FaChevronLeft className={`cursor-pointer ${prevDisabled ? 'text-gray-400' : 'text-white hover:text-gray-100'}`} />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Typography>Poprzednia strona</Typography>
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip>
      </div>

      <div className="flex flex-col md:flex-row gap-x-4 gap-y-1 items-center">
        <span className="text-sm">
          Strona{' '}
          <strong>
            {page} / {total}
          </strong>
        </span>
        {onItemsPerPage !== undefined && (
          <div className="flex flex-col md:flex-row items-center gap-x-1">
            <span className="text-sm">Rozmiar strony:</span>
            <Select<OptionType>
              styles={styleWhite<OptionType>()}
              options={ippOptions}
              value={ippOptions.find((o) => o.value === itemsPerPage)}
              onChange={onItemsPerPage}
              className="w-28"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <Tooltip.Trigger as={IconButton} onClick={onNextPage} color="secondary" variant="ghost" size="sm" disabled={nextDisabled}>
            <FaChevronRight className={`cursor-pointer ${nextDisabled ? 'text-gray-400' : 'text-white hover:text-gray-100'}`} />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Typography>Następna strona</Typography>
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger as={IconButton} onClick={onLastPage} color="secondary" variant="ghost" size="sm" disabled={nextDisabled}>
            <FaAngleDoubleRight className={`cursor-pointer ${nextDisabled ? 'text-gray-400' : 'text-white hover:text-gray-100'}`} />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Typography>Ostatnia strona</Typography>
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip>
      </div>
    </div>
  );
};

export default Pagination;
