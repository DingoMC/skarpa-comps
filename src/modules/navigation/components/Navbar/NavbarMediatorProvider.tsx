import { createContext, useContext, useMemo } from 'react';
import { NavbarMediator } from '../../types/navbar';
import { NavbarMediatorImpl } from '../../types/navbar/mediator';

const NavbarMediatorContext = createContext<NavbarMediator | null>(null);

export const useNavbarMediator = () => {
  const ctx = useContext(NavbarMediatorContext);
  if (!ctx) throw new Error('NavbarMediatorContext not found');
  return ctx;
};

export const NavbarMediatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mediator = useMemo(() => new NavbarMediatorImpl(), []);
  return <NavbarMediatorContext.Provider value={mediator}>{children}</NavbarMediatorContext.Provider>;
};
