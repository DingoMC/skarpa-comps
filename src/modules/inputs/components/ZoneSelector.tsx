'use client';

import { defaultStyleOutlined } from '@/lib/themes/react-select/select';
import { TaskZone } from '@/lib/types/task';
import { useMemo } from 'react';
import Select, { SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  zones: TaskZone[];
  value: string | null;
  disabled?: boolean;
  onChange: (_: string | null) => void;
};

export const generateZoneLabel = (zone?: TaskZone) => {
  if (!zone) return 'N/A';
  return `${zone.name} (${zone.shortName}) - ${zone.score}`;
};

const SelectZone = ({ zones, value, disabled, onChange }: Props) => {
  const options = useMemo(() => zones.map((r) => ({ label: generateZoneLabel(r), value: r.shortName })), [zones]);

  const handleChange = (newValue: SingleValue<OptionType>) => {
    if (!newValue) onChange(null);
    else onChange(newValue.value);
  };

  return (
    <Select<OptionType, false>
      placeholder="Wybierz..."
      noOptionsMessage={() => 'Brak opcji.'}
      value={options.filter((option) => (value !== null ? value.includes(option.value) : null))}
      components={animatedComponents}
      options={options}
      onChange={handleChange}
      styles={defaultStyleOutlined<OptionType>({ minWidth: '140px' })}
      isDisabled={disabled}
    />
  );
};

export default SelectZone;
