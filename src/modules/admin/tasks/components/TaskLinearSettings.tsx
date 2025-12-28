'use client';

import { Typography } from '@/lib/mui';
import { TaskSettings, TaskSettingsLinear } from '@/lib/types/task';
import InputRealNumber from '@/modules/inputs/components/RealNumber';
import { useEffect, useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';

type Props = {
  data: TaskSettingsLinear;
  loading: boolean;
  handleChange: (newData: TaskSettings) => void;
  onError: (_: boolean) => void;
};

const EditTaskLinearSettings = ({ data, loading, handleChange, onError }: Props) => {
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);
  const [testValue, setTestValue] = useState(0);

  useEffect(() => {
    onError(errorA !== null || errorB !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorA, errorB]);

  return (
    <div className="border border-gray-300 rounded-lg p-2">
      <div className="flex items-center justify-between w-full">
        <Typography className="font-semibold">Liniowy</Typography>
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      <div className="flex flex-col md:items-center md:grid md:grid-cols-[max-content_1fr] md:gap-2 gap-px w-full mb-2">
        <Typography className="text-sm">
          Współczynnik <i>a</i>:
        </Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0 w-max">
          <InputRealNumber
            disabled={loading}
            optional={false}
            value={data.linear.a}
            error={errorA !== null}
            onChange={(v) => handleChange({ ...data, linear: { ...data.linear, a: v } })}
            onError={(e) => setErrorA(e)}
          />
          {errorA !== null && <Typography className="text-xs text-red-600">{errorA}</Typography>}
        </div>
        <Typography className="text-sm">
          Współczynnik <i>b</i>:
        </Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0 w-max">
          <InputRealNumber
            disabled={loading}
            optional={false}
            value={data.linear.b}
            error={errorB !== null}
            onChange={(v) => handleChange({ ...data, linear: { ...data.linear, b: v } })}
            onError={(e) => setErrorB(e)}
          />
          {errorB !== null && <Typography className="text-xs text-red-600">{errorB}</Typography>}
        </div>
      </div>
      {data.linear.a === 0 && <Typography className="text-sm italic">Wynik końcowy jest stały i wynosi {data.linear.b}.</Typography>}
      {data.linear.a !== 0 && (
        <Typography className="text-sm italic">
          Dla wartości 0 wynik wynosi <b>{data.linear.b}</b>. Wzrost wartości o 1 skutkuje
          <b>{data.linear.a > 0 ? ' wzrostem ' : ' spadkiem '}</b>
          wyniku o <b>{Math.abs(data.linear.a)}</b>.
        </Typography>
      )}
      <div className="flex items-center gap-2 flex-wrap mt-2">
        <Typography className="text-sm">Kalkulator:</Typography>
        <div className="max-w-[60px]">
          <InputRealNumber disabled={loading} optional={false} value={testValue} onChange={(v) => setTestValue(v)} />
        </div>
        <FaArrowRightLong className="w-4 h-4 text-blue-600" />
        <Typography className="font-semibold text-sm">{(testValue * data.linear.a + data.linear.b).toPrecision()} pkt.</Typography>
      </div>
    </div>
  );
};

export default EditTaskLinearSettings;
