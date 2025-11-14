'use client';

import { defaultStyleOutlined } from '@/lib/themes/react-select/select';
import { Category } from '@prisma/client';
import { useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  categories: Category[];
  value: string[];
  disabled?: boolean;
  onChange: (_: string[] | null) => void;
};

const SelectCategoryMulti = ({ categories, value, disabled, onChange }: Props) => {
  const options = useMemo(() => categories.map((r) => ({ label: r.name, value: r.id })), [categories]);

  const handleChange = (newValue: MultiValue<OptionType>) => {
    if (!newValue) onChange(null);
    if (!newValue.length) onChange(null);
    else onChange(newValue.map((v) => v.value));
  };

  return (
    <Select<OptionType, true>
      isMulti
      value={options.filter((option) => value.includes(option.value))}
      components={animatedComponents}
      options={options}
      onChange={handleChange}
      styles={defaultStyleOutlined<OptionType>({ minWidth: '140px' })}
      isDisabled={disabled}
      closeMenuOnSelect={false}
    />
  );
};

export default SelectCategoryMulti;
