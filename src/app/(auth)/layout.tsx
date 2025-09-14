'use client';

import '@/app/globals.css';
import { ThemeProvider } from '@/lib/mui';
import { particleOptions, particleOptionsMobile } from '@/lib/particles';
import { cardBodyTheme, cardFooterTheme, cardHeaderTheme, cardTheme, inputTheme } from '@/lib/themes';
import { StoreProvider } from '@/lib/wrappers/StoreProvider';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { loadFull } from 'tsparticles';

const customTheme = {
  card: cardTheme,
  cardHeader: cardHeaderTheme,
  cardFooter: cardFooterTheme,
  cardBody: cardBodyTheme,
  input: inputTheme,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [init, setInit] = useState(false);
  const [windowSize, setWindowSize] = useState([-1, -1]);
  const options = useMemo(() => (windowSize[0] >= 720 ? particleOptions : particleOptionsMobile), [windowSize]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    setWindowSize([window.innerWidth, window.innerHeight]);
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <html className="h-full" lang="en">
      <body className="h-full flex flex-col m-0 bg-main-gradient">
        <StoreProvider>
          <ThemeProvider value={customTheme}>
            <div className="h-full flex flex-col items-center md:justify-center m-4 relative z-10 bg-transparent">
              <Image src="/skarpa-logo-h-white.png" alt="Skarpa Logo" width={200} height={55} />
              {children}
            </div>
            <ToastContainer position="bottom-right" />
          </ThemeProvider>
          {init && <Particles id="tsparticles" options={options} />}
        </StoreProvider>
      </body>
    </html>
  );
}
