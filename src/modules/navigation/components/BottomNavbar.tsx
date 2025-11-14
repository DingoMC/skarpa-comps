import { Collapse } from '@/lib/mui';
import { useEffect, useState } from 'react';
import NavList from './NavList';
import { useNavbarMediator } from './Navbar/NavbarMediatorProvider';

const BottomNavbar = () => {
  const mediator = useNavbarMediator();
  const [open, setOpen] = useState(mediator.isOpen());

  useEffect(() => mediator.subscribe(setOpen), [mediator]);

  return (
    <div
      className="
        w-full
        h-[50%]
        p-0
        pr-3
        rounded-none
        lg:pl-6
        max-w-full
        bg-white
        bg-opacity-100
        border-none
        outline-none
        focus:outline-none
        shadow-none"
    >
      <Collapse open={open} className="overflow-hidden">
        <NavList />
      </Collapse>
    </div>
  );
};

export default BottomNavbar;
