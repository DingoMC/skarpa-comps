import { Collapse } from '@/lib/mui';
import NavList from './NavList';

type BottomNavbarProps = {
  isNavOpen: boolean;
  toggleIsNavOpen: () => void;
};

const BottomNavbar = ({ isNavOpen, toggleIsNavOpen }: BottomNavbarProps) => (
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
    <Collapse open={isNavOpen} className="overflow-hidden">
      <NavList toggleIsNavOpen={toggleIsNavOpen} />
    </Collapse>
  </div>
);

export default BottomNavbar;
