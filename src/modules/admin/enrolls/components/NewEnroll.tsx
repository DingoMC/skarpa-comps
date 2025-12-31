'use client';

import { EMPTY_ENROLL_CREATE } from '@/lib/constants';
import { Button, Switch, Typography } from '@/lib/mui';
import { transformName } from '@/lib/text';
import { UserUI } from '@/lib/types/auth';
import { EnrollCreateAdmin } from '@/lib/types/enroll';
import TemplateButton from '@/modules/buttons/TemplateButton';
import { autoAssignCategoryByAge } from '@/modules/comp_signups/utils';
import DashboardFrame from '@/modules/dashboard/components';
import InputBirthYear from '@/modules/inputs/components/BirthYear';
import SelectCategory from '@/modules/inputs/components/CategorySelector';
import GenderSwitch from '@/modules/inputs/components/GenderSwitch';
import InputName from '@/modules/inputs/components/Name';
import InputNumber from '@/modules/inputs/components/Number';
import InputString from '@/modules/inputs/components/String';
import SelectUserOptional from '@/modules/inputs/components/UserSelectorOptional';
import { Category, Competition } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  loading: boolean;
  currCompId: string;
  currComp: Competition;
  users: UserUI[];
  categories: Category[];
  handleAdd: (_: EnrollCreateAdmin) => Promise<void>;
  handleBack: () => void;
};

const AdminNewEnroll = ({ loading, categories, users, currCompId, currComp, handleAdd, handleBack }: Props) => {
  const [data, setData] = useState({ ...EMPTY_ENROLL_CREATE, competitionId: currCompId });
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [yearError, setYearError] = useState<string | null>(null);
  const [snError, setSNError] = useState<string | null>(null);

  const saveDisabled = useMemo(
    () =>
      !data.firstName.length
      || !data.lastName.length
      || !data.categoryId.length
      || firstNameError !== null
      || lastNameError !== null
      || yearError !== null
      || snError !== null,
    [firstNameError, lastNameError, data, yearError, snError]
  );

  useEffect(() => {
    setData((prev) => ({ ...prev, competitionId: currCompId }));
  }, [currCompId]);

  return (
    <DashboardFrame
      title={`Nowy wpis na zawody ${currComp.name}`}
      refreshing={loading}
      cardHeaderRight={<TemplateButton template="back" disabled={loading} onClick={handleBack} />}
    >
      <div className="w-full flex items-start">
        <Typography className="text-lg font-semibold">Dane użytkownika</Typography>
      </div>
      <div className="w-full h-px bg-gray-300 my-2" />
      <div className="flex flex-col md:items-center md:grid md:grid-cols-[max-content_1fr] md:gap-2 gap-px w-full">
        <Typography type="p">Istniejący:</Typography>
        <SelectUserOptional
          users={users}
          value={data.userId}
          disabled={loading}
          onChange={(v) => {
            if (v === null) {
              setData((prev) => ({ ...prev, userId: null }));
            } else {
              const found = users.find((u) => u.id === v);
              if (found) {
                setData((prev) => ({
                  ...prev,
                  userId: v,
                  firstName: found.firstName,
                  lastName: found.lastName,
                  gender: found.gender,
                  yearOfBirth: found.yearOfBirth,
                  clubName: found.clubName,
                  isClubMember: found.isClubMember,
                  isPZAMember: found.isPZAMember,
                  categoryId: autoAssignCategoryByAge(found.yearOfBirth, categories),
                }));
              }
            }
          }}
        />
        <Typography type="p">Imię:</Typography>
        {data.userId === null ? (
          <div className="flex flex-col gap-px mb-2 md:mb-0">
            <InputName
              placeholder="Jan"
              allowMultiple
              disabled={loading}
              autoComplete="cc-given-name"
              error={firstNameError !== null}
              value={data.firstName}
              onChange={(v, e) => {
                setFirstNameError(e);
                if (e === null && v.trim().length) {
                  setData((prev) => ({ ...prev, firstName: v, gender: !v.trim().endsWith('a') || v.trim() === 'kuba' }));
                } else {
                  setData((prev) => ({ ...prev, firstName: v }));
                }
              }}
            />
            {firstNameError !== null && <Typography className="text-xs text-red-600">{firstNameError}</Typography>}
          </div>
        ) : (
          <Typography className="text-sm">{transformName(data.firstName)}</Typography>
        )}
        <Typography type="p">Nazwisko:</Typography>
        {data.userId === null ? (
          <div className="flex flex-col gap-px mb-2 md:mb-0">
            <InputName
              placeholder="Kowalski"
              allowMultiple
              disabled={loading}
              autoComplete="cc-family-name"
              error={lastNameError !== null}
              value={data.lastName}
              onChange={(v, e) => {
                setData((prev) => ({ ...prev, lastName: v }));
                setLastNameError(e);
              }}
            />
            {lastNameError !== null && <Typography className="text-xs text-red-600">{lastNameError}</Typography>}
          </div>
        ) : (
          <Typography className="text-sm">{transformName(data.lastName)}</Typography>
        )}
        <Typography type="p">Rok urodzenia:</Typography>
        {data.userId === null ? (
          <div className="flex flex-col gap-px mb-2 md:mb-0">
            <InputBirthYear
              value={data.yearOfBirth}
              disabled={loading}
              error={yearError !== null}
              onChange={(v, e) => {
                setData((prev) => ({ ...prev, yearOfBirth: v, categoryId: autoAssignCategoryByAge(v, categories) }));
                setYearError(e);
              }}
            />
            {yearError !== null && <Typography className="text-xs text-red-600">{yearError}</Typography>}
          </div>
        ) : (
          <Typography className="text-sm">{data.yearOfBirth}</Typography>
        )}
        <Typography type="p">Płeć:</Typography>
        {data.userId === null ? (
          <div className="mb-2 md:mb-0">
            <GenderSwitch value={data.gender} disabled={loading} onChange={(v) => setData((prev) => ({ ...prev, gender: v }))} />
          </div>
        ) : (
          <Typography className="text-sm">{data.gender ? 'Mężczyzna' : 'Kobieta'}</Typography>
        )}
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
          disabled={loading || new Date().getFullYear() - data.yearOfBirth >= 18}
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
          onClick={() => handleAdd({ ...data })}
          className={`${loading || saveDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? 'Zapisywanie...' : 'Zapisz'}
        </Button>
      </div>
    </DashboardFrame>
  );
};

export default AdminNewEnroll;
