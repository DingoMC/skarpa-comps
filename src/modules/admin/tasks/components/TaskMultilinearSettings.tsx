'use client';

import { Typography } from '@/lib/mui';
import { TaskMultilinearCoeff, TaskSettings, TaskSettingsMultilinear } from '@/lib/types/task';
import TemplateButton from '@/modules/buttons/TemplateButton';
import InputRealNumber from '@/modules/inputs/components/RealNumber';
import { useEffect, useState } from 'react';
import { FaArrowsLeftRightToLine } from 'react-icons/fa6';
import NewLineDialog from './NewLineDialog';

type Props = {
  data: TaskSettingsMultilinear;
  loading: boolean;
  handleChange: (newData: TaskSettings) => void;
  onError: (_: boolean) => void;
};

const rangeKey = (r: TaskMultilinearCoeff) => `${r.minInclusive ? '[' : '('}${r.min}to${r.max}${r.maxInclusive ? ']' : ')'}`;
const showLinearEq = (r: TaskMultilinearCoeff) => {
  if (r.a === 0) return `y = ${r.b}`;
  let bPart = '';
  if (r.b > 0) bPart = ` + ${r.b}`;
  if (r.b < 0) bPart = ` - ${Math.abs(r.b)}`;
  if (r.a === 1) return `x${bPart}`;
  if (r.a === -1) return `-x${bPart}`;
  return `${r.a}x${bPart}`;
};

const EditTaskMultilinearSettings = ({ data, loading, handleChange, onError }: Props) => {
  const [errorOMin, setErrorOMin] = useState<string | null>(null);
  const [errorOMax, setErrorOMax] = useState<string | null>(null);

  useEffect(() => {
    onError(errorOMin !== null || errorOMax !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorOMin, errorOMax]);

  return (
    <div className="border border-gray-300 rounded-lg p-2">
      <div className="flex items-center justify-between w-full">
        <Typography className="font-semibold">Wielolinia</Typography>
        <NewLineDialog
          loading={loading}
          otherRanges={data.multilinear.data.toSorted((a, b) => b.min - a.min)}
          onConfirm={(r) => handleChange({ ...data, multilinear: { ...data.multilinear, data: [...data.multilinear.data, r] } })}
        />
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      {!data.multilinear.data.length && (
        <Typography className="text-xs text-red-600">Nie zdefiniowano żadnych funkcji liniowych.</Typography>
      )}
      <div className="flex flex-col gap-1">
        {data.multilinear.data
          .toSorted((a, b) => a.min - b.min)
          .map((r) => (
            <div key={rangeKey(r)} className="flex items-center justify-between gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <FaArrowsLeftRightToLine className="w-4 h-4 text-purple-600" />
                <Typography className="text-sm">
                  {`${r.minInclusive ? '[' : '('}${r.min}, ${r.max}${r.maxInclusive ? ']' : ')'}: ${showLinearEq(r)}`}
                </Typography>
              </div>
              <TemplateButton
                disabled={loading}
                template="delete"
                onClick={() => {
                  handleChange({
                    ...data,
                    multilinear: { ...data.multilinear, data: data.multilinear.data.filter((v) => rangeKey(v) !== rangeKey(r)) },
                  });
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
            value={data.multilinear.outOfMin}
            onChange={(v) => {
              handleChange({ ...data, multilinear: { ...data.multilinear, outOfMin: v } });
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
            value={data.multilinear.outOfMax}
            error={errorOMax !== null}
            onChange={(v) => {
              handleChange({ ...data, multilinear: { ...data.multilinear, outOfMax: v } });
            }}
            onError={(e) => setErrorOMax(e)}
          />
          {errorOMax !== null && <Typography className="text-xs text-red-600">{errorOMax}</Typography>}
        </div>
      </div>
    </div>
  );
};

export default EditTaskMultilinearSettings;
