'use client';

import { IconButton } from '@/lib/mui';
import { sectionByPath } from '@/lib/siteMap';
import { clearDynamicRoute } from '@/modules/middleware/access';
import { RootState } from '@/store/store';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BsChevronDoubleLeft } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { SidebarState } from '../../types/sidebar';
import { ExpandedState } from '../../types/sidebar/expanded';
import SidebarList from './SidebarList';

const Sidebar = () => {
  const [state, setState] = useState<SidebarState>(new ExpandedState());
  const authLevel = useSelector((state: RootState) => state.auth.authLevel);
  const path = usePathname();
  const section = sectionByPath.get(clearDynamicRoute(path));
  const links = useMemo(() => {
    return Object.values(section.pages)
      .filter((page) => !page.hidden)
      .filter((page) => page.authLevel === undefined || page.authLevel(authLevel))
      .sort((a, b) => a.id - b.id);
  }, [section, authLevel]);

  return (
    <div
      className={`min-h-[calc(100vh-119px)] flex-col rounded-none transition-width duration-300 ease-in-out shadow-none bg-white
        border-r border-r-gray-300 hidden lg:flex overflow-hidden ${state.getWidthClass()}`}
    >
      <div className="w-full flex justify-end border-b border-b-gray-300 px-2 py-[2px]">
        <IconButton
          onClick={() => setState(state.toggle())}
          variant="ghost"
          className="!outline-none text-gray-500 cursor-pointer"
          size="md"
        >
          <BsChevronDoubleLeft
            className={`w-6 h-6 text-gray-700 transition-transform duration-300 ease-in-out ${state.getArrowRotationClass()}`}
          />
        </IconButton>
      </div>
      {state.renderHeader(section.title)}
      <SidebarList links={links} path={clearDynamicRoute(path)} expanded={state.isExpanded()} />
    </div>
  );
};

export default Sidebar;
