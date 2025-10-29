'use client';

import { EMPTY_FAMILY_SETTINGS } from '@/lib/constants';
import { Switch, Typography } from '@/lib/mui';
import { FamilySettings } from '@/lib/types/competition';
import { useMemo } from 'react';

type Props = {
  settings: string | null;
  onChange: (_: string) => void;
};

const EditFamilySettings = ({ settings, onChange }: Props) => {
  const data = useMemo(() => (settings === null ? { ...EMPTY_FAMILY_SETTINGS } : (JSON.parse(settings) as FamilySettings)), [settings]);

  const handleChange = (newData: FamilySettings) => {
    onChange(JSON.stringify(newData));
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <Switch
          color="info"
          className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
          checked={data.includePZAMembers}
          onChange={() => handleChange({ ...data, includePZAMembers: !data.includePZAMembers })}
        />
        <Typography className="text-sm">Uwzględniaj osoby z PZA</Typography>
      </div>
    </>
  );
};

export default EditFamilySettings;
