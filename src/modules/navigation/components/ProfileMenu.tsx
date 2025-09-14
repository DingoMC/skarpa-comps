import { Button, Menu, MenuContent, MenuItem, MenuTrigger, Typography } from '@/lib/mui';
import { RootState } from '@/store/store';
import Avatar from 'boring-avatars';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { getProfileMenuItems } from '../utils';

const avatarColors = ['#e3001b', '#170003', '#fce5e7'];

const ProfileMenu = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/logout');
  };

  const profileMenuItems = getProfileMenuItems(handleLogout);

  if (user === null) return null;

  return (
    <Menu open={isMenuOpen} onOpenChange={setIsMenuOpen} placement="bottom-end">
      <MenuTrigger>
        <Button variant="ghost" className="flex items-center gap-1 rounded-full py-0.5 pr-0 pl-0.5">
          <Avatar size={25} colors={avatarColors} name={`${user.firstName} ${user.lastName}`} variant="pixel" />
          <FaChevronDown strokeWidth={2.5} color="gray" className={`h-3 w-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </Button>
      </MenuTrigger>
      <MenuContent className="p-1">
        {profileMenuItems.map((item, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={item.label}
              onClick={() => {
                setIsMenuOpen(false);
                if (item.type === 'action') {
                  item.action();
                }
                if (item.type === 'link') {
                  router.push(item.link);
                }
              }}
              className={`
                flex items-center gap-2 rounded ${isLastItem ? 'hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10' : ''}
              `}
            >
              {item.icon}
              <Typography as="span" className="text-sm font-normal">
                {item.label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuContent>
    </Menu>
  );
};

export default ProfileMenu;
