'use client';

import { MenuItem, Typography } from '@/lib/mui';
import { useRouter } from 'next/navigation';
import { getProfileMenuItems } from '../utils';

const NavList = ({ toggleIsNavOpen }: {
  toggleIsNavOpen: () => void
}) => {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/logout');
  };

  const navListItems = getProfileMenuItems(handleLogout);

  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {navListItems.map((item) => (
        <Typography
          key={item.label}
          as="a"
          href="#"
          className="text-sm text-white"
        >
          <MenuItem
            className="
              flex
              items-center
              gap-2
              lg:rounded-full
              hover:bg-white
              focus:bg-white
              active:bg-white
              active:text-main
              focus:text-main
              hover:text-main
              hover:bg-opacity-100
              focus:bg-opacity-100
              active:bg-opacity-100"
            onClick={() => {
              toggleIsNavOpen();
              if (item.type === 'action') {
                item.action();
              }
              if (item.type === 'link') {
                router.push(item.link);
              }
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
};

export default NavList;
