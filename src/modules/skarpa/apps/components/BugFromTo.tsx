'use client';

import Link from 'next/link';
import { Bug } from '../types';
import AppVersion from './Version';

type Props = {
  bug: Bug;
  appCode: string;
};

const AppBugFromTo = ({ bug, appCode }: Props) => {
  const fromId = `${appCode.toLowerCase()}-${bug.from.versionType}-${bug.from.version}`;
  if (!bug.to) {
    return (
      <div className="flex items-center gap-x-1 text-sm">
        <div>Wersje:</div>
        <Link href={`#${fromId}`} className="cursor-pointer no-underline" prefetch={false}>
          <AppVersion version={bug.from} variant="text" />
        </Link>
        <div>i nowsze</div>
      </div>
    );
  }

  const toId = `${appCode.toLowerCase()}-${bug.to.versionType}-${bug.to.version}`;

  if (bug.to.version === bug.from.version && bug.to.versionType === bug.from.versionType) {
    return (
      <div className="flex items-center gap-x-1 text-sm">
        <div>Wersja:</div>
        <Link href={`#${fromId}`} className="cursor-pointer no-underline" prefetch={false}>
          <AppVersion version={bug.from} variant="text" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-x-1 text-sm">
      <div>Wersje:</div>
      <Link href={`#${fromId}`} className="cursor-pointer no-underline" prefetch={false}>
        <AppVersion version={bug.from} variant="text" />
      </Link>
      <div>-</div>
      <Link href={`#${toId}`} className="cursor-pointer no-underline" prefetch={false}>
        <AppVersion version={bug.to} variant="text" />
      </Link>
    </div>
  );
};

export default AppBugFromTo;
