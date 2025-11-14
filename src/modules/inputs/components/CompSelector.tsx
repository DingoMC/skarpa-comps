'use client';

import { defaultStyleOutlined } from '@/lib/themes/react-select/select';
import { Competition } from '@prisma/client';
import { useMemo } from 'react';
import Select, { SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  competitions: Competition[];
  value: string;
  disabled?: boolean;
  onChange: (_: string | null) => void;
};

const SelectCompetition = ({ competitions, value, disabled, onChange }: Props) => {
  const options = useMemo(() => competitions.map((r) => ({ label: r.name, value: r.id })), [competitions]);

  const handleChange = (newValue: SingleValue<OptionType>) => {
    if (!newValue) onChange(null);
    else onChange(newValue.value);
  };

  return (
    <Select<OptionType, false>
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

export default SelectCompetition;
