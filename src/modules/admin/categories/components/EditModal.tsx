'use client';

import { Button, Dialog, IconButton, Typography } from '@/lib/mui';
import InputNumber from '@/modules/inputs/components/Number';
import InputString from '@/modules/inputs/components/String';
import { Category } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

type Props = {
  loading: boolean;
  data: Category;
  onConfirm: (_: Category) => Promise<void>;
};

const EditModal = ({ loading, data, onConfirm }: Props) => {
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState(data);
  const [nameError, setNameError] = useState<string | null>(null);
  const [seqError, setSeqError] = useState<string | null>(null);
  const [minError, setMinError] = useState<string | null>(null);
  const [maxError, setMaxError] = useState<string | null>(null);

  const saveDisabled = useMemo(
    () => nameError !== null || seqError !== null || minError !== null || maxError !== null || !newData.name.length,
    [minError, maxError, nameError, seqError, newData]
  );

  useEffect(() => {
    setNewData({ ...data });
  }, [data]);

  const handleSave = async () => {
    await onConfirm(newData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger as={IconButton} variant="ghost" size="sm" color="primary" onClick={() => setOpen(!open)}>
        <FaEdit className="w-4 h-4" />
      </Dialog.Trigger>
      <Dialog.Overlay>
        <Dialog.Content>
          <div className="flex items-center justify-between gap-4">
            <Typography type="h6">Edytuj Kategorię</Typography>
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
            <Typography className="text-foreground text-sm">L.p.:</Typography>
            <div className="flex flex-col">
              <InputNumber
                optional={false}
                disabled={loading}
                value={newData.seq}
                error={seqError !== null}
                onChange={(v, e) => {
                  setNewData((prevState) => ({ ...prevState, seq: v }));
                  setSeqError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{seqError}</Typography>
            </div>
            <Typography className="text-foreground text-sm">Nazwa:</Typography>
            <div className="flex flex-col">
              <InputString
                required
                disabled={loading}
                value={newData.name}
                error={nameError !== null}
                onChange={(v, e) => {
                  setNewData((prevState) => ({ ...prevState, name: v }));
                  setNameError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{nameError}</Typography>
            </div>
            <Typography className="text-foreground text-sm">Min. Wiek (opcjonalnie):</Typography>
            <div className="flex flex-col">
              <InputNumber
                optional
                disabled={loading}
                value={newData.minAge}
                error={minError !== null}
                min={0}
                max={newData.maxAge !== null ? Math.min(120, newData.maxAge) : 120}
                onChange={(v, e) => {
                  setNewData((prevState) => ({ ...prevState, minAge: v }));
                  setMinError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{minError}</Typography>
            </div>
            <Typography className="text-foreground text-sm">Max. Wiek (opcjonalnie):</Typography>
            <div className="flex flex-col">
              <InputNumber
                optional
                disabled={loading}
                value={newData.maxAge}
                error={maxError !== null}
                min={newData.minAge !== null ? newData.minAge : 0}
                max={120}
                onChange={(v, e) => {
                  setNewData((prevState) => ({ ...prevState, maxAge: v }));
                  setMaxError(e);
                }}
              />
              <Typography className="text-xs text-red-600">{maxError}</Typography>
            </div>
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

export default EditModal;
