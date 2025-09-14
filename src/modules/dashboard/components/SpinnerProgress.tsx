'use client';

import SkarpaProgress from '@/modules/loaders/components/Progress';
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
   * Should show progress bar
   */
  showProgressBar: boolean;
  /**
   * Progress value `[0.0, 1.0]`
   */
  progress: number;
  /**
   * Additional classes for Card Body
   * @default 'min-h-[388px]'
   */
  cardBodyClassName?: string;
  /**
   * Additional classes for Spinner wrapper
   * @default 'min-h-[340px]'
   */
  spinnerContainerClassName?: string;
};

/**
 * Spinner & Progressbar in Dashboard component
 * @param param0 Spinner & Progressbar in Dashboard props
 */
const DashboardSpinnerProgress = ({
  title,
  refreshing,
  showProgressBar,
  progress,
  cardBodyClassName,
  spinnerContainerClassName,
}: Props) => (
  <DashboardFrame title={title} refreshing={refreshing} cardBodyClassName={cardBodyClassName ?? 'min-h-[388px]'}>
    <div className={`w-full flex flex-col justify-center items-center ${spinnerContainerClassName ?? 'min-h-[340px]'}`}>
      <SkarpaSpinner className="h-20 w-20" />
    </div>
    {showProgressBar && <SkarpaProgress value={progress * 100.0} size="sm" />}
  </DashboardFrame>
);

export default DashboardSpinnerProgress;
