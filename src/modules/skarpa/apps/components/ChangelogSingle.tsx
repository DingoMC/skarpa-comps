'use client';

import { JSX } from 'react';
import AppBug from './Bug';

type Props = {
  log: string;
};

export const formatChangelog = (log: string) => {
  const elems: JSX.Element[] = [];
  let tempStr = '';
  let tempBugId = '';
  let inBugId = false;
  let i = 0;
  for (const c of log) {
    if (c !== '{' && c !== '}') {
      if (inBugId) tempBugId += c;
      else tempStr += c;
    } else if (c === '{') {
      elems.push(<span key={i}>{tempStr}</span>);
      tempStr = '';
      inBugId = true;
      i++;
    } else if (c === '}') {
      const [, appCode, bugId] = tempBugId.split('-');
      elems.push(<AppBug key={i} bugId={parseInt(bugId ?? 0, 10)} appCode={(appCode ?? 'N/A').toUpperCase()} variant="text" />);
      tempBugId = '';
      inBugId = false;
      i++;
    }
  }
  if (tempStr.length) elems.push(<span key={i}>{tempStr}</span>);
  return elems;
};

const ChangelogSingle = ({ log }: Props) => <>{formatChangelog(log)}</>;

export default ChangelogSingle;
