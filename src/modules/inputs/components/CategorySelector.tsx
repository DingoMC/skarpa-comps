'use client';

import { defaultStyleOutlined } from '@/lib/themes/react-select/select';
import { Category } from '@prisma/client';
import { useMemo } from 'react';
import Select, { SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  categories: Category[];
  value: string;
  labelYears?: boolean;
  disabled?: boolean;
  onChange: (_: string | null) => void;
};

const generateLabel = (category: Category, labelYears?: boolean) => {
  if (!labelYears) return category.name;
  const year = new Date().getFullYear();
  if (category.minAge !== null && category.maxAge !== null) {
    return `${category.name} (${year - category.maxAge} - ${year - category.minAge})`;
  }
  if (category.minAge !== null) {
    return `${category.name} (${year - category.minAge} i starsi)`;
  }
  if (category.maxAge !== null) {
    return `${category.name} (${year - category.maxAge} i młodsi)`;
  }
  return category.name;
};

const SelectCategory = ({ categories, value, labelYears, disabled, onChange }: Props) => {
  const options = useMemo(() => categories.map((r) => ({ label: generateLabel(r, labelYears), value: r.id })), [categories, labelYears]);

  const handleChange = (newValue: SingleValue<OptionType>) => {
    if (!newValue) onChange(null);
    else onChange(newValue.value);
  };

  return (
    <Select<OptionType, false>
      placeholder="Wybierz..."
      noOptionsMessage={() => 'Brak opcji.'}
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

export default SelectCategory;
