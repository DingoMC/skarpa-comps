'use client';

import { defaultStyleOutlined } from '@/lib/themes/react-select/select';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type OptionType = {
  label: string;
  value: number;
};

const options = () => {
  const opts: OptionType[] = [];
  const max = new Date().getFullYear();
  const min = max - 100;
  for (let i = min; i <= max; i++) {
    opts.push({ label: i.toFixed(0), value: i });
  }
  return opts;
};

type Props = {
  value: number;
  disabled?: boolean;
  onChange: (_: number) => void;
};

const SelectBirthYear = ({ value, disabled, onChange }: Props) => {
  return (
    <Select<OptionType>
      value={options().find((option) => option.value === value) ?? null}
      defaultValue={{ label: new Date().getFullYear().toFixed(0), value: new Date().getFullYear() }}
      components={animatedComponents}
      options={options()}
      onChange={(v) => onChange(v?.value ?? new Date().getFullYear())}
      styles={defaultStyleOutlined<OptionType>({ minWidth: '60px', menuHeight: '200px' })}
      isDisabled={disabled}
    />
  );
};

export default SelectBirthYear;
