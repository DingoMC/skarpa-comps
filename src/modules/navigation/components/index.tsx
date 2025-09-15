'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import BottomNavbar from './BottomNavbar';
import TopNavbar from './TopNavbar';

const ComplexNavbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960 && isNavOpen) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isNavOpen]);

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
        <TopNavbar toggleIsNavOpen={toggleIsNavOpen} />
        <BottomNavbar isNavOpen={isNavOpen} toggleIsNavOpen={toggleIsNavOpen} />
      </div>
    </div>
  );
};

export default ComplexNavbar;
