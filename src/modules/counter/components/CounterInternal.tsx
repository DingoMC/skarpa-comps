'use client';

import React from 'react';

type Props = {
  max: number;
  value?: number;
  color?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  internalClassName?: string;
};

const CounterInternal = ({ max, iconLeft, iconRight, value, color, internalClassName }: Props) => (
  <div className="flex flex-row items-center justify-center gap-x-4">
    <div
      style={{ borderColor: color || 'white', color: color || 'white' }}
      className={`flex items-center justify-center text-center text-xs border
        rounded-2xl border-solid px-1 py-[2px] sm:px-2 sm:py-1 ${internalClassName ?? ''}`}
    >
      {iconLeft !== undefined && iconLeft}
      <span>
        {value || 0} / {max}
      </span>
      {iconRight !== undefined && iconRight}
    </div>
  </div>
);

export default CounterInternal;
