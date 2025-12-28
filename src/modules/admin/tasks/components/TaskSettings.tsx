'use client';

import { Accordion, Typography } from '@/lib/mui';
import { TaskSettings } from '@/lib/types/task';
import InputNumber from '@/modules/inputs/components/Number';
import ScoringSystemSwitch from '@/modules/inputs/components/ScoringSystemSwitch';
import { useEffect, useMemo, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import EditTaskLinearSettings from './TaskLinearSettings';
import EditTaskMultilinearSettings from './TaskMultilinearSettings';
import EditTaskRangeSettings from './TaskRangeSettings';
import EditTaskTimeSettings from './TaskTimeSettings';
import EditTaskZoneSettings from './TaskZoneSettings';

type Props = {
  loading: boolean;
  settings: string;
  onChange: (_: string) => void;
  onError: (_: boolean) => void;
};

const EditTaskSettings = ({ loading, settings, onChange, onError }: Props) => {
  const data = useMemo(() => JSON.parse(settings) as TaskSettings, [settings]);
  const zonesError = useMemo(() => data.scoringSystem === 'zones' && !data.zones.length, [data]);
  const rangesError = useMemo(() => data.scoringSystem === 'ranges' && !data.ranges.data.length, [data]);
  const rangesTError = useMemo(
    () => data.scoringSystem === 'time' && data.time.transform === 'ranges' && !data.time.ranges.data.length,
    [data]
  );
  const pLineError = useMemo(() => data.scoringSystem === 'multilinear' && !data.multilinear.data.length, [data]);
  const [rangesBoundsError, setRangesBoundsError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [plineBoundsError, setPLineBoundsError] = useState(false);
  const [linearError, setLinearError] = useState(false);
  const [maxAttError, setMaxAttError] = useState<string | null>(null);

  useEffect(() => {
    onError(
      (data.scoringSystem === 'zones' && zonesError)
        || (data.scoringSystem === 'ranges' && (rangesError || rangesBoundsError))
        || (data.scoringSystem === 'time' && (timeError || rangesTError))
        || (data.scoringSystem === 'linear' && linearError)
        || (data.scoringSystem === 'multilinear' && (plineBoundsError || pLineError))
        || maxAttError !== null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, linearError, zonesError, rangesError, rangesBoundsError, plineBoundsError, pLineError, timeError, rangesTError, maxAttError]);

  const handleChange = (newData: TaskSettings) => {
    onChange(JSON.stringify(newData));
  };

  return (
    <div className="flex flex-col gap-2 border border-gray-400 rounded-lg p-2">
      <div className="flex flex-col md:items-center md:grid md:grid-cols-[max-content_1fr] md:gap-2 gap-px w-full">
        <Typography className="text-sm md:mt-[14px]">Liczba podejść:</Typography>
        <div className="flex flex-col gap-px max-w-[200px]">
          <Typography className="text-xs italic text-gray-800">Puste = nieograniczona liczba</Typography>
          <InputNumber
            optional
            min={1}
            max={1000}
            error={maxAttError !== null}
            value={data.maxAttempts}
            onChange={(maxAttempts, e) => {
              handleChange({ ...data, maxAttempts });
              setMaxAttError(e);
            }}
          />
          {maxAttError !== null && <Typography className="text-xs text-red-600">{maxAttError}</Typography>}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <Typography className="text-sm">Schemat punktacji:</Typography>
        <ScoringSystemSwitch
          value={data.scoringSystem}
          disabled={loading}
          onChange={(scoringSystem) => {
            if (scoringSystem === 'normal') {
              handleChange({ ...data, scoringSystem });
            } else if (scoringSystem === 'zones') {
              handleChange({ ...data, scoringSystem, zones: [{ score: 0, name: '0', shortName: '0' }] });
            } else if (scoringSystem === 'ranges') {
              handleChange({ ...data, scoringSystem, ranges: { data: [], outOfMax: 0, outOfMin: 0 } });
            } else if (scoringSystem === 'time') {
              handleChange({ ...data, scoringSystem, time: { transform: 'hyperbolic', method: 'best', coeffs: { a: 5, b: 1 } } });
            } else if (scoringSystem === 'linear') {
              handleChange({ ...data, scoringSystem, linear: { a: 1, b: 0 } });
            } else {
              handleChange({
                ...data,
                scoringSystem,
                multilinear: {
                  data: [],
                  outOfMin: 0,
                  outOfMax: 0,
                },
              });
            }
          }}
        />
      </div>
      <Accordion defaultValue={data.scoringSystem}>
        <Accordion.Item value={data.scoringSystem} className="!border border-gray-300 rounded-lg bg-blue-50">
          <Accordion.Trigger className="cursor-pointer !px-2 !py-1 group-data-[open=true]:border-b border-b-gray-300">
            <div className="flex items-center gap-2">
              <FaInfoCircle className="w-4 h-4" />
              {data.scoringSystem === 'normal' && <Typography className="text-sm">1:1 (domyślny)</Typography>}
              {data.scoringSystem === 'zones' && <Typography className="text-sm">Strefy (zony)</Typography>}
              {data.scoringSystem === 'ranges' && <Typography className="text-sm">Przedziały liczbowe</Typography>}
              {data.scoringSystem === 'time' && <Typography className="text-sm">Czas</Typography>}
              {data.scoringSystem === 'linear' && <Typography className="text-sm">Liniowy</Typography>}
              {data.scoringSystem === 'multilinear' && <Typography className="text-sm">Wieloliniowy</Typography>}
            </div>
            <IoIosArrowDown className="w-4 h-4 group-data-[open=true]:rotate-180 transition-transform" />
          </Accordion.Trigger>
          {data.scoringSystem === 'normal' && (
            <Accordion.Content className="p-2">
              Wprowadzona wartość liczbowa jest jednocześnie ostatecznym wynikiem za zadanie. Nie występują żadne transformacje.
            </Accordion.Content>
          )}
          {data.scoringSystem === 'zones' && (
            <Accordion.Content className="p-2">
              Jako wynik zadania wprowadzana jest zona (np. Z1, Z2, TOP). Każda zona posiada liczbę punktów liczoną za zadanie. Przykładowe
              użycie: Zony na drogach (0, Z1, Z2, TOP), Bouldery (0, Z, T, F).
            </Accordion.Content>
          )}
          {data.scoringSystem === 'ranges' && (
            <Accordion.Content className="p-2">
              Wprowadzana wartość liczbowa jest przekładana na ostateczny wynik w zależności od przedziału liczbowego w którym się znajduje.
              Przykładowe użycie: Obwody dzielone na strefy (0-5 : 0, 6-10 : 1 ...).
            </Accordion.Content>
          )}
          {data.scoringSystem === 'time' && (
            <Accordion.Content className="p-2">
              Metoda zapewniająca agregację czasów oraz transformację na ostetczny wynik za pomocą metody przedziałów, liniowej albo
              hiperbolicznej. Przykładowe użycie: Czasówki.
            </Accordion.Content>
          )}
          {data.scoringSystem === 'linear' && (
            <Accordion.Content className="p-2">
              Metoda przekształcająca wartość liczbową na ostateczny wynik za pomocą funkcji liniowej. Przykładowe użycie: Obwody nie
              dzielone na strefy (0-40 : y=0,25x : 0-10 pkt.).
            </Accordion.Content>
          )}
          {data.scoringSystem === 'multilinear' && (
            <Accordion.Content className="p-2">
              Metoda przekształcająca wartość liczbową na ostateczny wynik za pomocą kilku połączonych ze sobą funkcji liniowych.
              Przykładowe użycie: Obwody dzielone na strefy uwzględniające liczbę chwytów (0-5 : y=0,001x : 0-0,005 pkt., 6-10 : y=0,001x+1
              : 1,006-1,010 pkt. itd.).
            </Accordion.Content>
          )}
        </Accordion.Item>
      </Accordion>
      {data.scoringSystem === 'zones' && <EditTaskZoneSettings data={data} loading={loading} handleChange={handleChange} />}
      {data.scoringSystem === 'ranges' && (
        <EditTaskRangeSettings data={data} loading={loading} handleChange={handleChange} onError={(e) => setRangesBoundsError(e)} />
      )}
      {data.scoringSystem === 'linear' && (
        <EditTaskLinearSettings data={data} loading={loading} handleChange={handleChange} onError={(e) => setLinearError(e)} />
      )}
      {data.scoringSystem === 'multilinear' && (
        <EditTaskMultilinearSettings data={data} loading={loading} handleChange={handleChange} onError={(e) => setPLineBoundsError(e)} />
      )}
      {data.scoringSystem === 'time' && (
        <EditTaskTimeSettings data={data} loading={loading} handleChange={handleChange} onError={(e) => setTimeError(e)} />
      )}
    </div>
  );
};

export default EditTaskSettings;
