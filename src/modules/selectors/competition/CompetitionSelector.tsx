'use client';

import { Typography } from '@/lib/mui';
import { defaultStyle } from '@/lib/themes/react-select/select';
import { Competition } from '@prisma/client';
import { useMemo } from 'react';
import Select, { SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type Props = {
  data: Competition[];
  currentId?: string;
  onChange: (_: string) => void;
};

type OptionType = {
  label: string;
  value: string;
};

const CompetitionSelector = ({ data, currentId, onChange }: Props) => {
  const options = useMemo(() => data.map((r) => ({ label: r.name, value: r.id })), [data]);

  const handleChange = (newValue: SingleValue<OptionType>) => {
    if (newValue) onChange(newValue.value);
  };

  return (
    <div className="flex flex-col gap-1 mb-2 max-w-[200px]">
      <Typography className="text-xs">(Wybierz zawody)</Typography>
      <Select<OptionType, false>
        placeholder="Wybierz..."
        noOptionsMessage={() => 'Brak zawodów.'}
        value={options.filter((option) => currentId === option.value)}
        components={animatedComponents}
        options={options}
        onChange={handleChange}
        styles={defaultStyle<OptionType>({ minWidth: '140px' })}
      />
    </div>
  );
};

export default CompetitionSelector;
