'use client';

import { Card, CardBody, CardFooter, CardHeader, Tooltip, Typography } from '@/lib/mui';
import { PropsWithChildren, ReactNode } from 'react';
import { FaCog, FaInfoCircle } from 'react-icons/fa';

interface Props {
  /**
   * Title of the card. Can be either a `string` or another component
   * @default undefined
   */
  title?: string | ReactNode;
  /**
   * Card subtitle
   * @default undefined
   */
  subtitle?: string;
  /**
   * Add info icon next to title with `tooltip` content
   * @default undefined
   */
  tooltip?: string;
  /**
   * Additional classes for Card Component
   * @default ''
   */
  cardClassName?: string;
  /**
   * Additional classes for Card Header
   * @default ''
   */
  cardHeaderClassName?: string;
  /**
   * Additional classes for Card Subheader
   * @default ''
   */
  cardSubheaderClassName?: string;
  /**
   * Additional classes for Card Body
   * @default ''
   */
  cardBodyClassName?: string;
  /**
   * Additional classes for Card Footer
   * @default ''
   */
  cardFooterClassName?: string;
  /**
   * Card footer component
   * @default undefined
   */
  footer?: ReactNode;
  /**
   * Should show divider between card body and footer
   * @default false
   */
  divider?: boolean;
  /**
   * Show refreshing icon
   * @default false
   */
  refreshing?: boolean;
  /**
   * Should style the card to contain table in the body (no paddings)
   * @default false
   */
  cardTable?: boolean;
  /**
   * Card header actions component (on the right side)
   * @default undefined
   */
  cardHeaderRight?: ReactNode;
}

/**
 * Dashboard Frame component
 * @param param0 Dashboard Frame props
 */
const DashboardFrame = ({
  title,
  subtitle,
  tooltip,
  children,
  footer,
  cardTable,
  cardClassName,
  cardHeaderRight,
  cardBodyClassName = 'justify-center items-center',
  cardFooterClassName,
  cardHeaderClassName,
  cardSubheaderClassName,
  divider = false,
  refreshing = false,
}: Props & PropsWithChildren) => (
  <Card className={`${cardClassName ?? 'h-full'} overflow-visible`}>
    {title && (
      <CardHeader className="rounded-b-none overflow-visible h-10 bg-gray-600 !m-0 !w-full !px-2 flex items-center">
        <div className={`flex flex-col w-full gap-4 ${cardHeaderClassName ?? ''}`}>
          <div className={`grid grid-flow-col gap-x-2 items-center w-full ${cardSubheaderClassName ?? ''}`}>
            <div className="flex gap-x-2 items-center">
              <div className="text-sm text-white font-normal flex flex-wrap items-center">
                {title}
                {tooltip && (
                  <Tooltip>
                    <Tooltip.Trigger>
                      <FaInfoCircle className="ml-1 w-5 h-5 text-white" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      {tooltip}
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip>
                )}
              </div>
              {refreshing && (
                <div className="w-4 h-4 text-white animate-spin flex items-center justify-center">
                  <FaCog />
                </div>
              )}
            </div>
            {cardHeaderRight && <div className="flex justify-self-end gap-x-2 justify-end items-center">{cardHeaderRight}</div>}
          </div>
          {subtitle && (
            <Typography variant="small" className="max-w-sm font-normal">
              {subtitle}
            </Typography>
          )}
        </div>
      </CardHeader>
    )}
    {cardTable ? (
      <CardBody className={`p-0 flex min-h-fit flex-col grow ${cardBodyClassName ?? ''}`}>{children}</CardBody>
    ) : (
      <CardBody className={`p-4 md:p-6 flex min-h-fit flex-col grow ${cardBodyClassName ?? ''}`}>{children}</CardBody>
    )}
    {footer && (
      <CardFooter divider={divider} className={cardFooterClassName ?? ''}>
        {footer}
      </CardFooter>
    )}
  </Card>
);

export default DashboardFrame;
