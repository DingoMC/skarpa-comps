'use client';

import { transformRoleName } from '@/lib/text';
import { defaultStyleOutlined } from '@/lib/themes/react-select/select';
import { Role } from '@prisma/client';
import { useMemo } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  roles: Role[];
  value: string;
  disabled?: boolean;
  onChange: (_: string) => void;
};

const SelectRole = ({ roles, value, disabled, onChange }: Props) => {
  const options = useMemo(() => roles.map((r) => ({ label: transformRoleName(r.name), value: r.id })), [roles]);

  return (
    <Select<OptionType>
      value={options.find((option) => option.value === value) ?? null}
      components={animatedComponents}
      options={options}
      onChange={(v) => onChange(v?.value ?? '')}
      styles={defaultStyleOutlined<OptionType>({ minWidth: '140px' })}
      isDisabled={disabled}
    />
  );
};

export default SelectRole;
