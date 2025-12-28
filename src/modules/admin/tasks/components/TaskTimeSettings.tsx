'use client';

import { Typography } from '@/lib/mui';
import { TaskRange, TaskSettings, TaskSettingsTime } from '@/lib/types/task';
import TemplateButton from '@/modules/buttons/TemplateButton';
import AggSumAvgBest from '@/modules/inputs/components/AggSumAvgBest';
import InputRealNumber from '@/modules/inputs/components/RealNumber';
import TimeSystemSwitch from '@/modules/inputs/components/TimeSystemSwitch';
import { useEffect, useMemo, useState } from 'react';
import { FaArrowRightLong, FaArrowsLeftRightToLine } from 'react-icons/fa6';
import NewTimeRangeDialog from './NewTimeRangeDialog';

type Props = {
  data: TaskSettingsTime;
  loading: boolean;
  handleChange: (newData: TaskSettings) => void;
  onError: (_: boolean) => void;
};

const rangeKey = (r: TaskRange) => `${r.minInclusive ? '[' : '('}${r.min}to${r.max}${r.maxInclusive ? ']' : ')'}`;

const EditTaskTimeSettings = ({ data, loading, handleChange, onError }: Props) => {
  const [errorOMin, setErrorOMin] = useState<string | null>(null);
  const [errorOMax, setErrorOMax] = useState<string | null>(null);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);
  const dataRanges = useMemo(() => (data.time.transform === 'ranges' ? data.time : undefined), [data]);
  const dataCoeffs = useMemo(() => (data.time.transform !== 'ranges' ? data.time : undefined), [data]);
  const [testValue, setTestValue] = useState(1);

  useEffect(() => {
    onError(
      (data.time.transform === 'ranges' && (errorOMin !== null || errorOMax !== null))
        || (data.time.transform !== 'ranges' && (errorA !== null || errorB !== null))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, errorOMin, errorOMax, errorA, errorB]);

  return (
    <div className="border border-gray-300 rounded-lg p-2">
      <div className="flex items-center justify-between w-full">
        <Typography className="font-semibold">Czas</Typography>
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      <div className="flex gap-2 flex-wrap items-center mb-2">
        <Typography className="text-sm">Agregacja czasów:</Typography>
        <AggSumAvgBest
          value={data.time.method}
          disabled={loading}
          onChange={(v) => {
            handleChange({ ...data, time: { ...data.time, method: v } });
          }}
        />
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <Typography className="text-sm">Transformacja:</Typography>
        <TimeSystemSwitch
          value={data.time.transform}
          disabled={loading}
          onChange={(timeSystem) => {
            if (timeSystem === 'ranges') {
              handleChange({ ...data, time: { ...data.time, transform: 'ranges', ranges: { data: [], outOfMax: 0, outOfMin: 0 } } });
            } else if (timeSystem === 'linear') {
              handleChange({ ...data, time: { ...data.time, transform: 'linear', coeffs: { a: 1, b: 0 } } });
            } else {
              handleChange({ ...data, time: { ...data.time, transform: 'hyperbolic', coeffs: { a: 5, b: 1 } } });
            }
          }}
        />
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      {dataRanges && (
        <>
          <div className="flex items-center justify-between w-full">
            <Typography>Przedziały czasowe</Typography>
            <NewTimeRangeDialog
              loading={loading}
              otherRanges={dataRanges.ranges.data.toSorted((a, b) => b.min - a.min)}
              onConfirm={(r) =>
                handleChange({
                  ...data,
                  time: { ...dataRanges, ranges: { ...dataRanges.ranges, data: [...dataRanges.ranges.data, r] } },
                })
              }
            />
          </div>
          <div className="w-full h-px bg-gray-300 my-2" />
          {!dataRanges.ranges.data.length && (
            <Typography className="text-xs text-red-600">Nie zdefiniowano żadnych przedziałów.</Typography>
          )}
          <div className="flex flex-col gap-1">
            {dataRanges.ranges.data
              .toSorted((a, b) => a.score - b.score)
              .map((r) => (
                <div key={rangeKey(r)} className="flex items-center justify-between gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <FaArrowsLeftRightToLine className="w-4 h-4 text-purple-600" />
                    <Typography className="text-sm">
                      {`
                      ${r.minInclusive ? '[' : '('}${r.min.toFixed(3)}, ${r.max.toFixed(3)}${r.maxInclusive ? ']' : ')'}: ${r.score} pkt.`}
                    </Typography>
                  </div>
                  <TemplateButton
                    disabled={loading}
                    template="delete"
                    onClick={() => {
                      handleChange({
                        ...data,
                        time: {
                          ...dataRanges,
                          ranges: { ...dataRanges.ranges, data: dataRanges.ranges.data.filter((v) => rangeKey(v) !== rangeKey(r)) },
                        },
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
                value={dataRanges.ranges.outOfMin}
                onChange={(v) => {
                  handleChange({ ...data, time: { ...dataRanges, ranges: { ...dataRanges.ranges, outOfMin: v } } });
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
                value={dataRanges.ranges.outOfMax}
                error={errorOMax !== null}
                onChange={(v) => {
                  handleChange({ ...data, time: { ...dataRanges, ranges: { ...dataRanges.ranges, outOfMax: v } } });
                }}
                onError={(e) => setErrorOMax(e)}
              />
              {errorOMax !== null && <Typography className="text-xs text-red-600">{errorOMax}</Typography>}
            </div>
          </div>
        </>
      )}
      {dataCoeffs && (
        <>
          <div className="flex items-center justify-between w-full">
            <Typography>{data.time.transform === 'linear' ? 'Linia y=ax+b' : 'Hiperbola y=a/x+b'}</Typography>
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
                value={dataCoeffs.coeffs.a}
                error={errorA !== null}
                onChange={(v) => handleChange({ ...data, time: { ...dataCoeffs, coeffs: { ...dataCoeffs.coeffs, a: v } } })}
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
                value={dataCoeffs.coeffs.b}
                error={errorB !== null}
                onChange={(v) => handleChange({ ...data, time: { ...dataCoeffs, coeffs: { ...dataCoeffs.coeffs, b: v } } })}
                onError={(e) => setErrorB(e)}
              />
              {errorB !== null && <Typography className="text-xs text-red-600">{errorB}</Typography>}
            </div>
          </div>
          {data.time.transform === 'linear' && (
            <>
              {dataCoeffs.coeffs.a === 0 && (
                <Typography className="text-sm italic">Wynik końcowy jest stały i wynosi {dataCoeffs.coeffs.b}.</Typography>
              )}
              {dataCoeffs.coeffs.a !== 0 && (
                <Typography className="text-sm italic">
                  Dla czasu 0 wynik wynosi <b>{dataCoeffs.coeffs.b}</b>. Wzrost czasu o 1s skutkuje
                  <b>{dataCoeffs.coeffs.a > 0 ? ' wzrostem ' : ' spadkiem '}</b>
                  wyniku o <b>{Math.abs(dataCoeffs.coeffs.a)}</b>.
                </Typography>
              )}
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <Typography className="text-sm">Kalkulator:</Typography>
                <div className="max-w-[60px]">
                  <InputRealNumber
                    maxPrecision={3}
                    disabled={loading}
                    optional={false}
                    value={testValue}
                    onChange={(v) => setTestValue(v)}
                  />
                </div>
                <FaArrowRightLong className="w-4 h-4 text-blue-600" />
                <Typography className="font-semibold text-sm">
                  {(testValue * dataCoeffs.coeffs.a + dataCoeffs.coeffs.b).toPrecision()} pkt.
                </Typography>
              </div>
            </>
          )}
          {data.time.transform === 'hyperbolic' && (
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <Typography className="text-sm">Kalkulator:</Typography>
              <div className="max-w-[60px]">
                <InputRealNumber maxPrecision={3} disabled={loading} optional={false} value={testValue} onChange={(v) => setTestValue(v)} />
              </div>
              <FaArrowRightLong className="w-4 h-4 text-blue-600" />
              <Typography className="font-semibold text-sm">
                {(dataCoeffs.coeffs.a / testValue + dataCoeffs.coeffs.b).toPrecision()} pkt.
              </Typography>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditTaskTimeSettings;
