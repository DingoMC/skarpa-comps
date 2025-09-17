'use client';

import { Tooltip } from '@/lib/mui';
import CounterInternal from './CounterInternal';
import { Placement } from '@floating-ui/react';

type Props = {
  /**
   * Left value (current)
   * @default 0
   */
  value?: number;
  /**
   * Right value (max)
   */
  max: number;
  /**
   * Foreground color
   * @default 'white'
   */
  color?: string;
  /**
   * Show tooltip
   * @default false
   */
  withTooltip?: boolean;
  /**
   * Placement of the tooltip
   * @default 'top'
   */
  tooltipPlacement?: Placement;
  /**
   * Tooltip text
   * @default ''
   */
  tooltipText?: string;
  /**
   * Internal class name
   * @default ''
   */
  internalClassName?: string;
  /**
   * Icon on the left side of values
   * @default undefined
   */
  iconLeft?: React.ReactNode;
  /**
   * Icon on the right side of values
   * @default undefined
   */
  iconRight?: React.ReactNode;
};

/**
 * Counter component
 * @param props Counter component props
 */
export default function Counter(props: Props) {
  const { withTooltip, tooltipPlacement, tooltipText, max, value, color, internalClassName, iconLeft, iconRight } = props;
  if (withTooltip) {
    return (
      <Tooltip placement={tooltipPlacement ?? 'top'}>
        <Tooltip.Trigger>
          <CounterInternal
            max={max}
            value={value}
            color={color}
            iconLeft={iconLeft}
            iconRight={iconRight}
            internalClassName={`cursor-pointer ${internalClassName ?? ''}`}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <span>{tooltipText}</span>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return (
    <CounterInternal
      max={max}
      value={value}
      color={color}
      iconLeft={iconLeft}
      iconRight={iconRight}
      internalClassName={internalClassName}
    />
  );
}
