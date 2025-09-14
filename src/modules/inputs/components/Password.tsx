'use client';

import { IconButton, Input, Tooltip } from '@/lib/mui';
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

type Props = {
  value: string;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  repeatAfter?: string;
  autoComplete?: 'new-password' | 'current-password';
  className?: string;
  onChange: (_: string, _e: string | null) => void;
};

const InputPassword = ({ value, error, disabled, repeatAfter, className, placeholder, autoComplete, onChange }: Props) => {
  const [show, setShow] = useState(false);

  const handleChange = (value: string) => {
    let v = value.trim();
    const allowedChars = /^[A-Za-z0-9!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~]*$/g;
    while (v.length > 0 && (!allowedChars.test(v) || v.length > 64)) {
      v = v.substring(0, v.length - 1);
    }
    if (repeatAfter !== undefined && repeatAfter !== v) {
      onChange(v, 'Powtórz poprawnie swoje hasło.');
      return;
    }
    if (!v.length) {
      onChange(v, 'Hasło jest wymagane.');
      return;
    }
    if (v.length < 8) {
      onChange(v, 'Hasło powinno mieć długość co najmniej 8 znaków.');
      return;
    }
    onChange(v, null);
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        type={show ? 'text' : 'password'}
        color="primary"
        required
        disabled={disabled}
        isError={error}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => handleChange(e.target.value)}
        className={`${className ?? ''}${disabled ? ' cursor-not-allowed' : ''} border-gray-300 bg-white`}
      />
      <Tooltip>
        <Tooltip.Trigger as={IconButton} variant="ghost" onClick={() => setShow(!show)}>
          {show ? <FaRegEyeSlash className="w-5 h-5" /> : <FaRegEye className="w-5 h-5" />}
        </Tooltip.Trigger>
        <Tooltip.Content className="z-20">
          <div>{show ? 'Ukryj hasło' : 'Pokaż hasło'}</div>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
};

export default InputPassword;
