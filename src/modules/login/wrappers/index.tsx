'use client';

import { setToken } from '@/lib/auth';
import { login } from '@/store/slices/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Login from '../components';
import { loginUser } from '../requests';

const LoginWrapper = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLoginClick = async (email: string, password: string) => {
    setLoading(true);
    const { success, error, data } = await loginUser(email, password);
    if (success && error === null) {
      setToken(data.token);
      dispatch(login({ ...data }));
      toast.success('Logowanie udane. Nastąpi przekierowanie do strony głównej.');
      router.push('/');
      return;
    }
    toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    setLoading(false);
  };

  return <Login loading={loading} handleLogin={handleLoginClick} />;
};

export default LoginWrapper;
