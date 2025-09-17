'use client';

import { IconButton } from '@/lib/mui';
import { sectionByPath } from '@/lib/siteMap';
import { RootState } from '@/store/store';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BsChevronDoubleRight } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import SidebarList from './SidebarList';

const SidebarMobile = () => {
  const [expanded, setExpanded] = useState(false);
  const authLevel = useSelector((state: RootState) => state.auth.authLevel);
  const path = usePathname();
  const section = sectionByPath.get(path);
  const links = useMemo(() => {
    return Object.values(section.pages)
      .filter((page) => !page.hidden)
      .filter((page) => page.authLevel === undefined || page.authLevel(authLevel))
      .sort((a, b) => a.id - b.id);
  }, [section, authLevel]);

  return (
    <div
      className={classNames(
        'overflow-hidden flex-col rounded-none transition-height duration-300 ease-in-out shadow-none bg-white',
        {
          'h-max max-h-[480px]': expanded,
          'h-[45px] max-h-[45px]': !expanded,
        },
        'border-b border-b-gray-300 flex lg:hidden w-full'
      )}
    >
      <div className="w-full flex justify-between items-center border-b border-b-gray-300 px-2 py-[2px]">
        <div className="text-main font-medium text-center pl-4 pt-1">{section.title}</div>
        <IconButton onClick={() => setExpanded(!expanded)} variant="ghost" className="!outline-none pr-1 text-gray-500" size="md">
          <BsChevronDoubleRight
            className={`w-6 h-6 text-gray-700 transition-transform duration-300 ease-in-out ${expanded ? 'rotate-90' : ''}`}
          />
        </IconButton>
      </div>
      <SidebarList links={links} path={path} expanded={expanded} />
    </div>
  );
};

export default SidebarMobile;
