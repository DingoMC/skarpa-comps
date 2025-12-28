'use client';

import { EMPTY_ENROLL } from '@/lib/constants';
import { Button, Switch, Typography } from '@/lib/mui';
import { transformName } from '@/lib/text';
import { UserUI } from '@/lib/types/auth';
import { EnrollRequest } from '@/lib/types/enroll';
import DashboardFrame from '@/modules/dashboard/components';
import SelectBirthYear from '@/modules/inputs/components/BirthYear';
import SelectCategory from '@/modules/inputs/components/CategorySelector';
import SelectCompetition from '@/modules/inputs/components/CompSelector';
import InputEmail from '@/modules/inputs/components/Email';
import GenderSwitch from '@/modules/inputs/components/GenderSwitch';
import InputName from '@/modules/inputs/components/Name';
import InputPassword from '@/modules/inputs/components/Password';
import InputString from '@/modules/inputs/components/String';
import { Category, Competition } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import { autoAssignCategoryByAge } from '../utils';

type Props = {
  user: UserUI | null;
  categories: Category[];
  catIdAuto: string;
  available: Competition[];
  selected: Competition;
  loading: boolean;
  handleEnroll: (_: EnrollRequest) => Promise<void>;
  handleSelectChange: (_: string) => void;
};

const CompSignup = ({ user, catIdAuto, categories, available, selected, loading, handleEnroll, handleSelectChange }: Props) => {
  const [data, setData] = useState({ ...EMPTY_ENROLL });
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState<string | null>(null);
  const [repeatPassword, setRepeatPassword] = useState('');

  const saveDisabled = useMemo(
    () =>
      !data.firstName.length
      || !data.lastName.length
      || !data.email.length
      || !data.categoryId.length
      || (data.password !== null
        && !data.enrollAsChild
        && (passwordError !== null || !data.password.length || repeatPassword !== data.password || repeatPasswordError !== null))
      || firstNameError !== null
      || lastNameError !== null
      || emailError !== null,
    [firstNameError, lastNameError, emailError, data, repeatPassword, passwordError, repeatPasswordError]
  );

  useEffect(() => {
    if (user !== null) {
      setData((prev) => ({
        ...prev,
        email: user.email,
        firstName: transformName(user.firstName),
        lastName: transformName(user.lastName),
        gender: user.gender,
        yearOfBirth: user.yearOfBirth,
        clubName: user.clubName,
        isClubMember: user.isClubMember,
        isPZAMember: user.isPZAMember,
        categoryId: catIdAuto,
      }));
    }
  }, [user, catIdAuto]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5 max-w-[200px]">
        <Typography className="text-xs">(Wybierz zawody)</Typography>
        <SelectCompetition
          competitions={available}
          value={selected.id}
          onChange={(v) => {
            if (v !== null) handleSelectChange(v);
          }}
          disabled={loading}
        />
      </div>
      <DashboardFrame title={`Zapisy na zawody - ${selected.name}`}>
        <div className={`w-full flex flex-col md:items-center md:grid md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] md:gap-2 gap-px`}>
          <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
            <Switch
              color="warning"
              className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
              checked={data.enrollAsChild}
              onChange={() => {
                if (!data.enrollAsChild) {
                  setRepeatPasswordError(null);
                  setPasswordError(null);
                }
                setData((prev) => ({ ...prev, enrollAsChild: !prev.enrollAsChild }));
              }}
            />
            <Typography className="text-sm">Zapisuję się w imieniu dziecka.</Typography>
          </div>
          {data.enrollAsChild && (
            <Typography className="md:col-span-2 text-xs text-amber-950">
              <b>Uwaga!</b> Zapisując się w imieniu dziecka możesz wielokrotnie korzystać z tego samego adresu email. Jednakże, nie będzie
              możliwości stworzenia konta dla dziecka. Jeśli chcesz, aby wprowadzony adres email był połączony z kontem dziecka to nie
              zaznaczaj tej opcji.
            </Typography>
          )}
          <Typography type="p">Imię:</Typography>
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
          <Typography type="p">Nazwisko:</Typography>
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
          <Typography type="p">E-Mail:</Typography>
          {user === null ? (
            <div className="flex flex-col gap-px mb-2 md:mb-0">
              <InputEmail
                placeholder="jan.kowalski@gmail.com"
                error={emailError !== null}
                disabled={loading}
                value={data.email}
                onChange={(v, e) => {
                  setData((prev) => ({ ...prev, email: v }));
                  setEmailError(e);
                }}
              />
              {emailError !== null && <Typography className="text-xs text-red-600">{emailError}</Typography>}
            </div>
          ) : (
            <Typography className="text-sm">{data.email}</Typography>
          )}
          <Typography type="p">Klub:</Typography>
          <InputString
            placeholder="Skarpa Lublin"
            disabled={loading}
            value={data.clubName ?? ''}
            onChange={(v) => {
              setData((prev) => ({ ...prev, clubName: v.trim().length > 0 ? v : null }));
            }}
          />
          <Typography type="p">Rok urodzenia:</Typography>
          <div className="mb-2 md:mb-0">
            <SelectBirthYear
              value={data.yearOfBirth}
              onChange={(v) => setData((prev) => ({ ...prev, yearOfBirth: v, categoryId: autoAssignCategoryByAge(v, categories) }))}
            />
          </div>
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
          <Typography type="p">Płeć:</Typography>
          <div className="mb-2 md:mb-0">
            <GenderSwitch value={data.gender} disabled={loading} onChange={(v) => setData((prev) => ({ ...prev, gender: v }))} />
          </div>
          <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
            <Switch
              color="info"
              className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
              checked={data.isClubMember}
              onChange={() => setData((prev) => ({ ...prev, isClubMember: !prev.isClubMember }))}
            />
            <Typography className="text-sm">
              Jestem członkiem klubu Skarpa Lublin. / Jestem uczniem Szkoły Podstawowej nr 28 w Lublinie.
            </Typography>
          </div>
          <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
            <Switch
              color="info"
              className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
              checked={data.isPZAMember}
              onChange={() => setData((prev) => ({ ...prev, isPZAMember: !prev.isPZAMember }))}
            />
            <Typography className="text-sm">
              Jestem zawodnikiem Polskiego Związku Alpinizmu i w ostatnim roku uczestniczyłem w ogólnopolskich zawodach we wspinaczce
              sportowej.
            </Typography>
          </div>
          {selected.allowFamilyRanking && (
            <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
              <Switch
                color="info"
                className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
                checked={data.requestsFamilyRanking}
                onChange={() => setData((prev) => ({ ...prev, requestsFamilyRanking: !prev.requestsFamilyRanking }))}
              />
              <Typography className="text-sm">Ubiegam się o start w klasyfikacji rodzinnej.</Typography>
            </div>
          )}
          {!data.enrollAsChild && user === null && (
            <>
              <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
                <Switch
                  color="success"
                  className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
                  checked={data.password !== null}
                  onChange={() => {
                    if (data.password !== null) {
                      setRepeatPasswordError(null);
                      setPasswordError(null);
                    }
                    setData((prev) => ({ ...prev, password: prev.password !== null ? null : '' }));
                  }}
                />
                <Typography className="text-sm">Chcę założyć konto.</Typography>
              </div>
              {data.password !== null && (
                <>
                  <Typography type="p">Hasło:</Typography>
                  <div className="flex flex-col gap-px mb-2 md:mb-0">
                    <InputPassword
                      placeholder="********"
                      error={passwordError !== null}
                      disabled={loading}
                      value={data.password ?? ''}
                      autoComplete="new-password"
                      onChange={(v, e) => {
                        setData((prev) => ({ ...prev, password: v }));
                        setPasswordError(e);
                        if (v !== repeatPassword) {
                          setRepeatPasswordError('Powtórz poprawnie swoje hasło.');
                        } else {
                          setRepeatPasswordError(null);
                        }
                      }}
                    />
                    {passwordError !== null && <Typography className="text-xs text-red-600">{passwordError}</Typography>}
                  </div>
                  <Typography type="p">Powtórz hasło:</Typography>
                  <div className="flex flex-col gap-px mb-2 md:mb-0">
                    <InputPassword
                      placeholder="********"
                      error={repeatPasswordError !== null}
                      disabled={loading}
                      value={repeatPassword}
                      repeatAfter={data.password ?? ''}
                      autoComplete="new-password"
                      onChange={(v, e) => {
                        setRepeatPassword(v);
                        setRepeatPasswordError(e);
                      }}
                    />
                    {repeatPasswordError !== null && <Typography className="text-xs text-red-600">{repeatPasswordError}</Typography>}
                  </div>
                </>
              )}
            </>
          )}
          <div className="md:col-span-2 flex justify-center mt-2">
            <Button
              color="info"
              disabled={loading || saveDisabled}
              onClick={() => handleEnroll({ ...data, competitionId: selected.id })}
              className={`${loading || saveDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? 'Zapisywanie...' : 'Zapisz się'}
            </Button>
          </div>
        </div>
      </DashboardFrame>
    </div>
  );
};

export default CompSignup;
