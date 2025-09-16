'use client';

import { Typography } from '@/lib/mui';
import { siteMapByPath } from '@/lib/siteMap';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export const DEFAULT_NO_DATA_MSG = 'Nie znaleziono wyników.';

type Props = {
  message?: string;
};

/**
 * Generic No Data component
 */
const NoData = ({ message }: Props) => {
  const path = usePathname();
  const noDataContent = useMemo(() => {
    if (message && message.length) return message.split('\n').map((v) => v.trim());
    const pageMsg = siteMapByPath.get(path).noDataMessage;
    if (pageMsg && pageMsg.length) return pageMsg.split('\n').map((v) => v.trim());
    return DEFAULT_NO_DATA_MSG.split('\n').map((v) => v.trim());
  }, [message, path]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center min-h-16 max-h-36 min-w-52 max-w-72">
        <DotLottieReact src="/lottie/empty.json" loop autoplay />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {noDataContent.map((v) => (
          <Typography key={v}>{v}</Typography>
        ))}
      </div>
    </div>
  );
};

export default NoData;
