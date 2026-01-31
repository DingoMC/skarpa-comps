import { FaPowerOff, FaUser } from 'react-icons/fa6';
import { MenuItemType } from '../types';

export const getProfileMenuItems = (handleLogout: () => void) => {
  const items: MenuItemType[] = [];
  items.push({
    type: 'link',
    label: 'Mój Profil',
    icon: <FaUser className="w-4 h-4" />,
    link: '/profile',
  });
  items.push({
    type: 'action',
    label: 'Wyloguj się',
    icon: <FaPowerOff className="w-4 h-4 text-red-500" />,
    action: () => handleLogout(),
  });
  return items;
};
