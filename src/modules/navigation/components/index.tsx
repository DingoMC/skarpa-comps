'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import BottomNavbar from './BottomNavbar';
import { NavbarMediatorProvider, useNavbarMediator } from './Navbar/NavbarMediatorProvider';
import TopNavbar from './TopNavbar';

const NavbarContent = () => {
  const mediator = useNavbarMediator();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960 && mediator.isOpen()) {
        mediator.closeNav();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mediator]);

  return (
    <div className="lg:flex items-center relative bg-main">
      <div className="hidden lg:flex items-center justify-center py-1 h-full md:w-[10rem] lg:w-[14rem]">
        <Link href="/">
          <Image
            priority
            width={150}
            height={55}
            src="/images/skarpa-logo-h-white.png"
            alt="Skarpa logo"
            className="h-[58px] max-w-[100%]"
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1 max-w-full self-start">
        <TopNavbar />
        <BottomNavbar />
      </div>
    </div>
  );
};

const ComplexNavbar = () => (
  <NavbarMediatorProvider>
    <NavbarContent />
  </NavbarMediatorProvider>
);

export default ComplexNavbar;
