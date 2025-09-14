import { IconButton, Typography } from '@/lib/mui';
import { siteMapByPath } from '@/lib/siteMap';
import { usePathname } from 'next/navigation';
import { FaBars } from 'react-icons/fa6';
import ProfileMenu from './ProfileMenu';

const TopNavbar = ({ toggleIsNavOpen }: { toggleIsNavOpen: () => void }) => {
  const navbarStyle: React.CSSProperties = {
    display: 'flex',
    position: 'relative',
    zIndex: 2,
    height: '50%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 0 1px 0 #222222, 0 0 1px 0 #222222',
  };
  const pathName = usePathname();
  const { name } = siteMapByPath.get(pathName);

  return (
    <div
      className={`
        w-full
        h-[50%]
        rounded-none
        pb-0
        pt-0
        lg:pl-6
        max-w-full
        bg-white
        bg-opacity-100
        border-none
        outline-none
        focus:outline-none
        shadow-none
        md:rounded-bl-3xl
        pr-2
      `}
      style={navbarStyle}
    >
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute w-full flex justify-center px-4">
          <Typography
            variant="h6"
            style={{ maxWidth: '200px', whiteSpace: 'nowrap' }}
            className="font-normal text-gray-400 text-sm lg:text-base"
          >
            {name}
          </Typography>
        </div>
      </div>
      <div className="relative mx-auto flex items-center justify-between h-[33px]" style={{ flexShrink: 0 }}>
        <div className="flex items-center ml-auto">
          <IconButton size="sm" color="secondary" variant="ghost" onClick={toggleIsNavOpen} className="lg:hidden">
            <FaBars className="h-6 w-6" />
          </IconButton>
          <div className="hidden lg:block">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
