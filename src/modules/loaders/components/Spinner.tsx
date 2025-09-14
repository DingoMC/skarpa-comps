'use client';

import { Spinner } from '@/lib/mui';

type SkarpaSpinnerProps = {
  className?: string;
};

const SkarpaSpinner = ({ className }: SkarpaSpinnerProps) => (
  <Spinner className={`text-main/20 [&>*:nth-child(even)]:text-main ${className ?? ''}`} />
);

export default SkarpaSpinner;
