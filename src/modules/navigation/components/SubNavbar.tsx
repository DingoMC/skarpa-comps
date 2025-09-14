'use client';

import { List, ListItem } from '@/lib/mui';
import { sectionByPath, siteMap } from '@/lib/siteMap';
import { SiteMapPage } from '@/lib/types/siteMap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SubNavbar = () => {
  const pathname = usePathname();

  const subnav = Object.values(siteMap)
    .filter((section) => {
      const pages: SiteMapPage[] = Object.values(section.pages);
      return pages.some((page) => !page.hidden);
    })
    .sort((a, b) => a.id - b.id);

  const getLinkClass = (href: string) => {
    const sameSection = sectionByPath.get(href).id === sectionByPath.get(pathname).id;
    if (sameSection) {
      return `px-2 py-1 rounded-md hover:bg-opacity-100 hover:text-white text-white focus:outline-none focus:text-white
        focus:bg-opacity-100 bg-opacity-100 !bg-main focus:bg-main`;
    }
    return `px-2 py-1 rounded-md hover:bg-main focus:bg-main
      hover:bg-opacity-90 bg-opacity-90 hover:text-white focus:text-white`;
  };

  return (
    <div className="w-full flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row items-center px-4 py-2 border-b border-b-gray-300">
      <List className="p-0 pb-2 lg:pb-0 gap-1 flex flex-row flex-wrap border-b border-b-gray-200 lg:border-none">
        {subnav.map((section) => {
          let pages: SiteMapPage[] = Object.values(section.pages);
          pages = pages.filter((v) => !v.hidden);
          if (pages.length === 0) return null;
          pages.sort((a, b) => a.id - b.id);
          return (
            <Link href={pages[0].href} key={pages[0].href}>
              <ListItem className={getLinkClass(pages[0].href)}>{section.title}</ListItem>
            </Link>
          );
        })}
      </List>
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-fit ml-auto" />
    </div>
  );
};

export default SubNavbar;
