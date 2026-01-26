'use client';

import { Tooltip, Typography } from '@/lib/mui';
import { displayFullName } from '@/lib/text';
import { StartListEntry } from '@/lib/types/startList';
import SparkleText from '@/modules/decoration/components/SparkleText';
import { MdWarning } from 'react-icons/md';

type Props = {
  user: StartListEntry;
  sparkleText?: boolean;
};

const UserBadge = ({ user, sparkleText }: Props) => {
  return (
    <div className="flex items-center gap-2">
      {user.startNumber > 0 && (
        <div className="px-2 py-px !m-0 text-xs border border-gray-800 text-gray-800 rounded">{user.startNumber}</div>
      )}
      {sparkleText ? (
        <SparkleText id={user.id} textClassName="text-purple-950 text-sm">
          {displayFullName(user.user.firstName, user.user.lastName)}
        </SparkleText>
      ) : (
        <Typography className="text-sm">{displayFullName(user.user.firstName, user.user.lastName)}</Typography>
      )}
      {!user.verified && (
        <Tooltip>
          <Tooltip.Trigger>
            <MdWarning className="w-4 h-4 text-yellow-800 cursor-pointer animate-pulse" />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Typography className="text-xs">Niezweryfikowany</Typography>
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip>
      )}
    </div>
  );
};

export default UserBadge;
