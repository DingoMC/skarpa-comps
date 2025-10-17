'use client';

import { Input } from '@/lib/mui';
import { MAX_INPUT_LENGTH } from '../constants';

type Props = {
  value: string;
  error?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (_: string, _e: string | null) => void;
};

const InputString = ({ value, error, className, disabled, required, placeholder, onChange }: Props) => {
  const handleChange = (value: string) => {
    let v = value;
    if (v.length > MAX_INPUT_LENGTH) v = v.substring(0, MAX_INPUT_LENGTH);
    if (required && !v.trim().length) {
      onChange(v, 'To pole jest wymagane.');
      return;
    }
    onChange(v, null);
  };

  return (
    <Input
      type="text"
      color="primary"
      required={required}
      isError={error}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      maxLength={MAX_INPUT_LENGTH}
      onChange={(e) => handleChange(e.target.value)}
      className={`${className ?? ''}${disabled ? ' cursor-not-allowed' : ''} border-gray-300 bg-white`}
    />
  );
};

export default InputString;
