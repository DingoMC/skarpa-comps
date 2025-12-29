'use client';

import { Input } from '@/lib/mui';
import { useEffect, useState } from 'react';
import { MAX_INPUT_LENGTH } from '../constants';

interface BaseProps {
  error?: boolean;
  placeholder?: string;
  className?: `${string}`;
  disabled?: boolean;
  min?: number;
  max?: number;
  maxPrecision?: number;
}

interface RequiredProps extends BaseProps {
  optional: false;
  value: number;
  onChange: (_: number) => void;
  onError?: (_e: string | null) => void;
}

interface OptionalProps extends BaseProps {
  optional: true;
  value: number | null;
  onChange: (_: number | null) => void;
  onError?: (_e: string | null) => void;
}

type Props = RequiredProps | OptionalProps;

export default function InputRealNumber({
  value,
  error,
  className,
  disabled,
  optional,
  placeholder,
  min,
  max,
  maxPrecision,
  onChange,
  onError,
}: Props) {
  const [tempValue, setTempValue] = useState((value ?? 0).toString());

  const handleChange = (v: string) => {
    if (!v.length) {
      if (optional) {
        onChange(null);
        if (onError !== undefined) onError(null);
      } else {
        onChange(0);
        if (onError !== undefined) onError('To pole jest wymagane.');
      }
      return;
    }
    if (v.endsWith('-') || v.endsWith('.')) {
      if (onError !== undefined) onError('Nieprawidłowa wartość.');
      return;
    }
    const vFloat = parseFloat(v);
    if (min && vFloat < min && max === undefined) {
      onChange(vFloat);
      if (onError !== undefined) onError(`Wartość powinna być nie mniejsza niż ${min}.`);
      return;
    }
    if (max && vFloat > max && min === undefined) {
      onChange(vFloat);
      if (onError !== undefined) onError(`Wartość powinna być nie większa niż ${max}.`);
      return;
    }
    if ((min && vFloat < min) || (max && vFloat > max)) {
      onChange(vFloat);
      if (onError !== undefined) onError(`Wartość powinna mieścić się w przedziale od ${min} do ${max}.`);
      return;
    }
    onChange(vFloat);
    if (onError !== undefined) onError(null);
  };

  useEffect(() => {
    handleChange(tempValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempValue]);

  return (
    <Input
      type="text"
      color="primary"
      required={!optional}
      isError={error}
      value={tempValue}
      disabled={disabled}
      placeholder={placeholder}
      maxLength={MAX_INPUT_LENGTH}
      onChange={(e) => {
        let v = e.target.value.trim().replaceAll(',', '.');
        if (v.length >= 2 && v[0] === '0' && v[1] === '-') v = v.substring(1);
        if (v.length >= 2 && v[0] === '0' && v[1] !== '.') v = v.substring(1);
        const allowedChars = /^-?(\d+.)?\d{0,15}$/;
        if (v.length > MAX_INPUT_LENGTH) v = v.substring(0, MAX_INPUT_LENGTH);
        while (v.length > 0 && !allowedChars.test(v)) {
          v = v.substring(0, v.length - 1);
        }
        if (maxPrecision && v.includes('.') && v.length - v.indexOf('.') - 1 > maxPrecision) {
          v = v.substring(0, v.indexOf('.') + maxPrecision + 1);
        }
        setTempValue(v);
      }}
      className={`${className ?? ''}${disabled ? ' cursor-not-allowed' : ''} border-gray-300 bg-white`}
    />
  );
}
