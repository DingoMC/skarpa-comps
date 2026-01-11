'use client';

import { defaultStyleOutlined } from '@/lib/themes/react-select/select';
import Select, { SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { RENUMBER_ORDER_OPTIONS } from '../constants';

const animatedComponents = makeAnimated();

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  disabled?: boolean;
  onChange: (_: string) => void;
};

const SelectReNumberOrder = ({ value, disabled, onChange }: Props) => {
  const handleChange = (newValue: SingleValue<OptionType>) => {
    if (!newValue) return;
    onChange(newValue.value);
  };

  return (
    <Select<OptionType, false>
      value={RENUMBER_ORDER_OPTIONS.filter((option) => value.includes(option.value))}
      components={animatedComponents}
      options={RENUMBER_ORDER_OPTIONS}
      onChange={handleChange}
      styles={defaultStyleOutlined<OptionType>({ minWidth: '140px' })}
      isDisabled={disabled}
    />
  );
};

export default SelectReNumberOrder;
