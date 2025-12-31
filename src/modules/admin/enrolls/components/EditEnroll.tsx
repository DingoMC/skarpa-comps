'use client';

import { Button, Switch, Typography } from '@/lib/mui';
import { transformName } from '@/lib/text';
import { UserUI } from '@/lib/types/auth';
import { EnrollUpdateAdmin } from '@/lib/types/enroll';
import { StartListAdmin } from '@/lib/types/startList';
import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardFrame from '@/modules/dashboard/components';
import SelectCategory from '@/modules/inputs/components/CategorySelector';
import InputNumber from '@/modules/inputs/components/Number';
import InputString from '@/modules/inputs/components/String';
import { Category, Competition } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  loading: boolean;
  currCompId: string;
  currComp: Competition;
  categories: Category[];
  originalData: StartListAdmin;
  handleUpdate: (_: EnrollUpdateAdmin) => Promise<void>;
  handleBack: () => void;
};

const AdminEditEnroll = ({ loading, categories, currCompId, currComp, originalData, handleUpdate, handleBack }: Props) => {
  const [data, setData] = useState({ ...originalData, startNumber: originalData.startNumber > 0 ? originalData.startNumber : null });
  const [snError, setSNError] = useState<string | null>(null);

  const saveDisabled = useMemo(() => !data.categoryId.length || snError !== null, [data, snError]);

  useEffect(() => {
    setData((prev) => ({ ...prev, competitionId: currCompId }));
  }, [currCompId]);

  useEffect(() => {
    setData({ ...originalData, startNumber: originalData.startNumber > 0 ? originalData.startNumber : null });
  }, [originalData]);

  return (
    <DashboardFrame
      title={`Edytuj wpis na zawody ${currComp.name}`}
      refreshing={loading}
      cardHeaderRight={<TemplateButton template="back" disabled={loading} onClick={handleBack} />}
    >
      <div className="w-full flex items-start">
        <Typography className="text-lg font-semibold">Dane użytkownika</Typography>
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      <div className="flex flex-col md:items-center md:grid md:grid-cols-[max-content_1fr] md:gap-2 gap-px w-full">
        <Typography type="p">Imię:</Typography>
        <Typography className="text-sm">{transformName(data.user.firstName)}</Typography>
        <Typography type="p">Nazwisko:</Typography>
        <Typography className="text-sm">{transformName(data.user.lastName)}</Typography>
        <Typography type="p">Rok urodzenia:</Typography>
        <Typography className="text-sm">{data.user.yearOfBirth}</Typography>
        <Typography type="p">Płeć:</Typography>
        <Typography className="text-sm">{data.user.gender ? 'Mężczyzna' : 'Kobieta'}</Typography>
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      <div className="w-full flex items-start">
        <Typography className="text-lg font-semibold">Dane rejestracji</Typography>
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      <div className="flex flex-col md:items-center md:grid md:grid-cols-[max-content_1fr] md:gap-2 gap-px w-full">
        <Typography type="p">Klub:</Typography>
        <InputString
          placeholder="Skarpa Lublin"
          disabled={loading}
          value={data.clubName ?? ''}
          onChange={(v) => {
            setData((prev) => ({ ...prev, clubName: v.trim().length > 0 ? v : null }));
          }}
        />
        <Typography type="p">Kategoria:</Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0">
          <SelectCategory
            labelYears
            disabled={loading}
            categories={categories}
            value={data.categoryId}
            onChange={(v) => setData((prev) => ({ ...prev, categoryId: v ?? '' }))}
          />
          {data.categoryId === '' && <Typography className="text-xs text-red-600">Wybierz kategorię</Typography>}
        </div>
        <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
          <Switch
            color="info"
            className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
            checked={data.isClubMember}
            disabled={loading}
            onChange={() => setData((prev) => ({ ...prev, isClubMember: !prev.isClubMember }))}
          />
          <Typography className="text-sm">Członek klubu Skarpa Lublin. / Uczeń Szkoły Podstawowej nr 28 w Lublinie.</Typography>
        </div>
        <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
          <Switch
            color="info"
            className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
            checked={data.isPZAMember}
            disabled={loading}
            onChange={() => setData((prev) => ({ ...prev, isPZAMember: !prev.isPZAMember }))}
          />
          <Typography className="text-sm">Zawodnik PZA.</Typography>
        </div>
        {currComp.allowFamilyRanking && (
          <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
            <Switch
              color="info"
              className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
              checked={data.requestsFamilyRanking}
              disabled={loading}
              onChange={() => setData((prev) => ({ ...prev, requestsFamilyRanking: !prev.requestsFamilyRanking }))}
            />
            <Typography className="text-sm">Start w klasyfikacji rodzinnej.</Typography>
          </div>
        )}
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      <div className="w-full flex items-start">
        <Typography className="text-lg font-semibold">Dane weryfikacyjne</Typography>
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      <div className="flex flex-col md:items-center md:grid md:grid-cols-[max-content_1fr] md:gap-2 gap-px w-full">
        <Typography type="p">Nr Startowy:</Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0">
          <InputNumber
            optional
            value={data.startNumber}
            disabled={loading}
            error={snError !== null}
            min={1}
            max={99999}
            onChange={(v, e) => {
              setData((prev) => ({ ...prev, startNumber: v }));
              setSNError(e);
            }}
          />
          {snError !== null && <Typography className="text-xs text-red-600">{snError}</Typography>}
        </div>
      </div>
      <div className="w-full md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 mt-2">
        <Switch
          color="success"
          className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
          checked={data.verified}
          disabled={loading}
          onChange={() => setData((prev) => ({ ...prev, verified: !prev.verified }))}
        />
        <Typography className="text-sm">Pozytywna weryfikacja</Typography>
        <Switch
          color="success"
          className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
          checked={data.underageConsent}
          disabled={loading || new Date().getFullYear() - data.user.yearOfBirth >= 18}
          onChange={() => setData((prev) => ({ ...prev, underageConsent: !prev.underageConsent }))}
        />
        <Typography className="text-sm">Oświadczenie Rodzica/Opiekuna</Typography>
        <Switch
          color="success"
          className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
          checked={data.hasPaid}
          disabled={loading || (data.isClubMember && !currComp.clubMembersPay)}
          onChange={() => setData((prev) => ({ ...prev, hasPaid: !prev.hasPaid }))}
        />
        <Typography className="text-sm">Opłacono</Typography>
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      <div className="flex w-full justify-center mt-2">
        <Button
          color="info"
          disabled={loading || saveDisabled}
          onClick={() => handleUpdate({ ...data })}
          className={`${loading || saveDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? 'Zapisywanie...' : 'Zapisz'}
        </Button>
      </div>
    </DashboardFrame>
  );
};

export default AdminEditEnroll;
