'use client';

import SkarpaSpinner from '@/modules/loaders/components/Spinner';
import { ReactNode } from 'react';
import DashboardFrame from '.';

type Props = {
  /**
   * Title of the card. Can be either a `string` or another component
   * @default undefined
   */
  title?: string | ReactNode;
  /**
   * Show refreshing icon
   */
  refreshing: boolean;
  /**
   * Additional classes for Card Body
   * @default 'min-h-[388px]'
   */
  cardBodyClassName?: string;
};

/**
 * Spinner in Dashboard component
 * @param param0 Spinner in Dashboard props
 */
const DashboardSpinner = ({ title, refreshing, cardBodyClassName }: Props) => (
  <DashboardFrame
    title={title}
    refreshing={refreshing}
    cardBodyClassName={`flex flex-col justify-center items-center ${cardBodyClassName ?? 'min-h-[388px] max-h-[388px]'}`}
  >
    <SkarpaSpinner className="h-20 w-20" />
  </DashboardFrame>
);

export default DashboardSpinner;
