'use client';

import { RootState } from '@/store/store';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

type Props = {
  children: React.ReactNode;
};

const TokenGateway = ({ children }: Props) => {
  const router = useRouter();
  const path = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = Cookies.get('token');

  useEffect(() => {
    if (!token && user !== null) {
      router.push('/logout');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, path]);

  return children;
};

export default TokenGateway;
