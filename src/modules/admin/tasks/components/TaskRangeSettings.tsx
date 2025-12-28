'use client';

import { Typography } from '@/lib/mui';
import { TaskRange, TaskSettings, TaskSettingsRanges } from '@/lib/types/task';
import TemplateButton from '@/modules/buttons/TemplateButton';
import InputRealNumber from '@/modules/inputs/components/RealNumber';
import { useEffect, useState } from 'react';
import { FaArrowsLeftRightToLine } from 'react-icons/fa6';
import NewRangeDialog from './NewRangeDialog';

type Props = {
  data: TaskSettingsRanges;
  loading: boolean;
  handleChange: (newData: TaskSettings) => void;
  onError: (_: boolean) => void;
};

const rangeKey = (r: TaskRange) => `${r.minInclusive ? '[' : '('}${r.min}to${r.max}${r.maxInclusive ? ']' : ')'}`;

const EditTaskRangeSettings = ({ data, loading, handleChange, onError }: Props) => {
  const [errorOMin, setErrorOMin] = useState<string | null>(null);
  const [errorOMax, setErrorOMax] = useState<string | null>(null);

  useEffect(() => {
    onError(errorOMin !== null || errorOMax !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorOMin, errorOMax]);

  return (
    <div className="border border-gray-300 rounded-lg p-2">
      <div className="flex items-center justify-between w-full">
        <Typography className="font-semibold">Przedziały</Typography>
        <NewRangeDialog
          loading={loading}
          otherRanges={data.ranges.data.toSorted((a, b) => b.min - a.min)}
          onConfirm={(r) => handleChange({ ...data, ranges: { ...data.ranges, data: [...data.ranges.data, r] } })}
        />
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      {!data.ranges.data.length && <Typography className="text-xs text-red-600">Nie zdefiniowano żadnych przedziałów.</Typography>}
      <div className="flex flex-col gap-1">
        {data.ranges.data
          .toSorted((a, b) => a.score - b.score)
          .map((r) => (
            <div key={rangeKey(r)} className="flex items-center justify-between gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <FaArrowsLeftRightToLine className="w-4 h-4 text-purple-600" />
                <Typography className="text-sm">
                  {`${r.minInclusive ? '[' : '('}${r.min}, ${r.max}${r.maxInclusive ? ']' : ')'}: ${r.score} pkt.`}
                </Typography>
              </div>
              <TemplateButton
                disabled={loading}
                template="delete"
                onClick={() => {
                  handleChange({ ...data, ranges: { ...data.ranges, data: data.ranges.data.filter((v) => rangeKey(v) !== rangeKey(r)) } });
                }}
              />
            </div>
          ))}
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      <div className="flex flex-col md:grid md:grid-cols-[max-content_1fr] gap-2 mt-2 md:items-center">
        <Typography className="text-foreground text-sm">{`< Min.:`}</Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0 w-max">
          <InputRealNumber
            optional={false}
            disabled={loading}
            error={errorOMin !== null}
            value={data.ranges.outOfMin}
            onChange={(v) => {
              handleChange({ ...data, ranges: { ...data.ranges, outOfMin: v } });
            }}
            onError={(e) => setErrorOMin(e)}
          />
          {errorOMin !== null && <Typography className="text-xs text-red-600">{errorOMin}</Typography>}
        </div>
        <Typography className="text-foreground text-sm">{`> Max.:`}</Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0 w-max">
          <InputRealNumber
            optional={false}
            disabled={loading}
            value={data.ranges.outOfMax}
            error={errorOMax !== null}
            onChange={(v) => {
              handleChange({ ...data, ranges: { ...data.ranges, outOfMax: v } });
            }}
            onError={(e) => setErrorOMax(e)}
          />
          {errorOMax !== null && <Typography className="text-xs text-red-600">{errorOMax}</Typography>}
        </div>
      </div>
    </div>
  );
};

export default EditTaskRangeSettings;
