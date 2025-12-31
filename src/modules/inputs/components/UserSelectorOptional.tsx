'use client';

import { transformName } from '@/lib/text';
import { defaultStyleOutlined } from '@/lib/themes/react-select/select';
import { UserUI } from '@/lib/types/auth';
import { useMemo } from 'react';
import Select, { SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  users: UserUI[];
  value: string | null;
  disabled?: boolean;
  onChange: (_: string | null) => void;
};

const SelectUserOptional = ({ users, value, disabled, onChange }: Props) => {
  const options = useMemo(
    () => users.map((u) => ({ label: `${transformName(u.firstName)} ${transformName(u.lastName)} (${u.yearOfBirth})`, value: u.id })),
    [users]
  );

  const handleChange = (newValue: SingleValue<OptionType>) => {
    if (!newValue) onChange(null);
    else onChange(newValue.value);
  };

  return (
    <Select<OptionType, false>
      placeholder="Wybierz..."
      noOptionsMessage={() => 'Brak opcji.'}
      value={options.filter((option) => value === option.value)}
      components={animatedComponents}
      options={options}
      onChange={handleChange}
      styles={defaultStyleOutlined<OptionType>({ minWidth: '140px' })}
      isDisabled={disabled}
      isClearable
      closeMenuOnSelect
    />
  );
};

export default SelectUserOptional;
