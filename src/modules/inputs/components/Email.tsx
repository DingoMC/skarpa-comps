'use client';

import { Input } from '@/lib/mui';

type Props = {
  value: string;
  error?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onChange: (_: string, _e: string | null) => void;
};

const InputEmail = ({ value, error, className, disabled, placeholder, onChange }: Props) => {
  const handleChange = (value: string) => {
    let v = value.trim();
    const allowedChars = /^[\w\-\.@]*$/g;
    while (v.length > 0 && (!allowedChars.test(v) || v.length > 64)) {
      v = v.substring(0, v.length - 1);
    }
    if (!v.length) {
      onChange(v, 'Adres Email jest wymagany.');
      return;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(v)) onChange(v, null);
    else onChange(v, 'Nieprawidłowy adres email.');
  };

  return (
    <Input
      type="email"
      color="primary"
      required
      isError={error}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete="email"
      onChange={(e) => handleChange(e.target.value)}
      className={`${className ?? ''}${disabled ? ' cursor-not-allowed' : ''} border-gray-300 bg-white`}
    />
  );
};

export default InputEmail;
