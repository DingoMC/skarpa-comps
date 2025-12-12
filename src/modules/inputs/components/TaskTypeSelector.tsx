'use client';

import { defaultStyleOutlined } from '@/lib/themes/react-select/select';
import Select, { SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  disabled?: boolean;
  onChange: (_: string | null) => void;
};

export const TASK_TYPES = [
  { label: 'Droga na wędke', value: 'route' },
  { label: 'Droga z asekuracją dolną', value: 'lead_route' },
  { label: 'Czasówka', value: 'speed' },
  { label: 'Boulder', value: 'boulder' },
  { label: 'Obwód', value: 'circle' },
  { label: 'Specjalne', value: 'special' },
];

const SelectTaskType = ({ value, disabled, onChange }: Props) => {
  const handleChange = (newValue: SingleValue<OptionType>) => {
    if (!newValue) onChange(null);
    else onChange(newValue.value);
  };

  return (
    <Select<OptionType, false>
      value={TASK_TYPES.filter((option) => value.includes(option.value))}
      components={animatedComponents}
      options={TASK_TYPES}
      onChange={handleChange}
      styles={defaultStyleOutlined<OptionType>({ minWidth: '140px' })}
      isDisabled={disabled}
    />
  );
};

export default SelectTaskType;
