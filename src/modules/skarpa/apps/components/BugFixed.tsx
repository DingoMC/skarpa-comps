'use client';

import { Tooltip, Typography } from '@/lib/mui';

type Props = {
  variant: 'badge' | 'text';
  classes?: string;
};

const AppBugFixed = ({ variant, classes }: Props) => {
  if (variant === 'badge') {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <div
            className={`flex items-center justify-center text-xs border rounded-md px-2 py-px cursor-pointer 
              w-fit border-[#10b981] text-[#008565] ${classes ?? ''}`}
          >
            Fixed
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Typography className="text-xs">Ten błąd został naprawiony i nie występuje w najnowszej wersji.</Typography>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <div
          className={`flex items-center justify-center text-xs cursor-pointer 
          w-fit text-[#008565] ${classes ?? ''}`}
        >
          Fixed
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Typography className="text-xs">Ten błąd został naprawiony i nie występuje w najnowszej wersji.</Typography>
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip>
  );
};

export default AppBugFixed;
