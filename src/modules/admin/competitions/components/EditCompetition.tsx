'use client';

import { Button, Switch, Typography } from '@/lib/mui';
import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardFrame from '@/modules/dashboard/components';
import InputDateTimeRange from '@/modules/inputs/components/DateTimeRange';
import InputString from '@/modules/inputs/components/String';
import { Category, Competition } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import EditFamilySettings from './FamilySettings';
import EditPZASettings from './PZASettings';
import EditSelfScoringSettings from './SelfScoringSettings';

type Props = {
  initComp: Competition;
  loading: boolean;
  categories: Category[];
  onRefresh: () => Promise<void>;
  handleEdit: (_: Competition) => Promise<void>;
  handleBack: () => void;
};

const EditCompetition = ({ initComp, loading, categories, handleEdit, onRefresh, handleBack }: Props) => {
  const [comp, setComp] = useState(initComp);
  const [nameError, setNameError] = useState<string | null>(null);
  const durationError = useMemo(() => {
    if (new Date(comp.startDate).getTime() >= new Date(comp.endDate).getTime()) {
      return 'Nieprawidłowy zakres czasowy.';
    }
    return null;
  }, [comp]);
  const enrollDurationError = useMemo(() => {
    if (new Date(comp.enrollStart).getTime() >= new Date(comp.enrollEnd).getTime()) {
      return 'Nieprawidłowy zakres czasowy.';
    }
    if (new Date(comp.enrollStart).getTime() >= new Date(comp.startDate).getTime()) {
      return 'Zapisy zaczynają się później niż zawody.';
    }
    if (new Date(comp.enrollEnd).getTime() > new Date(comp.endDate).getTime()) {
      return 'Zapisy kończą się później niż koniec zawodów.';
    }
    return null;
  }, [comp]);

  useEffect(() => {
    setComp({ ...initComp });
  }, [initComp]);

  return (
    <DashboardFrame
      title={`Edytuj zawody: ${initComp.name}`}
      refreshing={loading}
      cardHeaderRight={
        <>
          <TemplateButton template="back" disabled={loading} onClick={handleBack} />
          <TemplateButton template="refresh" onClick={onRefresh} disabled={loading} message="Pobierz ponownie dane zawodów" />
        </>
      }
    >
      <div className="flex flex-col md:items-center md:grid md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] md:gap-2 gap-px w-full">
        <Typography type="p">Nazwa:</Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0 w-max">
          <InputString
            required
            error={nameError !== null}
            placeholder="Zawody"
            disabled={loading}
            value={comp.name}
            onChange={(name, e) => {
              setComp((prev) => ({ ...prev, name }));
              setNameError(e);
            }}
          />
          {nameError !== null && <Typography className="text-xs text-red-600">{nameError}</Typography>}
        </div>
        <Typography type="p">Opis:</Typography>
        <textarea
          className="border border-gray-300 rounded shadow resize-y text-sm p-2 focus:border-gray-800 outline-none"
          value={comp.description ?? ''}
          onChange={(e) => {
            setComp((prev) => ({ ...prev, description: e.target.value.trim().length > 0 ? e.target.value : null }));
          }}
        />
        <Typography type="p">Okres trwania:</Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0 w-max">
          <InputDateTimeRange
            begin={new Date(comp.startDate).getTime()}
            end={new Date(comp.endDate).getTime()}
            disabled={loading}
            error={durationError !== null}
            handleBeginChange={(v) => setComp((prev) => ({ ...prev, startDate: new Date(v) }))}
            handleEndChange={(v) => setComp((prev) => ({ ...prev, endDate: new Date(v) }))}
          />
          {durationError !== null && <Typography className="text-xs text-red-600">{durationError}</Typography>}
        </div>
        <Typography type="p">Okres zapisów:</Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0 w-max">
          <InputDateTimeRange
            begin={new Date(comp.enrollStart).getTime()}
            end={new Date(comp.enrollEnd).getTime()}
            disabled={loading}
            error={enrollDurationError !== null}
            handleBeginChange={(v) => setComp((prev) => ({ ...prev, enrollStart: new Date(v) }))}
            handleEndChange={(v) => setComp((prev) => ({ ...prev, enrollEnd: new Date(v) }))}
          />
          {enrollDurationError !== null && <Typography className="text-xs text-red-600">{enrollDurationError}</Typography>}
        </div>
        <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4 mb-2">
          <Switch
            color="info"
            className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
            checked={comp.isInternal}
            onChange={() => setComp((prev) => ({ ...prev, isInternal: !prev.isInternal }))}
          />
          <Typography className="text-sm">Zawody Wewnętrzne</Typography>
        </div>
        <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4 mb-2">
          <Switch
            color="error"
            className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
            checked={comp.lockEnroll}
            onChange={() => setComp((prev) => ({ ...prev, lockEnroll: !prev.lockEnroll }))}
          />
          <Typography className="text-sm">Blokuj Przyjmowanie Zapisów</Typography>
        </div>
        <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4 mb-2">
          <Switch
            color="error"
            className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
            checked={comp.lockResults}
            onChange={() => setComp((prev) => ({ ...prev, lockResults: !prev.lockResults }))}
          />
          <Typography className="text-sm">Blokuj Wpisywanie Wyników</Typography>
        </div>
        <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4 mb-2">
          <Switch
            color="warning"
            className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
            checked={comp.clubMembersPay}
            onChange={() => setComp((prev) => ({ ...prev, clubMembersPay: !prev.clubMembersPay }))}
          />
          <Typography className="text-sm">Członkowie Klubu / SP28 płacą</Typography>
        </div>
        <Typography type="p">Klasyfikacja rodzinna:</Typography>
        <div className="flex flex-col gap-2 border border-gray-400 rounded-lg p-2">
          <div className="flex gap-2 items-center">
            <Switch
              color="success"
              className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
              checked={comp.allowFamilyRanking}
              onChange={() => setComp((prev) => ({ ...prev, allowFamilyRanking: !prev.allowFamilyRanking }))}
            />
            <Typography className="text-sm">{comp.allowFamilyRanking ? 'Włączona' : 'Wyłączona'}</Typography>
          </div>
          <EditFamilySettings
            categories={categories}
            loading={loading}
            settings={comp.familySettings}
            onChange={(v) => setComp((prev) => ({ ...prev, familySettings: v }))}
          />
        </div>
        <Typography type="p">Ustawienia PZA:</Typography>
        <div className="flex flex-col gap-2 border border-gray-400 rounded-lg p-2">
          <EditPZASettings
            categories={categories}
            loading={loading}
            settings={comp.pzaSettings}
            onChange={(v) => setComp((prev) => ({ ...prev, pzaSettings: v }))}
          />
        </div>
        <Typography type="p">Samodzielne wpisywanie wyników:</Typography>
        <div className="flex flex-col gap-2 border border-gray-400 rounded-lg p-2">
          <EditSelfScoringSettings
            categories={categories}
            loading={loading}
            settings={comp.selfScoringSettings}
            onChange={(v) => setComp((prev) => ({ ...prev, selfScoringSettings: v }))}
          />
        </div>
      </div>
      <div className="mt-4">
        <Button
          color="primary"
          disabled={nameError !== null || durationError !== null || enrollDurationError !== null || loading || !comp.name.length}
          onClick={() => handleEdit({ ...comp })}
        >
          Zapisz Zmiany
        </Button>
      </div>
    </DashboardFrame>
  );
};

export default EditCompetition;
