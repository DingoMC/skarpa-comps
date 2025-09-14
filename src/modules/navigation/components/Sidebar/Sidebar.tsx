'use client';

import { IconButton } from '@/lib/mui';
import { sectionByPath } from '@/lib/siteMap';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BsChevronDoubleLeft } from 'react-icons/bs';
import SidebarList from './SidebarList';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const path = usePathname();
  const section = sectionByPath.get(path);
  const links = useMemo(() => {
    return Object.values(section.pages)
      .filter((page) => !page.hidden)
      .sort((a, b) => a.id - b.id);
  }, [section]);

  return (
    <div
      className={classNames(
        'min-h-[calc(100vh-119px)] flex-col rounded-none transition-width duration-300 ease-in-out shadow-none bg-white',
        {
          'w-50': expanded,
          'w-12': !expanded,
        },
        'border-r border-r-gray-300 hidden lg:flex overflow-hidden'
      )}
    >
      <div className="w-full flex justify-end border-b border-b-gray-300 px-2 py-[2px]">
        <IconButton onClick={() => setExpanded(!expanded)} variant="ghost" className="!outline-none text-gray-500 cursor-pointer" size="md">
          <BsChevronDoubleLeft
            className={`w-6 h-6 text-gray-700 transition-transform duration-300 ease-in-out ${!expanded ? 'rotate-180' : ''}`}
          />
        </IconButton>
      </div>
      {expanded && <div className="text-main font-medium py-2 pl-4">{section.title}</div>}
      <SidebarList links={links} path={path} expanded={expanded} />
    </div>
  );
};

export default Sidebar;
