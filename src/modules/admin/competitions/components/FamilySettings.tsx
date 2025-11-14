'use client';

import { EMPTY_FAMILY_SETTINGS } from '@/lib/constants';
import { Switch, Typography } from '@/lib/mui';
import { FamilySettings } from '@/lib/types/competition';
import AggSumAvgBest from '@/modules/inputs/components/AggSumAvgBest';
import AllTopNSwitch from '@/modules/inputs/components/AllTopNSwitch';
import SelectCategoryMulti from '@/modules/inputs/components/CategorySelectorMulti';
import InputNumber from '@/modules/inputs/components/Number';
import { Category } from '@prisma/client';
import { useMemo } from 'react';

type Props = {
  loading: boolean;
  categories: Category[];
  settings: string | null;
  onChange: (_: string) => void;
};

const EditFamilySettings = ({ settings, categories, loading, onChange }: Props) => {
  const data = useMemo(() => (settings === null ? { ...EMPTY_FAMILY_SETTINGS } : (JSON.parse(settings) as FamilySettings)), [settings]);

  const handleChange = (newData: FamilySettings) => {
    onChange(JSON.stringify(newData));
  };

  return (
    <>
      <div className="flex gap-2 items-end flex-wrap">
        <Switch
          color="info"
          className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5 mb-2"
          checked={data.includePZAMembers}
          disabled={loading}
          onChange={() => handleChange({ ...data, includePZAMembers: !data.includePZAMembers })}
        />
        <Typography className="text-sm mb-2">Uwzględniaj osoby z PZA</Typography>
        {data.includePZAMembers && (
          <div className="flex flex-col gap-px">
            <Typography className="text-xs">Tylko z kategorii (puste = wszyscy):</Typography>
            <SelectCategoryMulti
              value={data.pzaFilterCategories ?? []}
              categories={categories}
              disabled={loading}
              onChange={(v) => handleChange({ ...data, pzaFilterCategories: v })}
            />
          </div>
        )}
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <Typography className="text-sm">Do wyników uwzględnij:</Typography>
        <AllTopNSwitch
          value={data.include}
          disabled={loading}
          onChange={(v) => {
            if (v === 'all') handleChange({ ...data, include: v });
            if (v === 'topN') handleChange({ ...data, include: v, topN: 3 });
          }}
        />
      </div>
      {data.include === 'topN' && (
        <div className="flex gap-2 flex-wrap items-center">
          <Typography className="text-sm">Uwzględnij: </Typography>
          <div className="w-12">
            <InputNumber
              min={1}
              disabled={loading}
              optional={false}
              value={data.topN}
              onChange={(v) => handleChange({ ...data, topN: v })}
            />
          </div>
          <Typography className="text-sm">najlepszych</Typography>
        </div>
      )}
      <div className="flex gap-2 flex-wrap items-center">
        <Typography className="text-sm">Metoda agregacji:</Typography>
        <AggSumAvgBest
          value={data.aggregation}
          disabled={loading}
          onChange={(v) => {
            handleChange({ ...data, aggregation: v });
          }}
        />
      </div>
    </>
  );
};

export default EditFamilySettings;
