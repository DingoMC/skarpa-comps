'use client';

import { Button, Dialog, IconButton, Typography } from '@/lib/mui';
import { TaskRange } from '@/lib/types/task';
import InputNumber from '@/modules/inputs/components/Number';
import { useEffect, useMemo, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

type Props = {
  loading: boolean;
  otherRanges: TaskRange[];
  onConfirm: (_: TaskRange) => void;
};

const getRangeError = (newRange: TaskRange, ranges: TaskRange[]) => {
  const { min: newMin, max: newMax } = newRange;

  if (newMax < newMin) return 'Nieprawidłowy zakres.';

  if (!ranges.length) return null;

  if (ranges.some(({ min, max }) => newMin <= max && newMax >= min)) {
    return 'Przedział pokrywa się z obecnymi już przedziałami.';
  }

  return null;
};

const NewRangeDialog = ({ loading, otherRanges, onConfirm }: Props) => {
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState<TaskRange>({
    min: otherRanges.length > 0 ? Math.max(...otherRanges.map((v) => v.max)) + 1 : 0,
    max: otherRanges.length > 0 ? Math.max(...otherRanges.map((v) => v.max)) + 2 : 1,
    score: 0,
  });
  const rangeError = useMemo(() => getRangeError(newData, otherRanges), [newData, otherRanges]);

  const saveDisabled = useMemo(() => newData.min > newData.max || rangeError !== null, [rangeError, newData]);

  useEffect(() => {
    setNewData({
      min: otherRanges.length > 0 ? Math.max(...otherRanges.map((v) => v.max)) + 1 : 0,
      max: otherRanges.length > 0 ? Math.max(...otherRanges.map((v) => v.max)) + 2 : 1,
      score: 0,
    });
  }, [open, otherRanges]);

  const handleSave = () => {
    onConfirm(newData);
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
            <Typography type="h6">Nowy przedział</Typography>
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
            <Typography className="text-foreground text-sm">Min.:</Typography>
            <div className="flex flex-col">
              <InputNumber
                optional={false}
                disabled={loading}
                value={newData.min}
                min={0}
                onChange={(v) => {
                  setNewData((prevState) => ({ ...prevState, min: v }));
                }}
              />
            </div>
            <Typography className="text-foreground text-sm">Max.:</Typography>
            <div className="flex flex-col">
              <InputNumber
                optional={false}
                disabled={loading}
                value={newData.max}
                min={0}
                onChange={(v) => {
                  setNewData((prevState) => ({ ...prevState, max: v }));
                }}
              />
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
            <Typography className="col-span-2 text-red-600 text-sm">{rangeError}</Typography>
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

export default NewRangeDialog;
