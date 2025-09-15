'use client';

import { removeToken } from '@/lib/auth';
import SkarpaLoader from '@/modules/loaders/components/Loader';
import { logout } from '@/store/slices/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Logout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    removeToken();
    dispatch(logout());
    router.replace('/login');
  };

  useEffect(() => {
    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-y-4">
      <SkarpaLoader size="lg" />
      <div className="animate-pulse text-white text-sm">Wylogowywanie... Proszę czekać</div>
    </div>
  );
};

export default Logout;
