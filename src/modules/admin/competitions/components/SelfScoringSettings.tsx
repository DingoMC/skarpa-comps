'use client';

import { Button, Switch, Typography } from '@/lib/mui';
import { SelfScoringCategorySettings, SelfScoringSettings } from '@/lib/types/competition';
import SelectCategory from '@/modules/inputs/components/CategorySelector';
import InputDateTimeRange from '@/modules/inputs/components/DateTimeRange';
import { Category } from '@prisma/client';
import { useMemo, useState } from 'react';

type Props = {
  loading: boolean;
  categories: Category[];
  settings: string | null;
  onChange: (_: string) => void;
};

const EditSelfScoringSettings = ({ settings, categories, loading, onChange }: Props) => {
  const data = useMemo(
    () => (settings === null ? { allowSelfScoring: false, settings: [] } : (JSON.parse(settings) as SelfScoringSettings)),
    [settings]
  );
  const remainingCategories = useMemo(
    () => categories.filter((c) => !data.settings.map((s) => s.categoryId).includes(c.id)),
    [categories, data]
  );
  const [addData, setAddData] = useState<SelfScoringCategorySettings>({
    categoryId: '',
    modifyAfterSent: false,
    selfScoringFrom: undefined,
    selfScoringTo: undefined,
  });
  const addDataDurationError = useMemo(() => {
    if (addData.selfScoringFrom && addData.selfScoringTo && addData.selfScoringFrom >= addData.selfScoringTo) {
      return 'Nieprawidłowy zakres czasowy.';
    }
    return null;
  }, [addData]);

  const handleChange = (newData: SelfScoringSettings) => {
    onChange(JSON.stringify(newData));
  };

  return (
    <>
      <div className="flex gap-2 items-center flex-wrap">
        <Switch
          color="success"
          className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
          checked={data.allowSelfScoring}
          disabled={loading}
          onChange={() => handleChange({ ...data, allowSelfScoring: !data.allowSelfScoring })}
        />
        <Typography className="text-sm">Zezwalaj</Typography>
      </div>
      {remainingCategories.length > 0 && (
        <div className="border rounded border-gray-400 p-2 grid grid-cols-2 gap-2 items-center">
          <Typography className="text-sm">Kategoria:</Typography>
          <SelectCategory
            categories={remainingCategories}
            value={addData.categoryId}
            disabled={loading}
            onChange={(v) => {
              if (v !== null) setAddData((prev) => ({ ...prev, categoryId: v }));
            }}
          />
          <div className="flex gap-2 items-center flex-wrap col-span-2">
            <Switch
              color="success"
              className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
              checked={addData.modifyAfterSent}
              disabled={loading}
              onChange={() => setAddData((prev) => ({ ...prev, modifyAfterSent: !prev.modifyAfterSent }))}
            />
            <Typography className="text-sm">Możliwość modyfikacji</Typography>
          </div>
          <div className="flex gap-2 items-center flex-wrap col-span-2">
            <Switch
              color="warning"
              className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
              checked={addData.selfScoringFrom !== undefined && addData.selfScoringTo !== undefined}
              disabled={loading}
              onChange={() => {
                if (addData.selfScoringFrom && addData.selfScoringTo) {
                  setAddData((prev) => ({ ...prev, selfScoringFrom: undefined, selfScoringTo: undefined }));
                } else {
                  setAddData((prev) => ({ ...prev, selfScoringFrom: new Date().getTime(), selfScoringTo: new Date().getTime() }));
                }
              }}
            />
            <Typography className="text-sm">Ograniczenie czasowe</Typography>
          </div>
          {addData.selfScoringFrom !== undefined && addData.selfScoringTo !== undefined && (
            <div className="col-span-2 flex flex-col gap-px mb-2 md:mb-0 w-max">
              <InputDateTimeRange
                begin={addData.selfScoringFrom}
                end={addData.selfScoringTo}
                disabled={loading}
                error={addDataDurationError !== null}
                handleBeginChange={(v) => setAddData((prev) => ({ ...prev, selfScoringFrom: v }))}
                handleEndChange={(v) => setAddData((prev) => ({ ...prev, selfScoringTo: v }))}
              />
              {addDataDurationError !== null && <Typography className="text-xs text-red-600">{addDataDurationError}</Typography>}
            </div>
          )}
          <div className="col-span-2 flex justify-end">
            <Button
              disabled={loading || addDataDurationError !== null || !addData.categoryId.length}
              onClick={() => {
                handleChange({ ...data, settings: [...data.settings, { ...addData }] });
                setAddData({
                  categoryId: '',
                  modifyAfterSent: false,
                  selfScoringFrom: undefined,
                  selfScoringTo: undefined,
                });
              }}
            >
              Dodaj
            </Button>
          </div>
        </div>
      )}
      {data.settings.map((d) => (
        <div key={d.categoryId} className="border rounded border-gray-400 p-2 flex flex-col gap-2">
          <Typography className="text-sm font-semibold">
            {`Kategoria: ${categories.find((c) => c.id === d.categoryId)?.name ?? 'N/A'}`}
          </Typography>
          <Typography className={`text-sm ${d.modifyAfterSent ? 'text-green-900' : 'text-red-900'}`}>
            {d.modifyAfterSent ? 'Możliwość modyfikacji wpisanych wyników.' : 'Brak możliwości modyfikacji wpisanych wyników.'}
          </Typography>
          {d.selfScoringFrom !== undefined && d.selfScoringTo !== undefined ? (
            <Typography className="text-sm text-amber-900">{`
              Ograniczenie czasowe: ${new Date(d.selfScoringFrom).toLocaleString()} - ${new Date(d.selfScoringTo).toLocaleString()}
            `}</Typography>
          ) : (
            <Typography className="text-sm text-blue-900">Brak ograniczenia czasowego</Typography>
          )}
          <div className="flex justify-end w-full">
            <Button
              color="warning"
              onClick={() => handleChange({ ...data, settings: data.settings.filter((v) => v.categoryId !== d.categoryId) })}
            >
              Usuń
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};

export default EditSelfScoringSettings;
