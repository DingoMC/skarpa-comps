'use client';

import { Button, Switch, Typography } from '@/lib/mui';
import { UserUI } from '@/lib/types/auth';
import TemplateButton from '@/modules/buttons/TemplateButton';
import DashboardFrame from '@/modules/dashboard/components';
import SelectBirthYear from '@/modules/inputs/components/BirthYear';
import GenderSwitch from '@/modules/inputs/components/GenderSwitch';
import InputName from '@/modules/inputs/components/Name';
import SelectRole from '@/modules/inputs/components/Role';
import InputString from '@/modules/inputs/components/String';
import { Role, User } from '@prisma/client';
import { useMemo, useState } from 'react';

type Props = {
  initUser: UserUI;
  loading: boolean;
  roles: Role[];
  onRefresh: () => Promise<void>;
  handleEdit: (_: User) => Promise<void>;
  handleBack: () => void;
};

const AdminEditUser = ({ initUser, loading, roles, handleEdit, onRefresh, handleBack }: Props) => {
  const [user, setUser] = useState<User>({ ...initUser, password: '' });
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);

  const saveDisabled = useMemo(
    () =>
      !user.firstName.length
      || !user.lastName.length
      || !roles.find((r) => r.id === user.roleId)
      || firstNameError !== null
      || lastNameError !== null,
    [roles, firstNameError, lastNameError, user]
  );

  return (
    <DashboardFrame
      title="Edycja użytkownika"
      refreshing={loading}
      cardHeaderRight={
        <>
          <TemplateButton template="back" disabled={loading} onClick={handleBack} />
          <TemplateButton template="refresh" onClick={onRefresh} disabled={loading} message="Pobierz ponownie dane użytkownika" />
        </>
      }
    >
      <div className="flex flex-col md:items-center md:grid md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] md:gap-2 gap-px">
        <Typography type="p">Rola:</Typography>
        <div className="mb-2 md:mb-0">
          <SelectRole roles={roles} value={user.roleId} onChange={(v) => setUser((prev) => ({ ...prev, roleId: v }))} />
        </div>
        <Typography type="p">Imię:</Typography>
        <div className="flex flex-col gap-px mb-2 md:mb-0">
          <InputName
            placeholder="Jan"
            allowMultiple
            disabled={loading}
            autoComplete="cc-given-name"
            error={firstNameError !== null}
            value={user.firstName}
            onChange={(v, e) => {
              setFirstNameError(e);
              if (e === null && v.trim().length) {
                setUser((prev) => ({ ...prev, firstName: v, gender: !v.trim().endsWith('a') }));
              } else {
                setUser((prev) => ({ ...prev, firstName: v }));
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
            value={user.lastName}
            onChange={(v, e) => {
              setUser((prev) => ({ ...prev, lastName: v }));
              setLastNameError(e);
            }}
          />
          {lastNameError !== null && <Typography className="text-xs text-red-600">{lastNameError}</Typography>}
        </div>
        <Typography type="p">E-Mail:</Typography>
        <Typography className="text-xs">{user.email}</Typography>
        <Typography type="p">Klub:</Typography>
        <InputString
          placeholder="Skarpa Lublin"
          disabled={loading}
          value={user.clubName ?? ''}
          onChange={(v) => {
            setUser((prev) => ({ ...prev, clubName: v.trim().length > 0 ? v : null }));
          }}
        />
        <Typography type="p">Rok urodzenia:</Typography>
        <div className="mb-2 md:mb-0">
          <SelectBirthYear value={user.yearOfBirth} onChange={(v) => setUser((prev) => ({ ...prev, yearOfBirth: v }))} />
        </div>
        <Typography type="p">Płeć:</Typography>
        <div className="mb-2 md:mb-0">
          <GenderSwitch value={user.gender} disabled={loading} onChange={(v) => setUser((prev) => ({ ...prev, gender: v }))} />
        </div>
        <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
          <Switch
            color="info"
            className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
            checked={user.isClubMember}
            onChange={() => setUser((prev) => ({ ...prev, isClubMember: !prev.isClubMember }))}
          />
          <Typography className="text-sm">Członek klubu Skarpa Lublin. / Uczeń Szkoły Podstawowej nr 28 w Lublinie</Typography>
        </div>
        <div className="md:col-span-2 grid grid-cols-[40px_1fr] items-center gap-2 md:gap-4">
          <Switch
            color="info"
            className="before:bg-gray-400 after:bg-gray-50 after:border-2 after:w-5 after:h-5 after:border-gray-400 w-10 h-5"
            checked={user.isPZAMember}
            onChange={() => setUser((prev) => ({ ...prev, isPZAMember: !prev.isPZAMember }))}
          />
          <Typography className="text-sm">Zawodnik PZA</Typography>
        </div>
        <div className="md:col-span-2 flex justify-center mt-2">
          <Button
            color="info"
            disabled={loading || saveDisabled}
            onClick={() => handleEdit(user)}
            className={`${loading || saveDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {loading ? 'Zapisywanie...' : 'Zapisz'}
          </Button>
        </div>
      </div>
    </DashboardFrame>
  );
};

export default AdminEditUser;
