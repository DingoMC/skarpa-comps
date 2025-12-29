'use client';

import InputNumber from './Number';

const getMax = () => new Date().getFullYear();

const getMin = () => getMax() - 100;

type Props = {
  value: number;
  error?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onChange: (_: number, _e: string | null) => void;
};

const InputBirthYear = ({ value, disabled, error, placeholder, className, onChange }: Props) => {
  return (
    <InputNumber
      optional={false}
      value={value}
      onChange={onChange}
      error={error}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      min={getMin()}
      max={getMax()}
    />
  );
};

export default InputBirthYear;
