'use client';

import { Button, Typography } from '@/lib/mui';
import InputEmail from '@/modules/inputs/components/Email';
import InputPassword from '@/modules/inputs/components/Password';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Props = {
  loading: boolean;
  handleLogin: (_e: string, _p: string) => Promise<void>;
};

const Login = ({ loading, handleLogin }: Props) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const loginDisabled = useMemo(() => !email.length || !password.length, [email, password]);

  return (
    <div
      className={`w-full md:w-2/3 lg:w-1/2 p-2 md:p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col shadow shadow-white
        md:items-center md:grid md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] md:gap-2 gap-[2px]`}
    >
      <div className="md:col-span-2 flex justify-center mb-2">
        <Typography type="h5" className="text-gray-800">
          Logowanie
        </Typography>
      </div>
      <Typography type="p">E-Mail:</Typography>
      <InputEmail placeholder="jan.kowalski@gmail.com" disabled={loading} value={email} onChange={(v) => setEmail(v)} />
      <Typography type="p" className="mt-2 md:mt-0">
        Hasło:
      </Typography>
      <InputPassword
        placeholder="********"
        disabled={loading}
        value={password}
        autoComplete="current-password"
        onChange={(v) => setPassword(v)}
      />
      <div className="md:col-span-2 flex justify-center mt-2">
        <Button
          color="info"
          disabled={loading || loginDisabled}
          onClick={() => handleLogin(email, password)}
          className={`${loading || loginDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </Button>
      </div>
      <div className="md:col-span-2 flex flex-col gap-2 md:gap-0 md:flex-row md:items-center md:justify-between mt-2 md:mt-0">
        <Link href="/" className="underline text-blue-950 text-xs">
          {`< Powrót do strony głównej`}
        </Link>
        <Typography className="text-xs text-center">
          Nie posiadasz jeszcze konta?{' '}
          <Link href="/register" className="underline text-blue-950">
            Zarejestruj się
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default Login;
