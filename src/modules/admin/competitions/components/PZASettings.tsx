'use client';

import { Switch, Typography } from '@/lib/mui';
import { PZASettings } from '@/lib/types/competition';
import SelectCategoryMulti from '@/modules/inputs/components/CategorySelectorMulti';
import { Category } from '@prisma/client';
import { useMemo } from 'react';

type Props = {
  loading: boolean;
  categories: Category[];
  settings: string | null;
  onChange: (_: string) => void;
};

const EditPZASettings = ({ settings, categories, loading, onChange }: Props) => {
  const data = useMemo(
    () => (settings === null ? { pzaTakesPlaces: false, pzaFilterCategories: null } : (JSON.parse(settings) as PZASettings)),
    [settings]
  );

  const handleChange = (newData: PZASettings) => {
    onChange(JSON.stringify(newData));
  };

  return (
    <div className="flex gap-2 items-end flex-wrap">
      <Switch
        color="info"
        className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5 mb-2"
        checked={data.pzaTakesPlaces}
        disabled={loading}
        onChange={() => handleChange({ ...data, pzaTakesPlaces: !data.pzaTakesPlaces })}
      />
      <Typography className="text-sm mb-2">PZA Zajmuje miejsca</Typography>
      {data.pzaTakesPlaces && (
        <div className="flex flex-col gap-px">
          <Typography className="text-xs">Tylko dla kategorii (puste = wszyscy):</Typography>
          <SelectCategoryMulti
            value={data.pzaFilterCategories ?? []}
            categories={categories}
            disabled={loading}
            onChange={(v) => handleChange({ ...data, pzaFilterCategories: v })}
          />
        </div>
      )}
    </div>
  );
};

export default EditPZASettings;
