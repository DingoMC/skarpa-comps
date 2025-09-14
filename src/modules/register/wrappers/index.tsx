'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { User } from '../../../../generated/prisma';
import Register from '../components';
import { registerUser } from '../requests';

const RegisterWrapper = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegisterClick = async (userData: User) => {
    setLoading(true);
    const { success, error } = await registerUser(userData);
    if (success && error === null) {
      toast.success('Rejestracja zakończona sukcesem. Nastąpi przekierowanie do logowania.');
      setLoading(false);
      router.push('/login');
      return;
    }
    toast.error(error ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    setLoading(false);
  };

  return <Register loading={loading} handleRegister={handleRegisterClick} />;
};

export default RegisterWrapper;
