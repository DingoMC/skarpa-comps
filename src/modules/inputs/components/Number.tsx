'use client';

import { Input } from '@/lib/mui';
import { MAX_INPUT_LENGTH } from '../constants';

interface BaseProps {
  error?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

interface RequiredProps extends BaseProps {
  optional: false;
  value: number;
  onChange: (_: number, _e: string | null) => void;
}

interface OptionalProps extends BaseProps {
  optional: true;
  value: number | null;
  onChange: (_: number | null, _e: string | null) => void;
}

type Props = RequiredProps | OptionalProps;

export default function InputNumber({ value, error, className, disabled, optional, placeholder, min, max, onChange }: Props) {
  const handleChange = (value: string) => {
    let v = value.trim();
    const allowedChars = /^\d*$/;
    if (v.length > MAX_INPUT_LENGTH) v = v.substring(0, MAX_INPUT_LENGTH);
    while (v.length > 0 && !allowedChars.test(v)) {
      v = v.substring(0, v.length - 1);
    }
    if (!v.length) {
      if (optional) onChange(null, null);
      else onChange(0, 'To pole jest wymagane.');
      return;
    }
    const vInt = parseInt(v, 10);
    if (min && vInt < min && max === undefined) {
      onChange(vInt, `Wartość powinna być nie mniejsza niż ${min}.`);
      return;
    }
    if (max && vInt > max && min === undefined) {
      onChange(vInt, `Wartość powinna być nie większa niż ${max}.`);
      return;
    }
    if ((min && vInt < min) || (max && vInt > max)) {
      onChange(vInt, `Wartość powinna mieścić się w przedziale od ${min} do ${max}.`);
      return;
    }
    onChange(vInt, null);
  };

  return (
    <Input
      type="text"
      color="primary"
      required={!optional}
      isError={error}
      value={value === null ? '' : value.toFixed(0)}
      disabled={disabled}
      placeholder={placeholder}
      maxLength={MAX_INPUT_LENGTH}
      onChange={(e) => handleChange(e.target.value)}
      className={`${className ?? ''}${disabled ? ' cursor-not-allowed' : ''} border-gray-300 bg-white`}
    />
  );
}
