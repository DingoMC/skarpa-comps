'use client';

import { Button, Dialog, IconButton, Typography } from '@/lib/mui';
import { StartListAdmin } from '@/lib/types/startList';
import InputString from '@/modules/inputs/components/String';
import SelectUserMulti from '@/modules/inputs/components/UserSelectorMulti';
import { useEffect, useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { AdminFamily } from '../types';

type Props = {
  loading: boolean;
  data: AdminFamily[];
  users: StartListAdmin[];
  onConfirm: (_n: string, _ucids: string[]) => Promise<void>;
};

const AddModal = ({ loading, data, users, onConfirm }: Props) => {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [userCompIds, setUserCompIds] = useState<string[]>([]);
  const [nameError, setNameError] = useState<string | null>(null);
  const allowedUsers = useMemo(() => {
    const usersAlreadyMembers = data.flatMap((af) => af.userFamilies.map((v) => v.userCompId));
    return users.filter((v) => !usersAlreadyMembers.includes(v.id));
  }, [data, users]);

  const saveDisabled = useMemo(() => nameError !== null || !newName.length, [nameError, newName]);

  const handleSave = async () => {
    await onConfirm(newName, userCompIds);
    setOpen(false);
  };

  useEffect(() => {
    setNewName('');
    setUserCompIds([]);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger as={IconButton} variant="ghost" size="sm" color="secondary" onClick={() => setOpen(!open)}>
        <FaPlus className="w-4 h-4 text-white" />
      </Dialog.Trigger>
      <Dialog.Overlay>
        <Dialog.Content>
          <div className="flex items-center justify-between gap-4">
            <Typography type="h6">Nowa Rodzina</Typography>
            <Dialog.DismissTrigger
              as={IconButton}
              size="sm"
              variant="ghost"
              color="secondary"
              className="absolute right-2 top-2"
              disabled={loading}
              isCircular
            >
              <IoMdClose className="h-5 w-5" />
            </Dialog.DismissTrigger>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-[100px_1fr] gap-2 mb-6 mt-2 md:items-center">
            <Typography className="text-foreground text-sm">Nazwa:</Typography>
            <div className="flex flex-col">
              <InputString
                required
                disabled={loading}
                value={newName}
                error={nameError !== null}
                onChange={(v, e) => {
                  setNewName(v);
                  setNameError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{nameError}</Typography>
            </div>
            <Typography className="text-foreground text-sm">Członkowie:</Typography>
            <SelectUserMulti users={allowedUsers} value={userCompIds} onChange={(v) => setUserCompIds([...v])} />
          </div>
          <div className="mb-1 flex items-center justify-end gap-2">
            <Dialog.DismissTrigger as={Button} variant="ghost" color="error" disabled={loading}>
              Anuluj
            </Dialog.DismissTrigger>
            <Button onClick={() => handleSave()} disabled={loading || saveDisabled}>
              Zapisz
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog>
  );
};

export default AddModal;
