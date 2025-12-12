'use client';

import { Accordion, Typography } from '@/lib/mui';
import { TaskSettings } from '@/lib/types/task';
import TemplateButton from '@/modules/buttons/TemplateButton';
import ScoringSystemSwitch from '@/modules/inputs/components/ScoringSystemSwitch';
import { useMemo } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { FaArrowsLeftRightToLine, FaCircleNodes } from 'react-icons/fa6';
import { IoIosArrowDown } from 'react-icons/io';
import NewRangeDialog from './NewRangeDialog';
import NewZoneDialog from './NewZoneDialog';

type Props = {
  loading: boolean;
  settings: string;
  onChange: (_: string) => void;
};

const EditTaskSettings = ({ loading, settings, onChange }: Props) => {
  const data = useMemo(() => JSON.parse(settings) as TaskSettings, [settings]);

  const handleChange = (newData: TaskSettings) => {
    onChange(JSON.stringify(newData));
  };

  return (
    <div className="flex flex-col gap-2 border border-gray-400 rounded-lg p-2">
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
                multilinear: { b: 0, data: [{ min: 0, max: 10, coeff: 1 }], outOfMin: 0, outOfMax: 10 },
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
      {data.scoringSystem === 'zones' && (
        <div className="border border-gray-300 rounded-lg p-2">
          <div className="flex items-center justify-between w-full">
            <Typography className="font-semibold">Strefy</Typography>
            <NewZoneDialog
              loading={loading}
              otherZones={data.zones}
              onConfirm={(z) => handleChange({ ...data, zones: [...data.zones, z] })}
            />
          </div>
          <div className="w-full h-px bg-gray-300 my-2" />
          {!data.zones.length && <Typography className="text-xs text-red-600">Nie zdefiniowano żadnych stref.</Typography>}
          <div className="flex flex-col gap-1">
            {data.zones
              .toSorted((a, b) => a.score - b.score)
              .map((z) => (
                <div key={z.shortName} className="flex items-center justify-between gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <FaCircleNodes className="w-4 h-4 text-pink-600" />
                    <Typography className="text-sm">{`${z.name} (${z.shortName}): ${z.score} pkt.`}</Typography>
                  </div>
                  <TemplateButton
                    template="delete"
                    onClick={() => handleChange({ ...data, zones: data.zones.filter((v) => v.shortName !== z.shortName) })}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
      {data.scoringSystem === 'ranges' && (
        <div className="border border-gray-300 rounded-lg p-2">
          <div className="flex items-center justify-between w-full">
            <Typography className="font-semibold">Przedziały</Typography>
            <NewRangeDialog
              loading={loading}
              otherRanges={data.ranges.data}
              onConfirm={(r) => handleChange({ ...data, ranges: { ...data.ranges, data: [...data.ranges.data, r] } })}
            />
          </div>
          <div className="w-full h-px bg-gray-300 my-2" />
          {!data.ranges.data.length && <Typography className="text-xs text-red-600">Nie zdefiniowano żadnych przedziałów.</Typography>}
          <div className="flex flex-col gap-1">
            {data.ranges.data
              .toSorted((a, b) => a.score - b.score)
              .map((r) => (
                <div key={r.min} className="flex items-center justify-between gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <FaArrowsLeftRightToLine className="w-4 h-4 text-purple-600" />
                    <Typography className="text-sm">{`${r.min} - ${r.max}: ${r.score} pkt.`}</Typography>
                  </div>
                  <TemplateButton
                    template="delete"
                    onClick={() =>
                      handleChange({ ...data, ranges: { ...data.ranges, data: data.ranges.data.filter((v) => v.min !== r.min) } })
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTaskSettings;
