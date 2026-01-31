'use client';

import { Button, Switch, Typography } from '@/lib/mui';
import { objectDeepEqual } from '@/lib/object';
import { UserUI } from '@/lib/types/auth';
import DashboardFrame from '@/modules/dashboard/components';
import ConfirmDialog from '@/modules/dialogs/ConfirmDialog';
import InputBirthYear from '@/modules/inputs/components/BirthYear';
import InputEmail from '@/modules/inputs/components/Email';
import GenderSwitch from '@/modules/inputs/components/GenderSwitch';
import InputName from '@/modules/inputs/components/Name';
import InputPassword from '@/modules/inputs/components/Password';
import InputString from '@/modules/inputs/components/String';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  originalData: UserUI;
  loading: boolean;
  onProfileUpdate: (_: UserUI) => Promise<void>;
  onEmailUpdate: (_: string) => Promise<void>;
  onPasswordUpdate: (_o: string, _n: string) => Promise<void>;
};

const UserProfile = ({ originalData, loading, onProfileUpdate, onEmailUpdate, onPasswordUpdate }: Props) => {
  const [editData, setEditData] = useState<UserUI>(originalData);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [yearError, setYearError] = useState<string | null>(null);
  // For email
  const [emailError, setEmailError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState(originalData.email);
  // For password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState<string | null>(null);

  const updateProfileDisabled = useMemo(
    () =>
      !editData.firstName.length
      || !editData.lastName.length
      || firstNameError !== null
      || lastNameError !== null
      || yearError !== null
      || objectDeepEqual(originalData, editData),
    [editData, firstNameError, lastNameError, yearError, originalData]
  );

  const updatePasswordDisabled = useMemo(
    () =>
      !currentPassword.length
      || !newPassword.length
      || !repeatPassword.length
      || newPassword !== repeatPassword
      || newPassword === currentPassword
      || repeatPasswordError !== null
      || passwordError !== null,
    [currentPassword, newPassword, repeatPassword, passwordError, repeatPasswordError]
  );

  useEffect(() => {
    setEditData({ ...originalData });
  }, [originalData]);

  return (
    <DashboardFrame title="Mój Profil" refreshing={loading}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Typography type="h6">Dane osobowe</Typography>
          <div className="w-full h-px bg-gray-300" />
          <div className="flex flex-col md:items-center md:grid md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] md:gap-2 gap-px">
            <Typography type="p">Imię:</Typography>
            <div className="flex flex-col gap-px mb-2 md:mb-0">
              <InputName
                placeholder="Jan"
                allowMultiple
                disabled={loading}
                autoComplete="cc-given-name"
                error={firstNameError !== null}
                value={editData.firstName}
                onChange={(v, e) => {
                  setFirstNameError(e);
                  if (e === null && v.trim().length) {
                    setEditData((prev) => ({ ...prev, firstName: v, gender: !v.trim().endsWith('a') }));
                  } else {
                    setEditData((prev) => ({ ...prev, firstName: v }));
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
                value={editData.lastName}
                onChange={(v, e) => {
                  setEditData((prev) => ({ ...prev, lastName: v }));
                  setLastNameError(e);
                }}
              />
              {lastNameError !== null && <Typography className="text-xs text-red-600">{lastNameError}</Typography>}
            </div>
            <Typography type="p">Klub:</Typography>
            <InputString
              placeholder="Skarpa Lublin"
              disabled={loading}
              value={editData.clubName ?? ''}
              onChange={(v) => {
                setEditData((prev) => ({ ...prev, clubName: v.trim().length > 0 ? v : null }));
              }}
            />
            <Typography type="p">Rok urodzenia:</Typography>
            <div className="flex flex-col gap-px mb-2 md:mb-0">
              <InputBirthYear
                value={editData.yearOfBirth}
                disabled={loading}
                error={yearError !== null}
                onChange={(v, e) => {
                  setEditData((prev) => ({ ...prev, yearOfBirth: v }));
                  setYearError(e);
                }}
              />
              {yearError !== null && <Typography className="text-xs text-red-600">{yearError}</Typography>}
            </div>
            <Typography type="p">Płeć:</Typography>
            <div className="mb-2 md:mb-0">
              <GenderSwitch value={editData.gender} disabled={loading} onChange={(v) => setEditData((prev) => ({ ...prev, gender: v }))} />
            </div>
            <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
              <Switch
                color="info"
                className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
                checked={editData.isClubMember}
                onChange={() => setEditData((prev) => ({ ...prev, isClubMember: !prev.isClubMember }))}
              />
              <Typography className="text-sm">
                Jestem członkiem klubu Skarpa Lublin. / Jestem uczniem Szkoły Podstawowej nr 28 w Lublinie.
              </Typography>
            </div>
            <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
              <Switch
                color="info"
                className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
                checked={editData.isPZAMember}
                onChange={() => setEditData((prev) => ({ ...prev, isPZAMember: !prev.isPZAMember }))}
              />
              <Typography className="text-sm">
                Jestem zawodnikiem Polskiego Związku Alpinizmu i w ostatnim roku uczestniczyłem w ogólnopolskich zawodach we wspinaczce
                sportowej.
              </Typography>
            </div>
            <div className="md:col-span-2 flex justify-center mt-2">
              <Button
                color="info"
                disabled={loading || updateProfileDisabled}
                onClick={() => onProfileUpdate(editData)}
                className={`${loading || updateProfileDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {loading ? 'Zapisywanie...' : 'Zapisz'}
              </Button>
            </div>
          </div>
          <div className="w-full h-px bg-gray-400 mt-2" />
          <Typography type="h6">Dane logowania</Typography>
          <div className="w-full h-px bg-gray-300" />
          <div className="flex flex-col gap-1">
            <Typography type="p" className="font-semibold">
              Zmień adres E-mail
            </Typography>
            <div className="flex gap-1 flex-wrap items-start">
              <div className="flex flex-col gap-px mb-2 md:mb-0">
                <InputEmail
                  placeholder="jan.kowalski@gmail.com"
                  error={emailError !== null}
                  disabled={loading}
                  value={newEmail}
                  onChange={(v, e) => {
                    setNewEmail(v.trim());
                    setEmailError(e);
                  }}
                />
                {emailError !== null && <Typography className="text-xs text-red-600">{emailError}</Typography>}
              </div>
              <ConfirmDialog
                triggerAs="text"
                trigger="Zmień"
                triggerColor="primary"
                triggerVariant="gradient"
                triggerClassName="mt-0.5"
                loading={loading}
                triggerDisabled={newEmail === originalData.email || emailError !== null}
                header="Potwierdź zmianę adresu E-mail"
                content={`Czy na pewno chcesz zmienić swój adres E-mail na ${newEmail}? Po zmianie adresu nastąpi wylogowanie.`}
                onConfirm={() => onEmailUpdate(newEmail)}
              />
            </div>
          </div>
          <div className="w-full h-px bg-gray-300 mt-2" />
          <div className="flex flex-col gap-1">
            <Typography type="p" className="font-semibold">
              Ustaw nowe hasło
            </Typography>
            <div className="flex flex-col md:items-center md:grid md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] md:gap-2 gap-px">
              <Typography type="p" className="mt-2 md:mt-0">
                Obecne hasło:
              </Typography>
              <InputPassword
                placeholder="********"
                disabled={loading}
                value={currentPassword}
                autoComplete="current-password"
                onChange={(v) => setCurrentPassword(v)}
              />
              <Typography type="p">Nowe hasło:</Typography>
              <div className="flex flex-col gap-px mb-2 md:mb-0">
                <InputPassword
                  placeholder="********"
                  error={passwordError !== null}
                  disabled={loading}
                  value={newPassword}
                  autoComplete="new-password"
                  onChange={(v, e) => {
                    setNewPassword(v);
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
              <Typography type="p">Powtórz nowe hasło:</Typography>
              <div className="flex flex-col gap-px mb-2 md:mb-0">
                <InputPassword
                  placeholder="********"
                  error={repeatPasswordError !== null}
                  disabled={loading}
                  value={repeatPassword}
                  repeatAfter={newPassword}
                  autoComplete="new-password"
                  onChange={(v, e) => {
                    setRepeatPassword(v);
                    setRepeatPasswordError(e);
                  }}
                />
                {repeatPasswordError !== null && <Typography className="text-xs text-red-600">{repeatPasswordError}</Typography>}
              </div>
              <div className="md:col-span-2 flex justify-center mt-2">
                <ConfirmDialog
                  triggerAs="text"
                  trigger="Ustaw hasło"
                  triggerColor="primary"
                  triggerVariant="gradient"
                  triggerClassName="mt-0.5"
                  loading={loading}
                  triggerDisabled={updatePasswordDisabled}
                  header="Potwierdź zmianę hasła"
                  content={`Czy na pewno chcesz zmienić swoje hasło? Po zmianie hasła nastąpi wylogowanie.`}
                  onConfirm={() => onPasswordUpdate(currentPassword, newPassword)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardFrame>
  );
};

export default UserProfile;
