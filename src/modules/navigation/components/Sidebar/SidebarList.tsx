'use client';

import { List, ListItem, ListItemStart } from '@/lib/mui';
import { SiteMapPage } from '@/lib/types/siteMap';
import Link from 'next/link';

type Props = {
  links: SiteMapPage[];
  expanded: boolean;
  path: string;
};

const currentBgColor = (link: SiteMapPage, path: string) => {
  if (link.href !== path) return '';
  return 'bg-main/10';
};

const SidebarList = ({ links, path, expanded }: Props) => (
  <List className="px-0 gap-0">
    {links.map((l) => (
      <Link href={l.href} key={l.href} prefetch={!l.href.includes('services/settings/alerts-and-notifications')}>
        <ListItem
          className={`flex items-center rounded-none hover:bg-main py-2.5
            hover:bg-opacity-100 transition-colors duration-300 ease-in-out bg-opacity-100 hover:text-white
            ${currentBgColor(l, path)}
          `}
        >
          <ListItemStart>{l.icon}</ListItemStart>
          <div className={expanded ? 'pl-2' : 'pl-5'}>{l.name}</div>
        </ListItem>
      </Link>
    ))}
  </List>
);

export default SidebarList;
