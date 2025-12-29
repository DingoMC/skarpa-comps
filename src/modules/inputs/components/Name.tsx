'use client';

import { Input } from '@/lib/mui';
import { HTMLInputAutoCompleteAttribute } from 'react';
import { MAX_INPUT_LENGTH } from '../constants';

type Props = {
  value: string;
  error?: boolean;
  placeholder?: string;
  className?: `${string}`;
  disabled?: boolean;
  allowMultiple?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  onChange: (_: string, _e: string | null) => void;
};

const InputName = ({ value, error, disabled, className, placeholder, allowMultiple, autoComplete, onChange }: Props) => {
  const handleChange = (value: string) => {
    let v = value;
    const allowedChars = /^[a-zA-ZżźćńłśąęóŻŹĆŃŁĄŚĘÓ\s\-]*$/g;
    while (v.length > 0 && (!allowedChars.test(v) || v.length > MAX_INPUT_LENGTH)) {
      v = v.substring(0, v.length - 1);
    }
    if (!v.trim().length) {
      onChange(v, 'Proszę wypełnić to pole.');
      return;
    }
    if (allowMultiple === true) {
      const nameRegex = /^[a-zA-ZżźćńłśąęóŻŹĆŃŁĄŚĘÓ]{2,51}([\s\-][a-zA-ZżźćńłśąęóŻŹĆŃŁĄŚĘÓ]{2,51})*$/g;
      if (nameRegex.test(v)) onChange(v, null);
      else onChange(v, 'Podano nieprawidłową wartość.');
      return;
    }
    const nameRegex = /^[a-zA-ZżźćńłśąęóŻŹĆŃŁĄŚĘÓ]{2,51}$/g;
    if (nameRegex.test(v)) onChange(v, null);
    else onChange(v, 'Podano nieprawidłową wartość.');
  };

  return (
    <Input
      type="text"
      color="primary"
      required
      isError={error}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      maxLength={MAX_INPUT_LENGTH}
      onChange={(e) => handleChange(e.target.value)}
      disabled={disabled}
      className={`${className ?? ''}${disabled ? ' cursor-not-allowed' : ''} border-gray-300 bg-white`}
    />
  );
};

export default InputName;
