'use client';

import Link from 'next/link';

type Props = {
  bugId: number;
  appCode: string;
  variant: 'badge' | 'text';
  classes?: string;
};

const AppBug = ({ bugId, appCode, variant, classes }: Props) => {
  const bugIdHTML = `bug-${appCode.toLowerCase()}-${bugId.toFixed(0)}`;
  if (variant === 'badge') {
    return (
      <div
        className={`flex items-center justify-center text-xs border rounded-md px-2 py-px cursor-pointer 
          w-fit border-red-900 bg-red-50 text-red-900 ${classes ?? ''}`}
        id={bugIdHTML}
      >
        <Link href={`#${bugIdHTML}`} className="no-underline" prefetch={false}>{`Bug #${appCode}-${bugId}`}</Link>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center text-sm cursor-pointer 
        w-fit text-red-900 ${classes ?? ''}`}
    >
      <Link href={`#${bugIdHTML}`} className="no-underline" prefetch={false}>{`Bug #${appCode}-${bugId}`}</Link>
    </div>
  );
};

export default AppBug;
