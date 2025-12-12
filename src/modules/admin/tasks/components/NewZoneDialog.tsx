'use client';

import { Button, Dialog, IconButton, Typography } from '@/lib/mui';
import { TaskZone } from '@/lib/types/task';
import InputNumber from '@/modules/inputs/components/Number';
import InputString from '@/modules/inputs/components/String';
import { useEffect, useMemo, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

type Props = {
  loading: boolean;
  otherZones: TaskZone[];
  onConfirm: (_: TaskZone) => void;
};

const NewZoneDialog = ({ loading, otherZones, onConfirm }: Props) => {
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState<TaskZone>({ name: '', shortName: '', score: 0 });
  const [nameError, setNameError] = useState<string | null>(null);
  const [shortNameError, setShortNameError] = useState<string | null>(null);

  const saveDisabled = useMemo(
    () => nameError !== null || shortNameError !== null || !newData.name.length || !newData.shortName.length,
    [nameError, shortNameError, newData]
  );

  useEffect(() => {
    setNewData({ name: '', shortName: '', score: 0 });
  }, [open]);

  const handleSave = () => {
    onConfirm({ ...newData, name: newData.name.trim(), shortName: newData.shortName.trim() });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger as={Button} variant="gradient" size="sm" color="info" onClick={() => setOpen(!open)}>
        Dodaj
      </Dialog.Trigger>
      <Dialog.Overlay>
        <Dialog.Content>
          <div className="flex items-center justify-between gap-4">
            <Typography type="h6">Nowa strefa</Typography>
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
                value={newData.name}
                error={nameError !== null}
                onChange={(v, e) => {
                  setNewData((prevState) => ({ ...prevState, name: v }));
                  if (otherZones.find((z) => z.name === v.trim())) setNameError('Strefa o podanej nazwie już istnieje.');
                  else setNameError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{nameError}</Typography>
            </div>
            <Typography className="text-foreground text-sm">Skrót:</Typography>
            <div className="flex flex-col">
              <InputString
                required
                disabled={loading}
                value={newData.shortName}
                error={shortNameError !== null}
                onChange={(v, e) => {
                  setNewData((prevState) => ({ ...prevState, shortName: v }));
                  if (otherZones.find((z) => z.name === v.trim())) setShortNameError('Strefa o podanym skrócie już istnieje.');
                  else setShortNameError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{shortNameError}</Typography>
            </div>
            <Typography className="text-foreground text-sm">Punkty:</Typography>
            <div className="flex flex-col">
              <InputNumber
                optional={false}
                disabled={loading}
                value={newData.score}
                min={0}
                onChange={(v) => {
                  setNewData((prevState) => ({ ...prevState, score: v }));
                }}
              />
            </div>
          </div>
          <div className="mb-1 flex items-center justify-end gap-2">
            <Dialog.DismissTrigger as={Button} variant="ghost" color="error" disabled={loading}>
              Anuluj
            </Dialog.DismissTrigger>
            <Button onClick={() => handleSave()} disabled={loading || saveDisabled}>
              Dodaj
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog>
  );
};

export default NewZoneDialog;
