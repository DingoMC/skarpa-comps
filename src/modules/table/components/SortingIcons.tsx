'use client';

import { SortDirection } from '@tanstack/react-table';
import { FaSortDown, FaSortUp } from 'react-icons/fa';

type Props = {
  state: false | SortDirection;
};

const SortingIcons = ({ state }: Props) => (
  <div className="ml-2 flex flex-col items-center justify-center h-5 w-4 relative">
    <FaSortUp className={`absolute w-4 h-4 ${state && state === 'asc' ? 'text-gray-600' : 'text-gray-300'}`} />
    <FaSortDown className={`absolute w-4 h-4 ${state && state === 'desc' ? 'text-gray-600' : 'text-gray-300'}`} />
  </div>
);

export default SortingIcons;
